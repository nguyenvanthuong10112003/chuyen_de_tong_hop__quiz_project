let setLoadingExternal = null;
let currentLoading = false; // <--- Lưu trạng thái hiện tại

export const loadingStore = {
    register(setFn) {
        setLoadingExternal = setFn;
    },
    set(value) {
        if (currentLoading === value) return; // nếu giống nhau thì khỏi set
        
        currentLoading = value; // cập nhật trạng thái
        setLoadingExternal?.(value); // gọi react setState
    },
    get() {
        return currentLoading; // muốn đọc bên ngoài
    }
};
