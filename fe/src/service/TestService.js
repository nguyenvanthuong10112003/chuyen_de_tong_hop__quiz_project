import axiosInstance from "../instance/axiosInstance";

export const laybaikiemtra = async (classid) => {
    try {
        const response = await axiosInstance.get(`/test/${classid}`)
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


export const suabaikiemtra = async (testid, quizData) => {
	try {
		console.log(quizData);
		const response = await axiosInstance.put(`/test/${testid}`, quizData);

		// Kiểm tra nếu response có dữ liệu
		if (response && response.data) {
			const { message, code } = response.data;
			return { message, code };
		} else {
			throw new Error("Dữ liệu trả về từ API không hợp lệ");
		}
	} catch (error) {
		// Xử lý lỗi 400
		if (error.response) {
			// Kiểm tra nếu mã lỗi là 400
			if (error.response.status === 400) {
				// Lỗi 400 (Bad Request)
				console.error("Lỗi 400 - Yêu cầu không hợp lệ:", error.response.data);
				return { message: "Yêu cầu không hợp lệ", code: 400 };
			}

			// Lấy message và code nếu có trong phản hồi lỗi
			const { message, code } = error.response.data || {};
			return { message, code };
		} else if (error.request) {
			// Xử lý khi không nhận được phản hồi từ server
			console.error("No response received:", error.request);
			throw new Error("Không nhận được phản hồi từ server");
		} else {
			// Xử lý các lỗi khác (ví dụ lỗi trong setup yêu cầu)
			console.error("Error during request setup:", error.message);
			throw new Error(error.message || "Đã có lỗi xảy ra");
		}
	}
};

export const taokiemtra = async (classid, quizData) => {
	try {
		const response = await axiosInstance.post(`/test/${classid}`, quizData)
		if (response && response.data) {
			const { message, code } = response.data;
			return { message, code };
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
export const laybaikiem = async () => {
	try {
		const response = await axiosInstance.get(`/test`)
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
	return axiosInstance.post('/tests/create', request)
}

export const update = async (request) => {
	return axiosInstance.post('/tests/update', request)
}

export const getById = async (id) => {
	return axiosInstance.get('/tests/' + id);
}

export const createSession = async (testId) => {
	return axiosInstance.post('/tests/session/create', {testId})
}

export const getSessionById = async (sessionId) => {
	return axiosInstance.get('/tests/session/' + sessionId)
}

export const submit = async (sessionId) => {
	return axiosInstance.post('/tests/session/submit', {sessionId})
}

export const historiesAll = async (testId) => {
	return axiosInstance.get(`/tests/history-all?testId=${testId}`)
}

export const fnHistories = async (testId) => {
	return axiosInstance.get(`/tests/history?testId=${testId}`);
}

export const removeTest = async (testId) => {
	return axiosInstance.post('/tests/remove', {testId})
}

export const changeAnswer = async (request) => {
	console.log(request)
	return axiosInstance.post('/tests/session/change-answer', request);
}

export const getAllChangeLatestBySession = async (sessionId) => {
	return axiosInstance.get('/tests/session/changes?sessionId=' + sessionId)
}