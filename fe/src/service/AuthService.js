import axios from 'axios';
import { KEY } from '../common/Const';
import axiosInstance from '../instance/axiosInstance';
import { loadingStore } from '../store/LoadingStore';

axios.interceptors.request.use(
  async (config) => {
    loadingStore.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return config;
  }
);

axios.interceptors.response.use(
  (response) => {
    loadingStore.set(false);
    return response;
  },
  (error) => {
    loadingStore.set(false);
    return Promise.reject(error); 
  }
);

export const login = async (username, password) => {
    return await axios.post(`${KEY.API_BASE_URL}/auth/login`, {
            username,
            password,
        });
};
export const register = async (username, password, fullName) => {
    return await axios.post(`${KEY.API_BASE_URL}/auth/register`, {
            username,
            password,
            fullName
        });
};
export const refresh = async (token) => {
    return await axios.post(`${KEY.API_BASE_URL}/auth/refresh`, 
      {
        token    
      });
};
export const logout = async () => {
    return await axiosInstance.post(`${KEY.API_BASE_URL}/auth/logout`);
};
export const verifyToken = async (token) => {
    try {
        const response = await axios.post(`${KEY.API_BASE_URL}/auth/introspect`, { token });
        const { valid } = response.data.result;
        return { valid }; // API trả về `true` hoặc `false`

    } catch (error) {
        console.error('Error verifying token:', error);
        return false; // Nếu có lỗi, coi như token không hợp lệ
    }
};