import axiosInstance from "../instance/axiosInstance";


export const createClass = async (name, description, photoFile, scope, keyJoin, autoApprove) => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("isPrivate", scope === 0);
    formData.append("isAutoApprove", autoApprove)

    if (description) {
        formData.append("description", description);
    }

    if (photoFile) {
        formData.append("photoFile", photoFile); // file phải append vào FormData
    }

    if (scope === 0 && keyJoin) {
        formData.append("keyJoin", keyJoin);
    }

    return await axiosInstance.post(`/classes/create`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const updateClass = async (id, name, description, photoFile, scope, keyJoin, isAutoApprove) => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("isPrivate", scope === 0);
    formData.append("id", id);
    formData.append("isAutoApprove", isAutoApprove)

    if (description) {
        formData.append("description", description);
    }

    if (photoFile) {
        formData.append("photoFile", photoFile); // file phải append vào FormData
    }

    if (scope === 0 && keyJoin) {
        formData.append("keyJoin", keyJoin);
    }

    return await axiosInstance.post(`/classes/update`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const deleteClass = async (classId) => {
    return await axiosInstance.post('/classes/delete', {classId})
}

export const getClassById = async (id) => {
    return await axiosInstance.get('/classes/' + encodeURIComponent(id));
}

export const getDetailClassById = async (id) => {
    return await axiosInstance.get('/classes/detail/' + encodeURIComponent(id));
}

export const mindClasses = async () => {
    return await axiosInstance.get(`/classes/mind`);
}

export const joinedClasses = async () => {
    return await axiosInstance.get(`/classes/joined`);
}

export const searchOthers = async (page, size, key) => {
    return await axiosInstance.get('/classes/other',   {params: {
        'pageSize': size,
        'pageNumber': page,
        'key': key
     }});
};

export const getsAlert = async (page, size, classId) => {
    return await axiosInstance.get('/classes/alerts', {
        params: {
            'pageSize': size,
            'pageNumber': page,
            'classId': classId
        }
    });
}

export const join = async (classId, keyJoin) => {
    return await axiosInstance.post('/classes/join', {classId: classId, keyJoin: keyJoin})
}

export const updateStudentInfo = async (classId, name, file) => {
    const formData = new FormData();

    formData.append("classId", classId);
    formData.append("name", name);

    if (file) {
        formData.append("photo", file);
    }

    return await axiosInstance.post(`/classes/update-student-info`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const leave = async (classId) => {
    return await axiosInstance.post('/classes/leave', {classId});
}

export const acceptRequest = async (requestId) => {
    return await axiosInstance.post('/classes/accept-request', {requestId});
}

export const kickStudent = async (studentId) => {
    return await axiosInstance.post('/classes/kick-student', {studentId})
}

export const invite = async (classId, userId) => {
    return await axiosInstance.post('/classes/invite', {classId, userId})
}

export const acceptInvite = async (requestId) => {
    return await axiosInstance.post('/classes/accept-invite', {requestId});
}