import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserId, timeFormater } from "../../helper/Util";
import { DEFAULT_CLASS_IMAGE, REQUEST_TYPE, ROUTER_PAGE } from "../../common/Const";
import React, { useEffect, useRef, useState } from "react";
import { acceptInvite, acceptRequest, getDetailClassById, invite, join, kickStudent, leave, updateStudentInfo } from "../../service/ClassService";
import moment from "../../instance/MomentInstance";
import { confirmAlert } from "react-confirm-alert";
import { ConfirmAlertComp } from "../../component/ConfirmAlert";
import { toast } from "react-toastify";
import { Popup } from "../../component/Popup";
import { searchToInvite } from "../../service/UserService";
import { historiesAll, fnHistories, removeTest } from "../../service/TestService";
import * as XLSX from "xlsx";
export const ClassDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const classId = params.id;
    const userId = getUserId();
    const [classObj, setClassObj] = useState();
    const [activeTab, setActiveTab] = useState(0);
    const [errors, setErrors] = useState({});
    const inputRef = useRef(null);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [contentPopup, setContentPopup] = useState(<></>);
    useEffect(() => {
        loadClass();
    }, [])
    const loadClass = () => {
        getDetailClassById(classId)
            .then(response => {
                const find = response?.data?.data;
                setClassObj(find);
                document.title = find?.name;
            })
            .catch(() => { });
    }
    const handlerInviteStudent = () => {
        setIsOpenPopup(true);
        setContentPopup(<PopupInviteStudent classId={classId} />);
    }
    const exportTableExcel = (name) => {
        const table = document.getElementById("student-table");
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(workbook, `${name ?? 'histories'}.xlsx`);
    };
    const showPopupStatistical = async (tests, testId, setTests) => {
        const testIndex = tests.findIndex(item => item.id === testId);
        const test = tests[testIndex];
        if (!test) return;
        let students = test.students;
        if (!students?.length > 0) {
            try {
                const response = await historiesAll(testId);
                students = response.data.data;
                test.students = students;
                tests[testIndex] = test;
                setTests([...tests]);
            } catch { }
        }
        setIsOpenPopup(true);
        setContentPopup(<StatisticalContent students={students} test={test} />)
    }
    const handlerRemoveTest = async (testId, tests, setTests) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertComp title={'Xác nhận'}
                    onClose={onClose}
                    label={'Bạn có chắc muốn thực hiện hành động này?'}
                    onAccept={() => {
                        removeTest(testId)
                            .then(_ => {
                                toast.success('Thành công')
                                setTests(tests.filter(item => item.id !== testId))
                            })
                            .catch(() => {

                            })
                    }}
                />
            }
        });
    }
    const showStudentPopupStatistical = async (tests, testId, setTests) => {
        const testIndex = tests.findIndex(item => item.id === testId);
        const test = tests[testIndex];
        if (!test) return;
        let histories = test.histories;
        if (!histories?.length > 0) {
            try {
                const response = await fnHistories(testId);
                histories = response.data.data;
                test.histories = histories;
                tests[testIndex] = test;
                setTests([...tests]);
            } catch { }
        }
        setIsOpenPopup(true);
        setContentPopup(<div className="max-h-[80vh] overflow-auto">
            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="border p-2 font-semibold">
                            Số thứ tự
                        </th>
                        <th className="border p-2 font-semibold">
                            Thời gian bắt đầu
                        </th>
                        <th className="border p-2 font-semibold">
                            Thời gian nộp bài
                        </th>
                        <th className="border p-2 font-semibold">
                            Thời gian làm bài
                        </th>
                        <th className="border p-2 font-semibold">
                            Số câu đã làm
                        </th>
                        <th className="border p-2 font-semibold">
                            Số câu đúng
                        </th>
                        <th className="border p-2 font-semibold">
                            Số câu sai
                        </th>
                        <th className="border p-2 font-semibold">
                            Tổng điểm
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {histories?.length > 0 ? histories?.map((history, index) => {
                        console.log(history)
                        return history && <tr key={history.id}>
                            <td className="text-center border p-2">{index + 1}</td>
                            <td className="text-center border p-2">{new Date(history.startTime).toLocaleString('vi-VN')}</td>
                            <td className="text-center border p-2">{new Date(history.submitTime).toLocaleString('vi-VN')}</td>
                            <td className="text-center border p-2">{Math.round(history.totalTime / 60)}/{history.time}</td>
                            <td className="text-center border p-2">{history.choseNum}</td>
                            <td className="text-center border p-2">{history.correctNum}</td>
                            <td className="text-center border p-2">{history.incorrectNum}</td>
                            <td className="text-center border p-2">{history.totalScore.toFixed(2)}/{history.maxScore}</td>
                        </tr>
                    }) : <tr><td className="text-center border p-2" colSpan={10}>Không có dữ liệu</td></tr>}
                </tbody>
            </table>
        </div>)
    }
    const StatisticalContent = ({ students, test }) => {
        const [expands, setExpands] = useState({})
        return <div className="max-h-[80vh] overflow-auto">
            <table className="table-auto" id="student-table">
                <thead>
                    <tr>
                        <th className="border p-2">

                        </th>
                        <th className="border p-2 font-semibold">
                            Số thứ tự
                        </th>
                        <th className="border p-2 font-semibold">
                            Tên học sinh/sinh viên
                        </th>
                        <th className="border p-2 font-semibold">
                            Thời gian bắt đầu
                        </th>
                        <th className="border p-2 font-semibold">
                            Thời gian nộp bài
                        </th>
                        <th className="border p-2 font-semibold">
                            Thời gian làm bài
                        </th>
                        <th className="border p-2 font-semibold">
                            Số câu đã làm
                        </th>
                        <th className="border p-2 font-semibold">
                            Số câu đúng
                        </th>
                        <th className="border p-2 font-semibold">
                            Số câu sai
                        </th>
                        <th className="border p-2 font-semibold">
                            Tổng điểm
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {students?.length > 0 ? students?.map((student, index) => {
                        const history = student.histories[0];
                        return history && (<><tr key={student.id}>
                            <td className="text-center border p-2">
                                <button type="button" onClick={() => {
                                    setExpands(prev => { return { ...expands, [student.id]: !prev[student.id] } })
                                }} disabled={student.histories.length <= 1} className="flex items-center justify-center disabled:text-gray-300">
                                    <span className={`material-icons ${expands[student.id] === true ? '-rotate-90' : ''}`}>arrow_right</span>
                                </button>
                            </td>
                            <td className="text-center border p-2">{index + 1}</td>
                            <td className="text-center border p-2">{student.name}</td>
                            <td className="text-center border p-2">{new Date(history.startTime).toLocaleString('vi-VN')}</td>
                            <td className="text-center border p-2">{new Date(history.submitTime).toLocaleString('vi-VN')}</td>
                            <td className="text-center border p-2">{Math.round(history.totalTime / 60)}/{history.time}</td>
                            <td className="text-center border p-2">{history.choseNum}</td>
                            <td className="text-center border p-2">{history.correctNum}</td>
                            <td className="text-center border p-2">{history.incorrectNum}</td>
                            <td className="text-center border p-2">{history.totalScore.toFixed(2)}/{history.maxScore}</td>
                        </tr>
                            {expands[student.id] === true && student.histories.slice(1).map(his => <tr key={his.id}>
                                <td className="text-center border p-2" colSpan={3}></td>
                                <td className="text-center border p-2">{new Date(his.startTime).toLocaleString('vi-VN')}</td>
                                <td className="text-center border p-2">{new Date(his.submitTime).toLocaleString('vi-VN')}</td>
                                <td className="text-center border p-2">{Math.round(his.totalTime / 60)}/{his.time}</td>
                                <td className="text-center border p-2">{his.choseNum}</td>
                                <td className="text-center border p-2">{his.correctNum}</td>
                                <td className="text-center border p-2">{his.incorrectNum}</td>
                                <td className="text-center border p-2">{his.totalScore.toFixed(2)}/{his.maxScore}</td>
                            </tr>)}
                        </>)
                    }) : <tr><td className="text-center border p-2" colSpan={10}>Không có dữ liệu</td></tr>}
                </tbody>
            </table>
            {students?.length > 0 && <button onClick={() => exportTableExcel(test.name)} className="bg-green-700 mt-2 text-white font-semibold p-2 rounded flex flex-row items-center">
                <span className="material-icons me-2">download</span>
                <span>Export Excel</span>
            </button>}
        </div>
    }
    const PopupInviteStudent = ({ classId }) => {
        const [users, setUsers] = useState([]);
        const [usersSelected, setUsersSelected] = useState({});
        const searchUser = (e) => {
            searchToInvite(e.target.value, classId)
                .then(response => {
                    const res = response.data.data;
                    setUsers(res.filter(item => !usersSelected[item.id]))
                })
                .catch(() => { })
        }
        const handlerInvite = (userId) => {
            console.log(userId)
            invite(classId, userId)
                .then(response => {
                    toast.success('Mời thành công')
                    const newReq = response.data.data;
                    const cloneUsers = [...users].map(item => item.id === userId ? { ...item, invite: newReq } : item);
                    setUsers(cloneUsers);
                })
                .catch(() => { })
        }
        return <div>
            <div className="relative w-96">
                <input autoFocus={true} onChange={searchUser} type="email" placeholder="Nhập email tại đây" className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.classId ? "border-red-500" : ""} disabled:bg-gray-50 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`} />
                {users?.length > 0 && <div className="absolute top-12 left-0 right-0 max-h-60 h-60 bg-white shadow-sm shadow-gray-200 border rounded-md p-2">
                    <div className="h-full max-h-full overflow-y-auto">
                        <div className="">
                            {users.map((item, index) => {
                                return <div key={item.id} className={`rounded-sm hover:bg-gray-200 px-4 p-2 flex flex-row items-center ${index === 0 ? '' : 'border-t border-gray-100'}`}>
                                    <img className="w-8" src={`${item.photo ?? '/image/default-image-user.webp'}`} alt="" />
                                    <div className="w-full flex flex-col text-md overflow-hidden max-w-full mx-2">
                                        <span className="text-nowrap text-ellipsis overflow-hidden w-full">{item.displayName}</span>
                                        <span className="text-gray-500 text-sm text-nowrap text-ellipsis overflow-hidden w-full">{item.id.substr(0, 10)}</span>
                                    </div>
                                    <button onClick={() => handlerInvite(item.id)} type="button" disabled={!!item.invite}
                                        className="disabled:cursor-default disabled:bg-gray-300 bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer flex justify-center items-center">
                                        <span>{!!item.invite ? 'Đã mời' : 'Mời'}</span>
                                    </button>
                                </div>
                            })}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    }
    const handlerAcceptInvite = () => {
        const requestId = classObj?.request?.id;
        if (!requestId) return;
        acceptInvite(requestId)
            .then(_ => {
                toast.success('Tham gia thành công');
                loadClass();
            })
            .catch(() => { })
    }
    const handlerKickStudent = (userInfoId) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertComp title={'Xác nhận'}
                    onClose={onClose}
                    label={'Bạn có chắc muốn thực hiện hành động này?'}
                    onAccept={() => {
                        kickStudent(userInfoId)
                            .then(_ => {
                                toast.success('Thành công')
                                const clone = { ...classObj }
                                const stu = clone.students.find(item => item.id === userInfoId);
                                console.log(stu, userInfoId, clone)
                                clone.students = clone.students.filter(item => item.id !== userInfoId);
                                clone.alerts = [{ message: `${stu.name} kicked out of group`, createdTime: new Date() }, ...clone.alerts]
                                setClassObj(clone);
                            })
                            .catch(() => { })
                    }}
                />
            }
        });
    }
    const handlerAcceptRequest = (requestId) => {
        acceptRequest(requestId)
            .then((response) => {
                toast.success('Phê duyệt thành công')
                const newUserInfo = response.data.data;
                if (!newUserInfo) return;
                const clone = { ...classObj }
                clone.requests = clone.requests.filter(item => item.id !== requestId);
                clone.students = [...clone.students, newUserInfo];
                clone.alerts = [{ message: `${newUserInfo.name} has join`, createdTime: new Date() }, ...clone.alerts]
                setClassObj(clone)
            })
            .catch(() => { })
    }
    const handlerLeave = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertComp title={'Xác nhận rời lớp'}
                    onClose={onClose} label={'Bạn có chắc muốn rời khỏi lớp học này không?'}
                    onAccept={() => {
                        leave(classObj.id)
                            .then(() => {
                                navigate(ROUTER_PAGE.CLASS.INDEX);
                            })
                            .catch(() => { })
                    }}
                />
            }
        });
    }
    const handlerCreateTest = () => {
        setIsOpenPopup(true);
        setContentPopup(<PopupCreateTest classId={classId} />)
    }
    const PopupCreateTest = ({ classId }) => {
        const [testsSearch, setTestsSearch] = useState([]);
        return <div>
            <div className="relative w-96 flex-row items-center">
                <Link className="underline text-blue-600 text-sm" to={`${ROUTER_PAGE.TEST.ADD}?classId=${classId}`}>
                    <span>+ Tạo mới</span>
                </Link>
                <input name="input-search" autoFocus={true} type="text" placeholder="Nhập từ khóa tìm kiếm tại đây (tên, lớp, môn học)" className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.classId ? "border-red-500" : ""} disabled:bg-gray-50 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`} />
                {testsSearch?.length > 0 && <div className="absolute top-12 left-0 right-0 max-h-60 h-60 bg-white shadow-sm shadow-gray-200 border rounded-md p-2">
                    <div className="h-full max-h-full overflow-y-auto">
                        <div className="">
                            {setTestsSearch.map((item, index) => {
                                return <div key={item.id} className={`rounded-sm hover:bg-gray-200 px-4 p-2 flex flex-row items-center ${index === 0 ? '' : 'border-t border-gray-100'}`}>
                                    <img className="w-8" src={`${item.photo ?? '/image/default-image-user.webp'}`} alt="" />
                                    <div className="w-full flex flex-col text-md overflow-hidden max-w-full mx-2">
                                        <span className="text-nowrap text-ellipsis overflow-hidden w-full">{item.displayName}</span>
                                        <span className="text-gray-500 text-sm text-nowrap text-ellipsis overflow-hidden w-full">{item.id.substr(0, 10)}</span>
                                    </div>
                                    <button type="button" disabled={!!item.invite}
                                        className="disabled:cursor-default disabled:bg-gray-300 bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer flex justify-center items-center">
                                        <span>{!!item.invite ? 'Đã mời' : 'Mời'}</span>
                                    </button>
                                </div>
                            })}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    }
    const joinClass = (key) => {
        join(classId, key)
            .then((response) => {
                toast.success('Gửi yêu cầu thành công');
                const clone = { ...classObj, request: response.data.data }
                setClassObj(clone);
                if (classObj.isAutoApprove)
                    loadClass();
            })
            .catch(() => { })
    }
    const handlerJoin = () => {
        let inputValue = null;
        if (classObj?.isPrivate)
            confirmAlert({
                customUI: ({ onClose }) => {
                    return <ConfirmAlertComp title={'Xin tham gia lớp'}
                        onClose={onClose} label={'Vui lòng nhập mật khẩu tham gia'}
                        inputUse={true} inputType={'password'}
                        inputOnChange={(e) => { inputValue = e.target.value }}
                        inputRequired={true}
                        onAccept={() => joinClass(inputValue)}
                    />
                }
            });
        else
            joinClass();
    }
    const ExpandTabAlert = React.memo(({ alerts }) => {
        return <div className="">
            {!(alerts?.length > 0) ?
                <p className="text-md">(Không có thông báo)</p> :
                <ul>
                    {classObj.alerts?.map((item, index) => {
                        return <li key={index} className="">
                            [{moment(item.createdTime).fromNow()}] {item.message}
                        </li>
                    })}
                </ul>}
        </div>
    })
    const ExpandTabStudent = React.memo(({ students, isOwner }) => {
        const [openMenu, setOpenMenu] = useState(-1);
        return <div className="">
            {isOwner && <div>
                <button onClick={handlerInviteStudent} type="button"
                    className="mb-2 bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer me-2 flex justify-center items-center">
                    <span className="material-icons">add</span>
                    <span className="ms-2">Mời thêm</span>
                </button>
            </div>}
            {!(students?.length > 0) ?
                <p className="text-md">(Chưa có học sinh tham gia)</p> :
                <ul>
                    {students.map((item, index) => {
                        return <li key={index} className={`p-2 flex flex-row items-center space-x-2 border-b border-gray-200 ${index === 0 ? 'border-t' : ''}`}>
                            <img className="w-[32px] h-[32px] rounded-full" alt="" src={item.photo ? item.photo : '/image/default-image-user.webp'} />
                            <span className="text-nowrap text-ellipsis overflow-hidden w-full">{item.name}</span>
                            {isOwner && <div className="flex justify-center items-center relative">
                                <button onClick={() => { setOpenMenu(item.id === openMenu ? -1 : item.id) }} type="button" className="bg-gray-300 flex justify-center items-center rounded py-1 shadow-sm shadow-gray-200 hover:bg-gray-400">
                                    <span className="material-icons bg-none">more_vert</span>
                                </button>
                                {openMenu === item.id && <div className="z-10 absolute -bottom-11 right-0 bg-white border border-gray-100 rounded shadow-sm shadow-gray-200">
                                    <button onClick={() => handlerKickStudent(item.id)} type="button" className="text-nowrap hover:bg-gray-200 p-2 px-4 text-gray-900">Mời ra khỏi lớp</button>
                                </div>}
                            </div>
                            }
                        </li>
                    })}
                </ul>
            }
        </div>
    })
    const ExpandTabMe = React.memo(({ myInfo, updateMyInfo }) => {
        const [meName, setMeName] = useState('');
        const [file, setFile] = useState(null);
        const [preview, setPreview] = useState(null);
        const [errors, setErrors] = useState({});
        useEffect(() => {
            console.log(myInfo)
            setMeName(myInfo?.name ?? '');
            setFile(null);
            setPreview(null);
            if (myInfo?.photo) loadImageAsFile(myInfo.photo);
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
            } catch { }
        };
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
        const saveInfo = () => {
            setErrors({});
            if (!meName?.trim() > 0) { setErrors({ meName: 'Tên hiển thị bắt buộc' }); return; }
            updateMyInfo(meName, file)
        }
        return <div className="">
            <h2 className="text-lg font-semibold">Thông tin của tôi</h2>
            <div>
                <div className="flex flex-row justify-between">
                    <div className="">
                        <label className="block">Ảnh hiển thị</label>
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
                        <img src={preview ? preview : '/image/default-image-user.webp'} alt="" className="w-full h-full" />
                    </div>
                </div>
            </div>
            <div>
                <label className="block">Tên hiển thị (<span className="text-red-500">*</span>)</label>
                <input
                    type="text"
                    placeholder="Nhập tên"
                    value={meName}
                    onChange={(e) => setMeName(e.target.value)}
                    className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.meName ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                />
                <p className="text-red-500 text-sm mt-1">{errors?.meName ?? <>&nbsp;</>}</p>
            </div>
            <div>
                <button onClick={saveInfo} type="button" className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer float-right">Lưu</button>
            </div>
        </div>
    })
    const ExpandTabRequest = React.memo(({ requests }) => {
        return <div>
            {!(requests?.length > 0) ?
                <p className="text-md">(Không có yêu cầu nào)</p> :
                <ul>
                    {requests.map((item, index) => {
                        const user = item.user;
                        return <li key={index} className="p-2 flex flex-row items-center space-x-2 border-b border-gray-200">
                            <button onClick={() => handlerAcceptRequest(item.id)} type="button" className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer me-2">Phê duyệt</button>
                            <img className="w-[32px] rounded-full" alt="" src={user.photo ? user.photo : '/image/default-image-user.webp'} />
                            <span className="text-nowrap text-ellipsis overflow-hidden w-full">{user.displayName}</span>
                        </li>
                    })}
                </ul>
            }
        </div>
    })
    const ExpandTabTest = React.memo(({ tests, isOwner, setTests }) => {
        return <div>
            {isOwner && <div>
                <button onClick={handlerCreateTest} type="button"
                    className="mb-2 bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer me-2 flex justify-center items-center">
                    <span className="material-icons">add</span>
                    <span className="ms-2">Thêm mới</span>
                </button>
            </div>}
            {!(tests?.length > 0) ?
                <p className="text-md">(Không có bài kiểm tra nào)</p> :
                <ul className="space-y-2">
                    {tests.map((test, index) => {
                        const startTime = new Date(test.startTime)
                        const endTime = new Date(test.endTime);
                        const now = new Date();
                        return <div key={index} className="bg-white border border-gray-200 rounded-sm shadow-sm">
                            <p className="p-4 font-semibold">{test.name}</p>
                            <hr></hr>
                            <div className="p-4">
                                <p className="">{test.description}</p>
                                <p>Thời hạn: {timeFormater(startTime)} - {timeFormater(endTime)} {now < startTime ? `(Diễn ra trong ${Math.abs(Number.parseInt((now - startTime) / (60 * 1000)))} phút)` : (now < endTime ? `(Còn lại ${Number.parseInt((endTime - now) / (60 * 1000))} phút)` : '(Đã hết hạn)')}</p>
                                <p>Thời gian thi: {test.time} phút</p>
                                {
                                    <div className="mt-2 font-semibold w-full flex flex-row space-x-2">
                                        {isOwner ? <>
                                            {(now < startTime || now > endTime) && <button
                                                onClick={() => navigate(`${ROUTER_PAGE.TEST.EDIT}?classId=${classId}&id=${test.id}`)}
                                                type="button"
                                                title={'Sửa'}
                                                className="p-2 disabled:!bg-gray-300 rounded flex justify-center items-end text-white bg-green-500 hover:bg-green-700">
                                                <span className="material-icons me-2">edit</span>
                                                <span>Chỉnh sửa</span>
                                            </button>}
                                            <button
                                                onClick={() => handlerRemoveTest(test.id, tests, setTests)}
                                                type="button"
                                                title={'Xóa'}
                                                className="p-2 disabled:!bg-gray-300 rounded flex justify-center items-end text-white bg-red-500 hover:bg-red-700">
                                                <span className="material-icons me-2">close</span>
                                                <span>Xóa</span>
                                            </button>
                                            <button
                                                onClick={() => showPopupStatistical(tests, test.id, setTests)}
                                                type="button"
                                                className="p-2 disabled:!bg-gray-300 rounded flex justify-center items-end text-white bg-orange-500 hover:bg-orange-700"
                                            >
                                                <span className="material-icons me-2">filter_list_alt</span>
                                                <span>Thống kê</span>
                                            </button>
                                        </> : <>
                                            {now >= startTime && now <= endTime && <button
                                                onClick={() => { navigate(`${ROUTER_PAGE.TEST.INDEX}/${test.id}`) }}
                                                type="button"
                                                title={'Làm bài'}
                                                className="p-2 disabled:!bg-gray-300 rounded flex justify-center items-end text-white bg-purple-500 hover:bg-purple-700">
                                                <span>Làm bài</span>
                                            </button>}
                                            <button
                                                onClick={() => showStudentPopupStatistical(tests, test.id, setTests)}
                                                type="button"
                                                title={'Làm bài'}
                                                className="p-2 disabled:!bg-gray-300 rounded flex justify-center items-end text-white bg-gray-500 hover:bg-gray-700">
                                                <span className="material-icons me-2">history</span>
                                                <span>Lịch sử làm bài</span>
                                            </button>
                                        </>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    })}
                </ul>
            }
        </div>
    })
    const ActiveTab = React.memo(({ activeTab, classObj, setClassObj }) => {
        const [myInfo, setMyInfo] = useState({});
        const [students, setStudents] = useState([]);
        const [alerts, setAlerts] = useState([]);
        const [requests, setRequests] = useState([]);
        const [tests, setTests] = useState([]);
        const userId = getUserId();
        const updateMyInfo = (name, file) => {
            updateStudentInfo(classObj.id, name, file)
                .then(response => {
                    toast.success('Cập nhật thành công');
                    const clone = { ...classObj };
                    const newMyInfo = response.data.data;
                    clone.students = [...clone.students].map(student => student.user.id === userId ? { ...newMyInfo } : { ...student });
                    setClassObj(clone);
                    setMyInfo({ ...newMyInfo });
                })
                .catch(() => { })
        }
        useEffect(() => {
            setStudents(classObj.students);
            setAlerts(classObj.alerts);
            setRequests(classObj.requests);
            setTests(classObj.tests);
            classObj.students?.forEach(item => {
                if (item.user.id === userId) {
                    console.log(item)
                    setMyInfo(item);
                }
            })
        }, [classObj])
        return (<div>
            {activeTab === 0 && <ExpandTabAlert alerts={alerts} />}
            {activeTab === 1 && <ExpandTabTest tests={tests} isOwner={classObj.owner.id === userId} setTests={(a) => { setClassObj(prev => { return { ...prev, tests: a } }) }} />}
            {activeTab === 2 && <ExpandTabStudent students={students} isOwner={classObj.owner.id === userId} />}
            {activeTab === 3 && classObj.owner.id !== userId && myInfo.id && <ExpandTabMe myInfo={myInfo} updateMyInfo={updateMyInfo} />}
            {activeTab === 3 && classObj.owner.id === userId && <ExpandTabRequest requests={requests} />}
        </div>)
    });
    return <div>
        <div>
            <Link to={ROUTER_PAGE.CLASS.INDEX} className="text-start text-md text-purple-500 hover:text-purple-600" type="button">
                <span className="material-icons text-md">arrow_back</span>
            </Link><br></br>
            <div className="space-y-4">
                <div className="bg-gray-50 border-2 border-gray-100 rounded-sm shadow-xs p-2 space-y-2">
                    {classObj ? <div>
                        <img className="w-full max-w-full h-60 object-cover" src={classObj.photo ?? DEFAULT_CLASS_IMAGE} alt="" />
                        <div className="my-2">
                            <h2 className="font-bold text-xl"><span className="font-medium">Lớp học:</span> {classObj.name}</h2>
                        </div>
                        {classObj && <div>
                            <div className="flex flex-row pb-2">
                                <div className="">
                                    <p>Giảng viên:</p>
                                    <p>Thời gian tạo:</p>
                                    <p>Mô tả:</p>
                                </div>
                                <div className="ms-5">
                                    <p>{classObj.owner.fullName}{userId === classObj.owner.id && <> - (<span className="font-semibold">Bạn</span>)</>}</p>
                                    <p>{moment(classObj.createdTime).fromNow()}</p>
                                    <p>{classObj.description}</p>
                                </div>
                            </div>
                            {classObj.isUserJoined && <div>
                                {classObj.owner.id !== userId && <button onClick={handlerLeave} type="button" className={`mb-2 bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 font-semibold text-nowrap cursor-pointer flex flex-row items-center disabled:opacity-40 disabled:cursor-default disabled:hover:bg-red-500`}>
                                    <span>Rời khỏi lớp</span>
                                    <span className="material-icons ms-2">logout</span>
                                </button>}
                                <div className="bg-white border border-gray-200">
                                    <div className="border-b-2 border-default rounded-sm">
                                        <ul className="flex flex-wrap -mb-[2px] text-sm font-medium text-center text-body space-x-1">
                                            <li className="">
                                                <button type="button" className={`outline-none font-semibold p-4 border-b-2 text-gray-500 hover:text-purple-900 hover:border-b-purple-900 ${activeTab === 0 && '!text-purple-900 !border-b-purple-900'}`}
                                                    onClick={() => { setActiveTab(0) }}
                                                >
                                                    Thông báo
                                                </button>
                                            </li>
                                            <li className="">
                                                <button type="button" className={`outline-none font-semibold p-4 border-b-2 text-gray-500 hover:text-purple-900 hover:border-b-purple-900 ${activeTab === 1 && '!text-purple-900 !border-b-purple-900'}`}
                                                    onClick={() => { setActiveTab(1) }}
                                                >
                                                    Bài kiểm tra
                                                </button>
                                            </li>
                                            <li className="">
                                                <button type="button" className={`outline-none font-semibold p-4 border-b-2 text-gray-500 hover:text-purple-900 hover:border-b-purple-900 ${activeTab === 2 && '!text-purple-900 !border-b-purple-900'}`}
                                                    onClick={() => { setActiveTab(2) }}
                                                >
                                                    Thành viên
                                                </button>
                                            </li>
                                            {userId === classObj?.owner.id && !classObj.isAutoApprove && <li className="">
                                                <button type="button" className={`outline-none font-semibold p-4 border-b-2 text-gray-500 hover:text-purple-900 hover:border-b-purple-900 ${activeTab === 3 && '!text-purple-900 !border-b-purple-900'}`}
                                                    onClick={() => { setActiveTab(3) }}
                                                >
                                                    Yêu cầu
                                                </button>
                                            </li>}
                                            {userId !== classObj?.owner.id && <li className="">
                                                <button type="button" className={`outline-none font-semibold p-4 border-b-2 text-gray-500 hover:text-purple-900 hover:border-b-purple-900 ${activeTab === 3 && '!text-purple-900 !border-b-purple-900'}`}
                                                    onClick={() => { setActiveTab(3) }}
                                                >
                                                    Tôi
                                                </button>
                                            </li>}
                                        </ul>
                                    </div>
                                    <div className="min-h-[400px] max-h-full bg-gray-50">
                                        <div className="p-2">
                                            <ActiveTab classObj={classObj} activeTab={activeTab} setClassObj={setClassObj} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                            {!classObj.isUserJoined && <div>
                                {!classObj.request && <button onClick={handlerJoin} className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer">Tham gia</button>}
                                {classObj.request && (classObj.request.type === REQUEST_TYPE.REQUEST ? <p className="text-purple-500 font-semibold">Bạn đã yêu cầu tham gia lớp, vui lòng chờ duyệt</p> :
                                    <div>
                                        <p className="text-purple-500">Bạn được mời tham gia lớp học này</p>
                                        <button onClick={handlerAcceptInvite} className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold text-nowrap cursor-pointer">Chấp nhận</button>
                                    </div>
                                )}
                            </div>}
                        </div>}
                    </div> : <p>Lớp học không tồn tại</p>}
                </div>
            </div>
        </div>
        {isOpenPopup && <Popup onClose={() => { setIsOpenPopup(false); setContentPopup(<></>) }} Content={contentPopup} />}
    </div>
}