import { useNavigate } from "react-router-dom";
import { KEY, PROPERTY, ROUTER_PAGE } from "../../common/Const";
import { useEffect, useState } from "react";
import { deleteClass, getDetailClassById, joinedClasses, mindClasses, searchOthers } from "../../service/ClassService";
import CardClass from "../../component/CardClass";
import { Popup } from "../../component/Popup";
import { toast } from "react-toastify";
import { getUserId } from "../../helper/Util";
import { confirmAlert } from "react-confirm-alert";
import { ConfirmAlertComp } from "../../component/ConfirmAlert";

export const Class = () => {
    document.title = 'Lớp học của tôi';
    const navigate = useNavigate();
    const [classesMind, setClassesMind] = useState([]);
    const [classesMindSearched, setClassesMindSearched] = useState([]);
    const [classesMindInput, setClassesMindInput] = useState('');
    const [classesJoined, setClassesJoined] = useState([]);
    const [classesJoinedSearched, setClassesJoinedSearched] = useState([]);
    const [classesJoinedInput, setClassesJoinedInput] = useState('');
    const [classesOther, setClassesOther] = useState([]);
    const [classesOtherInput, setClassesOtherInput] = useState('');
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [contentPopup, setContentPopup] = useState(<div></div>);
    useEffect(() => {
        mindClasses()
            .then((response) => {
                setClassesMind(response.data?.data);
                setClassesMindSearched(response.data?.data);
                setClassesMindInput('');
            })
            .catch(() => { })
        joinedClasses()
            .then((response) => {
                setClassesJoined(response.data?.data);
                setClassesJoinedSearched(response.data?.data);
                setClassesJoinedInput('');
            })
            .catch(() => { })
    }, [])
    const handelDelete = (classId) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertComp title={'Xác nhận'}
                    onClose={onClose}
                    label={'Bạn có chắc muốn xóa lớp học này?'}
                    onAccept={() => {
                        deleteClass(classId)
                            .then(_ => {
                                toast.success('Xóa lớp học thành công');
                                setClassesMind(prev => prev.filter(item => item.id !== classId))
                                setClassesMindSearched(prev => prev.filter(item => item.id !== classId))
                            })
                            .catch(() => { })
                    }}
                />
            }
        });
    }
    const fnSearchOthers = () => {
        searchOthers(1, PROPERTY.DEFAULT_PAGE_SIZE, classesOtherInput)
            .then((response) => {
                setClassesOther(response.data?.data);
            })
            .catch(() => { })
    }
    useEffect(() => {
        if (!mindClasses) return;
        doSearchMind();
    }, [classesMindInput]);
    useEffect(() => {
        if (!classesJoined) return;
        doSearchJoined();
    }, [classesJoinedInput])
    useEffect(() => {
        fnSearchOthers();
    }, [classesOtherInput])
    const doSearchMind = () => {
        const key = classesMindInput?.toLowerCase();
        setClassesMindSearched(classesMind?.filter(item => item?.name.toLowerCase().includes(key?.toLowerCase())));
    }
    const doSearchJoined = () => {
        const key = classesJoinedInput?.toLowerCase();
        setClassesJoinedSearched(classesJoined?.filter(item => item?.name.toLowerCase().includes(key?.toLowerCase())));
    }
    const PopupShare = ({ url, id }) => {
        const [iconCopy, setIconCopy] = useState('content_copy');
        const [iconCopyId, setIconCopyId] = useState('content_copy');
        return (
            <div>
                <h2 className="font-semibold">Chia sẻ lớp</h2>

                <div className="bg-purple-500 flex flex-row mt-2">
                    <span
                        onClick={() => { document.location = url }}
                        className="cursor-pointer w-full me-2 overflow-hidden text-nowrap text-ellipsis p-1 px-2 text-gray-200 underline"
                    >
                        {url}
                    </span>

                    <button
                        onClick={() => {
                            if (iconCopy === 'done') return;
                            setIconCopy('done');
                            setTimeout(() => setIconCopy('content_copy'), 700);
                            navigator.clipboard.writeText(url);
                        }}
                        title="copy"
                        type="button"
                        className="bg-white border border-gray-200 text-gray-500 p-1 flex items-center justify-center"
                    >
                        <span className="material-icons text-md">{iconCopy}</span>
                    </button>
                </div>

                <h2 className="font-semibold mt-2">Mã lớp</h2>

                <div className="bg-purple-500 flex flex-row mt-2">
                    <span
                        className="w-full me-2 overflow-hidden text-nowrap text-ellipsis p-1 px-2 text-gray-200"
                    >
                        {id}
                    </span>

                    <button
                        onClick={() => {
                            if (iconCopyId === 'done') return;
                            setIconCopyId('done');
                            setTimeout(() => setIconCopyId('content_copy'), 700);
                            navigator.clipboard.writeText(id);
                        }}
                        title="copy"
                        type="button"
                        className="bg-white border border-gray-200 text-gray-500 p-1 flex items-center justify-center"
                    >
                        <span className="material-icons text-md">{iconCopyId}</span>
                    </button>
                </div>
            </div>
        );
    };
    const PopupInputCode = () => {
        const userId = getUserId();
        const navigate = useNavigate()
        const [classId, setClassId] = useState('');
        const [errors, setErrors] = useState({});
        const [classFind, setClassFind] = useState({});
        const handlerSearch = async () => {
            setErrors({})
            setClassFind({})
            if (!classId?.trim() > 0) { setErrors({ classId: true }); return; }
            getDetailClassById(classId)
                .then(response => {
                    console.log(response)
                    setClassFind(response.data.data);
                })
                .catch(() => { })
        }
        return <div>
            <div>
                <h2 className="font-semibold">Nhập mã lớp</h2>
                <input
                    type="text"
                    value={classId}
                    className={`w-full my-1 border rounded-lg p-2 px-4 ${errors?.classId ? "border-red-500" : ""} disabled:bg-gray-50 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                    onChange={(e) => { setClassId(e.target.value) }}
                    placeholder="Nhập mã lớp"
                />

            </div>
            <div className="mt-1 flex flex-row justify-end">
                <button
                    onClick={handlerSearch}
                    type="submit" className="bg-purple-500 text-white rounded hover:bg-purple-700 hover:text-white font-semibold text-nowrap flex items-center justify-center p-2">
                    Tìm kiếm
                </button>
            </div>
            {classFind?.id && <div className="mt-2 border border-gray-200 inline-block w-full">
                <img src={classFind.photo ?? '/image/class_default.jpg'} alt={classFind.name} className="w-full h-48 object-cover" />
                <div className="p-4 h-full">
                    <h3 className="text-lg font-bold mb-2">{classFind.name}</h3>
                    <p className="text-gray-600">{classFind.studentCount} thành viên </p>
                    {classFind.owner.id === userId && <span className='text-blue-400 size-1'>{classFind.isPrivate === true ? 'Riêng tư' : 'Công khai'}</span>}
                    <div className="">
                        <button
                            onClick={() => navigate(`${ROUTER_PAGE.CLASS.INDEX}/${classFind.id}`)}
                            type="submit" className="bg-white text-purple-500 border-2 border-purple-500 rounded hover:bg-purple-500 hover:text-white font-semibold text-nowrap flex items-center justify-center p-2 mt-1">
                            Truy cập lớp
                        </button>
                    </div>
                </div>
            </div>
            }
        </div>
    }
    const handlerOpenPopupShare = (classObj) => {
        if (!classObj) return;

        const url = `${document.location.origin}${ROUTER_PAGE.CLASS.INDEX}/${classObj.id}`;

        setIsOpenPopup(true);

        setContentPopup(
            <PopupShare
                url={url} id={classObj.id}
            />
        );
    };
    const handlerOpenPopupInputCode = () => {
        setIsOpenPopup(true);
        setContentPopup(<PopupInputCode />)
    }
    return <div className="space-y-4">
        <div className="bg-gray-50 border-2 border-gray-100 rounded-sm shadow-xs p-2">
            <div>
                <h2 className="font-semibold text-xl">Lớp học của tôi</h2>
            </div>
            <div className="space-y-2 mt-2">
                <button
                    className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap flex flex-row"
                    onClick={() => { navigate(ROUTER_PAGE.CLASS.ADD) }}
                >
                    <span className="material-icons me-2">add</span>
                    <span className="float-right">Thêm mới</span>
                </button>
                <div className=" border-t-[1px] border-gray-200 pt-2 relative">
                    <div className="z-10 absolute -top-[32px] h-[32px] right-0 pb-1">
                        <div className="items-center bg-white h-full rounded-full px-2 flex-row xs:flex parent border-gray-200 border-solid border-[1px]">
                            <span className="material-icons text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder={`Nhập tên lớp`}
                                className="flex-1 outline-none px-2 text-sm text-gray-600"
                                value={classesMindInput}
                                onChange={(e) => { setClassesMindInput(e.target.value); }}
                            />
                        </div>
                    </div>
                    <div className="w-full max-w-full overflow-x-auto">
                        {(!classesMindSearched || classesMindSearched.length === 0) && <span>Không có lớp học nào</span>}
                        {classesMindSearched && classesMindSearched.length > 0 && <div className="w-auto flex flex-row flex-nowrap space-x-2 items-stretch justify-stretch overflow-y-hidden">
                            {classesMindSearched.map(item => <CardClass handlerDelete={() => handelDelete(item.id)} handlerShare={() => handlerOpenPopupShare(item)} key={item.id} classObj={item} />)}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 border-2 border-gray-100 rounded-sm shadow-xs p-2">
            <div>
                <h2 className="font-semibold text-xl">Đã tham gia</h2>
            </div>
            <div className="space-y-2 mt-2">
                <div className=" border-t-[1px] border-gray-200 pt-2 relative">
                    <div className="z-10 absolute -top-[32px] h-[32px] right-0 pb-1">
                        <div className="items-center bg-white h-full rounded-full px-2 flex-row xs:flex parent border-gray-200 border-solid border-[1px]">
                            <span className="material-icons text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder={`Nhập tên lớp`}
                                className="flex-1 outline-none px-2 text-sm text-gray-600"
                                value={classesJoinedInput}
                                onChange={(e) => { setClassesJoinedInput(e.target.value); }}
                            />
                        </div>
                    </div>
                    <div className="w-full max-w-full overflow-x-auto">
                        {(!classesJoinedSearched || classesJoinedSearched.length === 0) && <span>Chưa tham gia lớp học nào</span>}
                        {classesJoinedSearched && classesJoinedSearched.length > 0 && <div className="w-auto flex flex-row flex-nowrap space-x-2">
                            {classesJoinedSearched.map(item => <CardClass key={item.id} classObj={item} handlerShare={() => handlerOpenPopupShare(item)} />)}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 border-2 border-gray-100 rounded-sm shadow-xs p-2">
            <div>
                <h2 className="font-semibold text-xl">Khác</h2>
                {/* Nút mở modal */}
                <button
                    onClick={handlerOpenPopupInputCode}
                    className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap"
                >
                    Nhập mã lớp
                </button>
            </div>
            <div className="space-y-2 mt-2">
                <div className=" border-t-[1px] border-gray-200 pt-2 relative">
                    <div className="z-10 absolute -top-[32px] h-[32px] right-0 pb-1">
                        <div className="items-center bg-white h-full rounded-full px-2 flex-row xs:flex parent border-gray-200 border-solid border-[1px]">
                            <span className="material-icons text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder={`Nhập tên lớp`}
                                className="flex-1 outline-none px-2 text-sm text-gray-600"
                                value={classesOtherInput}
                                onChange={(e) => { setClassesOtherInput(e.target.value); }}
                            />
                        </div>
                    </div>
                    <div className="w-full max-w-full overflow-x-auto">
                        {(!classesOther || classesOther.length === 0) && <span>Không có lớp học nào</span>}
                        {classesOther && classesOther.length > 0 && <div className="w-auto flex flex-row flex-nowrap space-x-2">
                            {classesOther.map(item => <CardClass key={item.id} classObj={item} />)}
                            {classesOther.length === PROPERTY.DEFAULT_PAGE_SIZE && <div className='' style={{ display: 'block ruby' }}>
                                <div className="bg-gray-200 w-full h-full flex flex-row items-center justify-center p-2">
                                    <button type="button" className="text-purple-500 text-center flex flex-col justify-center items-center hover:text-purple-700">
                                        <span className="material-icons me-2">double_arrow</span>
                                        <span className="text-sm font-semibold">Xem thêm</span>
                                    </button>
                                </div>
                            </div>}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
        {isOpenPopup && <Popup onClose={() => { setIsOpenPopup(false); setContentPopup(<></>) }} Content={contentPopup} />}
    </div>
}