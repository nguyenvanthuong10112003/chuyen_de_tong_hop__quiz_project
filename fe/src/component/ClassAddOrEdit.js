import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getUserDisplayName, getUserId } from "../helper/Util";
import { ROUTER_PAGE } from "../common/Const";
import { toast } from "react-toastify";
import { createClass, getClassById, updateClass } from "../service/ClassService";

export const ClassAddOrEdit = ({ action }) => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [classObj, setClassObj] = useState(undefined);
    const [className, setClassName] = useState('');
    const [errors, setErrors] = useState({});
    const [scope, setScope] = useState(1);
    const [description, setDescription] = useState('');
    const [autoApprove, setAutoApprove] = useState(false);
    const [key, setKey] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const userDisplayName = getUserDisplayName();
    const userId = getUserId();
    const inputRef = useRef(null);
    const classId = params.get('id');
    useEffect(() => {
        if (action === 'edit')
            getClassById(classId)
                .then(response => {
                    const classObj = response.data?.data;
                    setClassObj(classObj)
                    setClassName(classObj.name);
                    setDescription(classObj.description ?? '');
                    setScope(classObj.isPrivate ? 0 : 1);
                    setKey(classObj.key ?? '');
                    setAutoApprove(classObj?.isAutoApprove)
                    if (classObj?.photo)
                        loadImageAsFile(classObj?.photo);
                })
                .catch(() => { })
    }, [])
    const loadImageAsFile = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // Lấy tên file từ URL
            const fileName = imageUrl.split("/").pop();

            // Tạo File object
            const newFile = new File([blob], fileName, { type: blob.type });

            // Gán lại vào state
            setFile(newFile);
            setPreview(URL.createObjectURL(newFile));
        } catch {}
    };
    const handlerUpdateClass = (e) => {
        e.preventDefault();
        setErrors({});
        let errorsVal = validateForm();
        if (Object.keys(errorsVal).length > 0) return;
        if (action === 'edit')
            updateClass(classId, className, description, file, scope, key, autoApprove)
                .then(() => {
                    toast.success('Cập nhật thành công');
                    navigate(ROUTER_PAGE.CLASS.INDEX);
                })
                .catch(() => { })
        else if (action === 'add')
            createClass(className, description, file, scope, key, autoApprove)
                .then(() => {
                    toast.success('Tạo mới thành công');
                    navigate(ROUTER_PAGE.CLASS.INDEX);
                })
                .catch(() => {

                })
    }
    const handleClickButton = () => {
        inputRef.current.click();
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith("image/")) {
            toast.error("File không phải là ảnh!");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };
    const validateForm = () => {
        let errors = {};
        if (className.trim().length === 0) errors.className = 'Tên lớp không thể để trống';
        if (scope !== 1 && scope !== 0) errors.scope = 'Vui lòng chọn phạm vi';
        if (scope === 0 && key.length === 0) errors.key = 'Mật khẩu là bắt buộc với lớp riêng tư';
        setErrors(errors);
        return errors;
    }
    return (<div className="">
        <form className="" autoComplete="off">
            <div className="space-y-12 flex flex-col items-center mt-4">
                <div className="border-b border-white/10 pb-12 w-full max-w-2xl">
                    <div>
                        <Link to={ROUTER_PAGE.CLASS.INDEX} className="text-start text-md text-purple-500 hover:text-purple-600" type="button">
                            <span className="material-icons text-md">arrow_back</span>
                        </Link><br></br>
                    </div>
                    {(action === 'add' || classObj) && <>
                        <h2 className="text-xl font-bold text-center text-purple-500">{action === 'add' ? 'Thêm lớp học' : 'Cập nhật lớp học'}</h2>
                        <div className="mt-4 text-md">
                            <div className="flex flex-row justify-between">
                                <div className="">
                                    <label className="block font-medium mb-1">Ảnh</label>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        ref={inputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <span>{file?.name}</span>
                                    <div className="flex flex-row space-x-2">
                                        <button type="button" className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer flex flex-row items-center"
                                            onClick={handleClickButton}
                                        >
                                            <span className="material-icons me-2">upload</span>
                                            <span>Tải lên</span>
                                        </button>
                                        <button onClick={() => { setFile(null); setPreview(null) }} disabled={file === null} type="button" className={`bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 font-semibold text-nowrap cursor-pointer flex flex-row items-center disabled:opacity-40 disabled:cursor-default disabled:hover:bg-red-500`}>
                                            <span className="material-icons me-2">close</span>
                                            <span>Xóa</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="w-48 h-48 rounded-full overflow-hidden relative">
                                    <img src={preview ? preview : '/image/class_default.jpg'} alt="" className="w-full h-full" />
                                </div>
                            </div>
                            <div className="">
                                <label className="block font-medium mb-1">Tên lớp (<span className="text-red-500">*</span>)</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên lớp"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.className ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                />
                                <p className="text-red-500 text-sm mt-1">{errors?.className ?? <>&nbsp;</>}</p>
                            </div>
                            <div className="">
                                <label className="block font-medium mb-1">Mô tả</label>
                                <textarea
                                    rows={3}
                                    type="text"
                                    placeholder="Nhập mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.description ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                />
                                <p className="text-red-500 text-sm mt-1">&nbsp;</p>
                            </div>
                            <div className="">
                                <label className="block font-medium mb-1">Phạm vi (<span className="text-red-500">*</span>)</label>
                                <div className="">
                                    <div className="space-x-2">
                                        <input name="scope" type="radio" id="scope-public" value={1} onChange={() => { setScope(1); }} checked={scope === 1} className="accent-purple-600" />
                                        <label htmlFor="scope-public">Công khai</label>
                                    </div>
                                    <div className="space-x-2">
                                        <input name="scope" type="radio" id="scope-private" value={0} onChange={() => { setScope(0); }} checked={scope === 0} className="accent-purple-600" />
                                        <label htmlFor="scope-private">Riêng tư (chỉ những người được mời hoặc có mã)</label>
                                    </div>
                                </div>
                                <p className="text-red-500 text-sm mt-1">{errors?.scope ?? <>&nbsp;</>}</p>
                            </div>
                            {
                                !scope && <div className="">
                                    <label className="block font-medium mb-1">Mật khẩu tham gia (<span className="text-red-500">*</span>)</label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.key ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                    />
                                    <p className="text-red-500 text-sm mt-1">{errors?.key ?? <>&nbsp;</>}</p>
                                </div>
                            }
                            <div>
                                <input name="autoApprove" id="autoApprove" type="checkbox" className="bg-blue-500" checked={!!autoApprove} onChange={(e) => {setAutoApprove(!autoApprove)}} />
                                <label htmlFor="autoApprove" className="ms-2">Tự động duyệt vào lớp</label>
                            </div>
                            <div>
                                <input onClick={handlerUpdateClass} type="submit" value={action === 'add' ? 'Thêm' : (action === 'edit' ? 'Cập nhật' : '')} className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer float-right" />
                            </div>
                        </div>
                    </>}
                </div>
            </div>
        </form>
    </div>)
}