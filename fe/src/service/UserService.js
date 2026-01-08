import axios from "axios";
import { KEY } from "../common/Const";
import axiosInstance from "../instance/axiosInstance";

export const Taotaikhoan = async (username, password, nickname) => {
    try {
        // Gửi request đến API
        const response = await axios.post(`${KEY.API_BASE_URL}/users`, { username, password, nickname });

        // Kiểm tra xem response và response.data.result có tồn tại không
        if (response && response.data) {
            const { message, code } = response.data;
            return { message, code };
        } else {
            // Trả về thông báo lỗi nếu response không hợp lệ
            throw new Error("Dữ liệu trả về từ API không hợp lệ");
        }
    } catch (error) {
        if (error.response) {
            // Lấy thông tin từ phản hồi lỗi
            const { message, code } = error.response.data;

            return { message, code };
        } else if (error.request) {
            // Xử lý nếu không nhận được phản hồi
            console.error('No response received:', error.request);
        } else {
            // Xử lý các lỗi khác
            console.error('Error during request setup:', error.message);
        }
    }

}
export const dangki = async (nickname, username, password) => {
    try {
        const response = await axios.post(`${KEY.API_BASE_URL}/users`, {
            username,
            password,
            nickname
        });

        if (response.data.code !== 0) {
            throw new Error(response.data.message || 'Sigin failed');
        }
    } catch (error) {
        console.error('Error during đang kí:', error.response?.data?.message || error.message);
        throw error;
    }
};
export const laylaimatkhau = async (username, password) => {
    try {
        // Gửi yêu cầu PUT
        const response = await axios.put(`${KEY.API_BASE_URL}/users`, {
            username,
            password,
        });

        // Kiểm tra nếu response và response.data tồn tại và có cấu trúc đúng
        if (response && response.data) {
            const { message, code } = response.data;
            return { message, code };
        } else {
            throw new Error("Dữ liệu trả về từ API không hợp lệ");
        }
    } catch (error) {
        // Kiểm tra nếu có lỗi trong phản hồi
        if (error.response) {
            const { message, code } = error.response.data || {}; // Cố gắng lấy message và code nếu có
            return { message, code };
        } else if (error.request) {
            // Xử lý nếu không nhận được phản hồi từ server
            console.error("No response received:", error.request);
            throw new Error("Không nhận được phản hồi từ server");
        } else {
            // Xử lý các lỗi khác
            console.error("Error during request setup:", error.message);
            throw new Error(error.message || "Đã có lỗi xảy ra");
        }
    }
};
export const searchToInvite = async (input, classId) => {
    return await axiosInstance.get(`/users/search-to-invite?patternEmail=${encodeURIComponent(input)}&classId=${encodeURIComponent(classId)}`);
}