import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { KEY } from '../common/Const';
import { getToken, logoutAfter } from '../helper/Util';
import { toast } from 'react-toastify';
import { loadingStore } from "../store/LoadingStore";
import { refresh } from '../service/AuthService';

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: KEY.API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

let isRefreshing = false;
let refreshPromise = null;

// Thêm interceptor vào request để kiểm tra và làm mới token nếu cần
axiosInstance.interceptors.request.use(
  async (config) => {
    loadingStore.set(true);
    let token = getToken();
    if (token) {
      const tokenExpiration = jwtDecode(token).exp;
      const currentTime = Date.now() / 1000;
      const timeRemaining = tokenExpiration - currentTime;

      // Token sắp hết hạn
      if (timeRemaining < 10 * 60) {

        // Nếu KHÔNG có refresh đang chạy → bắt đầu refresh
        if (!isRefreshing) {
          isRefreshing = true;

          refreshPromise = refresh(token)
            .then(response => {
              console.log(response)
              const newToken = response.data.data.token;
              localStorage.setItem(KEY.LOCAL_STORAGE.AUTH_TOKEN, newToken);
              return newToken;
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        // Các request khác đợi refresh xong
        try {
          token = await refreshPromise;
        } catch {}
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  }
);

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    // Nếu thành công thì trả về response như bình thường
    loadingStore.set(false);
    return response;
  },
  async (error) => {
    console.log(error)
    loadingStore.set(false);
    // Nếu lỗi liên quan đến xác thực (ví dụ token hết hạn)
    if (error.response && error.response.status === 401) {
      if (error?.response?.data?.code === 1006) {
        logoutAfter();
        localStorage.setItem(KEY.LOCAL_STORAGE.MESSAGE, JSON.stringify({type: 'warning', message: 'Vui lòng đăng nhập lại'}));
        window.location.href = '/';
      } else 
        toast.error('Bạn không có quyền truy cập chức năng này');
    } else 
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    // Nếu là lỗi khác thì trả về reject để nơi gọi tự xử lý
    return Promise.reject(error);
  }
);

export default axiosInstance;
