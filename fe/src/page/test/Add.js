import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { mindClasses } from "../../service/ClassService";
import { CONTENT_TYPE, DEFINE_TYPE, KEY, ROUTER_PAGE } from "../../common/Const";
import { lstSubject, search } from "../../service/QuestionService";
import { toLocalDatetimeValueWithSeconds } from "../../helper/Util";
import { toast } from "react-toastify";
import { create } from "../../service/TestService";


const date = new Date();


const now = new Date();
const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;




export const TestAdd = () => {
    document.title = 'Tạo bài kiểm tra';
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const classId = params.get('classId');
    const [myClasses, setMyClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classSelected, setClassSelected] = useState(undefined);
    const [subjectSelected, setSubjectSelected] = useState('');
    const [subjectObjSelected, setSubjectObjSelected] = useState({});
    const [topicSelected, setTopicSelected] = useState('');
    const [errors, setErrors] = useState({});
    const [groups, setGroups] = useState([]);
    const [expandListQuestion, setExpandListQuestion] = useState(true);
    const [expandConfig, setExpandConfig] = useState(true);
    const [inputTimeStart, setInputTimeStart] = useState(toLocalDatetimeValueWithSeconds(new Date()));
    const [inputTimeEnd, setInputTimeEnd] = useState('');
    const [inputTimeCount, setTimeCount] = useState(45);
    const [inputSoLanLamBai, setSoLanLamBai] = useState(1);
    const [inputTotalScore, setInputTotalScore] = useState(10);
    const [inputTestTitle, setInputTestTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputTestMix, setInputTestMix] = useState(false);
    const [groupsSelected, setGroupsSelected] = useState({});
    useEffect(() => {
        mindClasses()
            .then(response => {
                setMyClasses(response.data.data)
            })
            .catch(() => { })
        lstSubject()
            .then(response => {
                setSubjects(response.data.data)
            })
            .catch(() => { })
        setClassSelected(classId);
    }, []);
    useEffect(() => {
        if (!subjectSelected) return;
        const find = subjects.find(item => item.id === subjectSelected);
        if (find) setSubjectObjSelected(find);
        searchQuestion();
        setGroupsSelected({})
    }, [subjectSelected])
    useEffect(() => {
        if (!subjectSelected) return;
        searchQuestion();
    }, [topicSelected])
    const handlerSave = () => {
        setErrors({});
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        create({
            name: inputTestTitle,
            description: inputDescription,
            startTime: inputTimeStart,
            endTime: inputTimeEnd,
            classId: classSelected,
            time: inputTimeCount,
            lstGroupId: Object.keys(groupsSelected),
            isMix: !!inputTestMix,
            totalScore: inputTotalScore,
            maxCountDo: inputSoLanLamBai,
            subjectId: subjectSelected
        })
        .then(_ => {
            toast.success('Tạo mới thành công');
            navigate(`${ROUTER_PAGE.CLASS.INDEX}/${classId}`)  
        })
        .catch(() => {})
    }
    const validate = () => {
        const errors = {};
        if (!classSelected) 
            errors.class = 'Vui lòng chọn lớp';
        if (!subjectSelected)
            errors.subject = 'Vui lòng chọn môn học';
        if (!inputTestTitle) 
            errors.title = 'Vui lòng nhập tiêu đề bài thi';
        else if (!(inputTestTitle?.trim().length < 100))
            errors.title = 'Tiêu đề không được nhập quá 100 ký tự';
        if (!inputTimeStart)
            errors.timeStart = 'Vui lòng nhập thời gian bắt đầu';
        if (!inputTimeEnd)
            errors.timeEnd = 'Vui lòng nhập thời gian hết hạn';
        else if (inputTimeStart && new Date(inputTimeEnd) < new Date(inputTimeStart))
            errors.timeEnd = 'Thời gian hết hạn không được bé hơn thời gian bắt đầu';
        if (!inputTimeCount)
            errors.timeCount = 'Vui lòng nhập thời gian lâm bài';
        else if (inputTimeCount < 0)
            errors.timeCount = 'Thời gian làm bài phải lớn hơn 0';
        else if (`${inputTimeCount}`.split('').find(item => !(item >= '0' && item <= '9')))
            errors.timeCount = 'Thời gian làm bài phải là số nguyên';
        else if (inputTimeStart && inputTimeEnd && (Math.abs((new Date(inputTimeStart).getTime() - new Date(inputTimeEnd).getTime()) / (1000*60)) < inputTimeCount))
            errors.timeCount = 'Thời gian bắt đầu đến hết hạn không đủ ' + inputTimeCount + ' phút';
        if (!inputSoLanLamBai)
            errors.soLanLamBai = 'Vui lòng nhập số lần làm bài';
        if (!inputTotalScore)
            errors.totalScore = 'Vui lòng nhập thang điểm';
        else if (inputTotalScore < 0)
            errors.totalScore = 'Thang điểm phải lớn hơn 0';
        else if (`${inputTotalScore}`.split('').find(item => !(item >= '0' && item <= '9')))
            errors.totalScore = 'Thang điểm phải là số nguyên';
        if (Object.keys(errors).length == 0 && !Object.keys(groupsSelected)?.length > 0)
        {
            errors.countGroup = true;
            toast.error('Vui lòng chọn câu hỏi')
        }
        else if (Object.keys(errors)?.length > 0) 
            errors.config = true;
        return errors
    }
    const handlerSelectGroup = (group) => {
        if (!group) return;
        const clone = { ...groupsSelected };
        clone[group.id] = group;
        setGroupsSelected(clone);
    }
    const searchQuestion = () => {
        search(subjectSelected, topicSelected)
            .then(response => {
                setGroups(response.data.data);
            })
            .catch(() => { })
    }
    const handlerRmGroup = (group) => {
        const {[group.id]: _, ...newGroupSelected} = groupsSelected;
        setGroupsSelected(newGroupSelected)
    }
    const ItemQuestion = ({ question, num }) => {
        return <div className="flex flex-row flex-wrap justify-center space-x-2 space-y-2 w-full">
            {question.contents?.map((content, index) => {
                return content.type === CONTENT_TYPE.TEXT ?
                    <pre className="w-full" key={index}>{index === 0 ? 'Câu hỏi' + (num ? ' ' + num : '') + ":" : ''} {content.content}</pre> :
                    <img key={index} className="w-40" src={content.photo} alt="" />
            })}
            {
                question.answers?.map((answer, index) => {
                    return <pre key={answer.id} className="w-full"><span className={answer.isCorrect ? 'font-semibold underline' : ''}>{String.fromCharCode(65 + index)}.</span> {answer.contents[0].content}</pre>
                })
            }
        </div>
    }
    const ItemContent = ({ content }) => {
        return content.type === CONTENT_TYPE.TEXT ?
            <pre className="w-full" >{content.content}</pre> :
            <img className="w-40" src={content.photo} alt="" />
    }
    const ItemQuestionPreview = ({ question, score, num }) => {
        return <div className="w-full bg-gray-50 rounded border border-gray-200">
            <div className="p-2 w-full">
                <p className="text-xs">{score} điểm</p>
                <p className="font-semibold">Câu hỏi {num}</p>
            </div>
            <hr></hr>
            <div className="p-2">
                <div className="w-full flex justify-center flex-wrap space-x-2 space-y-2">
                    {question.contents.map((content, key) => <ItemContent key={key} content={content} />)}
                </div>
                <div className="mt-2">
                    {question.answers.map((answer, key1) => {
                        const content = answer.contents[0].content;
                        return <div key={key1} className="mb-2">
                            {question.type === KEY.QUESTION_TYPE.CHOICE ?
                                <button type="button" className="border border-black/60 text-black/60 rounded-full w-7 h-7">{String.fromCharCode(65 + key1)}</button>
                                : <input type="checkbox" id={`answer-${answer.id}`} />}
                            <label className="ms-2" htmlFor={`answer-${answer.id}`}>{content}</label>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
    const Preview = React.memo(({ groupsSelected, inputTestTitle, inputDescription, inputTimeCount, inputTotalScore, rmGroup }) => {
        const questionCount = Object.keys(groupsSelected)?.map(groupId => groupsSelected[groupId].questions.length).reduce((total, item) => total + item, 0);
        let index = 0;
        const scorePer = (inputTotalScore / questionCount)?.toFixed(2);
        return <div className="h-full w-full bg-gray-50 p-2 flex flex-col max-h-full overflow-hidden">
            <p className="font-semibold text-lg">Bài thi: {inputTestTitle}</p>
            <p className="">Mô tả: {inputDescription?.trim() || 'Không có'}</p>
            <p className="">Thời gian làm bài: {inputTimeCount} phút</p>
            <p className="">Số lượng câu hỏi: {questionCount}</p>
            <hr className="mt-2"></hr>
            <div className="h-full max-h-full overflow-y-auto w-full border-b border-gray-200">
                <div className="flex flex-col space-y-2 py-2">
                    {Object.keys(groupsSelected ?? {})?.map((groupId, i2) => {
                        const group = groupsSelected[groupId];
                        if (group.type === DEFINE_TYPE.ONLY) index++;
                        return <div key={i2} className="w-full flex flex-row flex-nowrap space-x-2">
                            <div className="">
                                <button 
                                    onClick={() => rmGroup(group)}
                                    type="button"
                                    title={'Xóa'}
                                    className="disabled:!bg-gray-300 rounded flex justify-center items-end text-white bg-red-500 hover:bg-red-700">
                                        <span className="material-icons">remove</span>
                                </button>
                            </div>
                            {group.type === DEFINE_TYPE.GROUP ?
                                <div key={i2} className="bg-red flex flex-col w-full justify-center items-center p-2 border border-blue-200 bg-blue-100 shadow-sm shadow-blue-200">
                                    <div className="space-x-2 space-y-2 w-full flex flex-row flex-wrap justify-center">
                                        {group.contents?.map((content, i1) => <ItemContent key={i1} content={content} />)}
                                    </div>
                                    <div className="mt-2 flex w-full flex-col space-y-2">
                                        {group.questions?.map((question, i) => { index++; return <ItemQuestionPreview key={i} question={question} num={index} score={scorePer} /> })}
                                    </div>
                                </div> :
                                <ItemQuestionPreview key={i2} question={group.questions[0]} score={scorePer} num={index} />}
                        </div>
                    })}
                </div>
            </div>
        </div>
    })
    return <div className=" w-full xl:h-[100vh]">
        <div className="w-full h-full bg-white rounded">
            <div className="grid grid-cols-1 xl:grid-cols-2 h-full">
                <div className="min-h-full h-full flex flex-col max-h-[100vh]">
                    <div className="flex flex-row justify-between items-center w-full bg-purple-500 p-2">
                        <Link to={ROUTER_PAGE.CLASS.INDEX} className="text-start text-md text-white hover:opacity-80" type="button">
                            <span className="material-icons text-md">arrow_back</span>
                        </Link>
                        <button onClick={handlerSave} type="button" className="bg-white text-purple-500 px-2 rounded-sm font-semibold hover:opacity-80 py-1">
                            Lưu
                        </button>
                    </div>
                    <h2 className="font-semibold text-lg my-4 text-center">Tạo mới đề thi</h2>
                    <div className="h-full flex flex-col overflow-hidden p-2">
                        <div className="w-full mt-2 max-h-[40%] flex flex-col">
                            <div className={`bg-gray-200 p-2 flex flex-row justify-between items-center rounded ${expandConfig && 'rounded-b-none'} ${errors?.config ? "border border-red-500" : ""}`}>
                                <h2 className="font-semibold">Thông tin cấu hình</h2>
                                <button onClick={() => setExpandConfig(!expandConfig)} type="button" className={`p-1 rounded hover:bg-gray-300 flex justify-center items-center ${!expandConfig && 'rotate-180'}`}><span className="material-icons font-normal">keyboard_arrow_up</span></button>
                            </div>
                            {
                            expandConfig && <div className={`overflow-y-auto h-full border border-gray-200 p-2 rounded ${expandConfig ? 'rounded-t-none' : 'rotate-180'}`}>
                                <div>
                                    <div className="">
                                        <label htmlFor="chose-class">Chọn lớp học (<span className="text-red-600">*</span>)</label>
                                        <select
                                            disabled={!!classId}
                                            placeholder="Chọn lớp học"
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.class ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            value={classSelected}
                                            onChange={(e) => { setClassSelected(String(e.target.value)) }}
                                            name="chose-class"
                                        >
                                            <option value=''>Chọn lớp học</option>
                                            {myClasses?.map((item, index) => {
                                                return <option key={index} value={item.id}>{item.name}</option>
                                            })}
                                        </select>
                                        <p className="text-red-500 text-sm mt-1">{errors?.class ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="chose-subject">Chọn môn học (<span className="text-red-600">*</span>)</label>
                                        <select
                                            placeholder="Chọn môn học"
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.subject ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            value={subjectSelected}
                                            onChange={(e) => { setSubjectSelected(String(e.target.value)) }}
                                            name="chose-subject"
                                        >
                                            <option value=''>Chọn môn học</option>
                                            {subjects?.map((item, index) => {
                                                return <option key={index} value={item.id}>{item.name}</option>
                                            })}
                                        </select>
                                        <p className="text-red-500 text-sm mt-1">{errors?.subject ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="chose-subject">Chọn chủ đề</label>
                                        <select
                                            placeholder="Chọn chủ đề"
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            value={topicSelected}
                                            onChange={(e) => { setTopicSelected(String(e.target.value)) }}
                                            name="chose-subject"
                                        >
                                            <option value=''>Chọn chủ đề</option>
                                            {subjectObjSelected?.topics?.map((item, index) => {
                                                return <option key={index} value={item.id}>{item.name}</option>
                                            })}
                                        </select>
                                        <p className="text-red-500 text-sm mt-1">&nbsp;</p>
                                    </div>
                                    <div>
                                        <label htmlFor="test-title">Tiêu đề bài thi (<span className="text-red-600">*</span>)</label>
                                        <input
                                            name="test-title"
                                            value={inputTestTitle}
                                            onChange={(e) => { setInputTestTitle(e.target.value); }}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.title ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            type="text"
                                            placeholder="Nhập tiêu đề bài thi" />
                                        <p className="text-red-500 text-sm mt-1">{errors?.title ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="test-description">Mô tả</label>
                                        <textarea
                                            maxLength={500}
                                            placeholder="Nhập mô tả"
                                            rows={3}
                                            name="test-description"
                                            value={inputDescription}
                                            onChange={(e) => { setInputDescription(e.target.value); }}
                                            className="w-full mt-1 border rounded-lg p-2 px-4 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300"
                                            type="text" >
                                        </textarea>
                                        <p className="text-red-500 text-sm mt-1">&nbsp;</p>
                                    </div>
                                    <div>
                                        <label htmlFor="time-start">Thời gian bắt đầu (<span className="text-red-600">*</span>)</label>
                                        <input
                                            value={inputTimeStart}
                                            onChange={(e) => { setInputTimeStart(e.target.value); }}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.timeStart ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            type="datetime-local"
                                            name="time-start" />
                                        <p className="text-red-500 text-sm mt-1">{errors?.timeStart ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="time-end">Thời gian hết hạn (<span className="text-red-600">*</span>)</label>
                                        <input
                                            value={inputTimeEnd}
                                            onChange={(e) => { setInputTimeEnd(e.target.value); }}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.timeEnd ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            type="datetime-local"
                                            name="time-end" />
                                        <p className="text-red-500 text-sm mt-1">{errors?.timeEnd ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="time-count">Thời gian làm bài (<span className="text-red-600">*</span>)</label>
                                        <input
                                            value={inputTimeCount}
                                            onChange={(e) => { setTimeCount(e.target.value); }}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.timeCount ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            type="number" placeholder="Nhập thời gian làm bài"
                                            name="time-count" />
                                        <span className="text-xs ms-2">(Đơn vị tính bằng phút)</span>
                                        <p className="text-red-500 text-sm mt-1">{errors?.timeCount ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="test-total-score">Thang điểm (<span className="text-red-600">*</span>)</label>
                                        <input
                                            value={inputTotalScore}
                                            onChange={(e) => { setInputTotalScore(e.target.value); }}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.totalScore ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            type="number" placeholder="Nhập thang điểm"
                                            name="test-total-score" />
                                        <p className="text-red-500 text-sm mt-1">{errors?.totalScore ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="test-count-do">Số lần làm bài (<span className="text-red-600">*</span>)</label>
                                        <input
                                            value={inputSoLanLamBai}
                                            onChange={(e) => { setSoLanLamBai(e.target.value); }}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.soLanLamBai ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            type="number" placeholder="Nhập số lần làm bài"
                                            name="test-count-do" />
                                        <p className="text-red-500 text-sm mt-1">{errors?.soLanLamBai ?? <>&nbsp;</>}</p>
                                    </div>
                                    <div>
                                        <input value={inputTestMix} type="checkbox" name="test-mix" id="test-mix" onChange={(_) => setInputTestMix(!inputTestMix)} />
                                        <label htmlFor="test-mix" className="ms-2">Trộn câu hỏi</label>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div className="w-full mt-2 h-auto flex flex-col overflow-hidden">
                            <div className={`bg-gray-200 p-2 flex flex-row justify-between items-center rounded ${expandListQuestion && 'rounded-b-none'}`}>
                                <h2 className="font-semibold">Danh sách câu hỏi</h2>
                                <button onClick={() => setExpandListQuestion(!expandListQuestion)} type="button" className={`p-1 rounded hover:bg-gray-300 flex justify-center items-center ${!expandListQuestion && 'rotate-180'}`}><span className="material-icons font-normal">keyboard_arrow_up</span></button>
                            </div>
                            {expandListQuestion && <>
                                <hr></hr>
                                <div className="rounded-b bg-gray-50 h-full overflow-y-auto border border-t-0 border-gray-200 rounded rounded-t-none">
                                    <div className="flex flex-col">
                                        {groups?.length > 0 ?
                                            groups?.map((group) => <div className="w-full" key={group.id}>
                                                <div className="flex flex-row space-x-2 border-b border-gray-200 p-2 w-full">
                                                    <div className="">
                                                        <button disabled={Object.keys(groupsSelected[group.id] ?? {}).length > 0}
                                                            onClick={() => handlerSelectGroup(group)}
                                                            type="button"
                                                            title={Object.keys(groupsSelected[group.id] ?? {}).length > 0 ? 'Đã thêm' : 'Thêm'}
                                                            className="disabled:!bg-gray-300 rounded flex justify-center items-end text-white bg-purple-500 hover:bg-purple-700"><span className="material-icons">add</span></button>
                                                    </div>
                                                    <div className="flex flex-col items-center w-full">
                                                        <div className="bg-blue-100 border border-blue-200 shadow-sm shadow-blue-200 w-full p-2">
                                                            <p className="w-full text-xs">Loại: {group.type === DEFINE_TYPE.GROUP ? 'Nhóm câu hỏi' : 'Câu hỏi riêng biệt'}</p>
                                                            {group.type === DEFINE_TYPE.GROUP && <p className="w-full text-xs">Số lượng: {group.questions?.length ?? 0} câu</p>}
                                                            <p className="w-full text-xs">Độ khó: {group.difficulty}</p>
                                                            {group.type === DEFINE_TYPE.GROUP && <p className="w-full text-xs">Có thể trộn câu hỏi của nhóm</p>}
                                                            {group.type === DEFINE_TYPE.GROUP && group.contents && <div className="mt-2 border-t border-blue-200 w-full flex flex-col items-center">{group.contents.map((content, index) => {
                                                                return content.type === CONTENT_TYPE.TEXT ? <pre key={index} className="w-full">
                                                                    {content.content}
                                                                </pre> : <img key={index} className="w-40" src={content.photo} alt="" />;
                                                            })} </div>}
                                                        </div>
                                                        {group.questions.map((question, index) => <ItemQuestion key={question.id} question={question} num={group.type === DEFINE_TYPE.GROUP ? index + 1 : ''} />)}
                                                    </div>
                                                </div>
                                            </div>) :
                                            <p className="p-2">Chưa có câu hỏi nào</p>
                                        }
                                    </div>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
                <div className="border-0 xl:!border-l flex flex-col overflow-hidden">
                    <div className="h-12 bg-gray-200 w-full flex items-center p-2">
                        <p className="font-semibold py-2">Xem trước</p>
                    </div>
                    <Preview rmGroup={handlerRmGroup} groupsSelected={groupsSelected} inputTestTitle={inputTestTitle} inputDescription={inputDescription} inputTotalScore={inputTotalScore} inputTimeCount={inputTimeCount} />
                </div>
            </div>
        </div>
    </div>
}