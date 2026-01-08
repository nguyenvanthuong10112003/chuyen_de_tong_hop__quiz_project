import axiosInstance from "../instance/axiosInstance";
import { serialize } from 'object-to-formdata';

export const laycauhoi = async (cauhoiid) => {
    try {
        const response = await axiosInstance.get(`/questions/${encodeURIComponent(cauhoiid)}`)
        if (response && response.data) {
            const { result, code } = response.data;
            return { result, code };
        } else {
            throw new Error("Dữ liệu trả về từ API không hợp lệ");
        }
    }
    catch (error) {
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
}

export const create = async (request) => {
    return await axiosInstance.post('/questions/create', request);
}

export const update = async (request) => {
    return await axiosInstance.post('/questions/update', request);
}

export const lstSubject = async () => {
    return await axiosInstance.get('/questions/subjects');
}

export const getsByTopic = async (id) => {
    return await axiosInstance.get(`/questions/gets-by-topic?id=${encodeURIComponent(id)}`);
}

export const getById = async (id) => {
    return await axiosInstance.get(`/questions/${encodeURIComponent(id)}`);
}

export const remove = async (lst) => {
    return await axiosInstance.post('/questions/remove', lst);
}

export const search = async (subjectId, topicId) => {
    return await axiosInstance.get(`/questions/search?topicId=${encodeURIComponent(topicId)}&subjectId=${encodeURIComponent(subjectId)}`)
}