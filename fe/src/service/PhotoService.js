import axiosInstance from "../instance/axiosInstance";

export const upload = async (files) => {
    const formData = new FormData();
    files.forEach(item => formData.append('files', item))
    return await axiosInstance.post('/photos/upload', formData, {
        headers: {"Content-Type":"multipart/form-data"}
    });
}