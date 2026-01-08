import { act, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { create, getById, lstSubject, update } from "../service/QuestionService";
import { CONTENT_TYPE, DEFINE_DIFFICULTY, DEFINE_TYPE, ROUTER_PAGE } from "../common/Const";
import { toast } from "react-toastify";
import { QuestionGroupInput } from "./QuestionGroupInput";
import { QuestionInput } from "./QuestionInput";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const QuestionAddOrEdit = ({ action }) => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [type, setType] = useState(undefined);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [subjectsLookup, setSubjectsLookup] = useState([]);
    const [topicsLookup, setTopicLookup] = useState([]);
    const [checkboxAddNewSubject, setCheckboxAddNewSubject] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [checkboxAddNewTopic, setCheckboxAddNewTopic] = useState(false);
    const [newTopic, setNewTopic] = useState('');
    const [questionObj, setQuestionObj] = useState({});
    const [questionGroup, setQuestionGroup] = useState({})
    const [difficulty, setDifficulty] = useState('');
    const [params] = useSearchParams();
    const [group, setGroup] = useState();
    useEffect(() => {
        lstSubject()
            .then(response => {
                setSubjectsLookup(response.data.data);
            })
            .catch(() => { })
        setQuestionObj(createNewQuestion());
        if (action === 'add') return; 
        const groupId = params.get('id');
        if (groupId)
            getById(groupId)
                .then(response => {
                    const g = response.data.data; 
                    setGroup(g);
                    setSubject(g.subjectId);
                    setTopic(g.topicId);
                    setDifficulty(g.difficulty);
                    setType(g.type);
                    if (g.type === DEFINE_TYPE.ONLY) {
                        setQuestionObj(parseQuestion(g.questions[0]));
                    } else if (g.type === DEFINE_TYPE.GROUP) {
                        const c = parseContent(g.contents);
                        setQuestionGroup({
                            photos: c?.photos,
                            content: c?.contents[0]?.content,
                            questions: g.questions.map((question, index) => ({...parseQuestion(question), no: index, key: index})),
                            canMix: g.canMix
                        })
                    }
                })
                .catch(error => {

                })
    }, [])
    const parseQuestion = (question) => {
        const c = parseContent(question.contents);
        return {
            photos: c.photos,
            content: c.contents[0].content,
            type: question.type,
            answers: question.answers.map(answer => ({isCorrect: answer.isCorrect, content: answer.contents[0].content}))
        }
    }
    const parseContent = (contents) => {
        return {
            contents: contents.filter(item => item.type === CONTENT_TYPE.TEXT).map(item => parseContentText(item)),
            photos: contents.filter(item => item.type === CONTENT_TYPE.PHOTO).map((item, index) => ({...parseContentPhoto(item), no: index}))
        }
    }
    const parseContentText = (content) => {
        return {
            type: content.type, 
            content: content.content
        }
    }
    const parseContentPhoto = (content) => {
        return {
            type: content.type, 
            id: content.photoId,
            url: content.photo
        }
    }
    useEffect(() => {
        setTopicLookup(subjectsLookup.find(item => item.id === subject)?.topics ?? [])
    }, [subject])
    useEffect(() => {
        if (type === DEFINE_TYPE.GROUP && !questionGroup.questions?.length > 0)
            setQuestionGroup({ questions: [{ ...(questionObj ?? createNewQuestion()), key: 0 }] })
    }, [type])
    useEffect(() => {
        if (checkboxAddNewSubject === true) {
            if (!checkboxAddNewTopic)
                setCheckboxAddNewTopic(true);
        }
    }, [checkboxAddNewSubject])
    const createNewQuestion = () => {
        return {
            answers: [{ key: 0 }, { key: 1 }]
        };
    }
    const handlerAddClass = (e) => {
        e.preventDefault();
        setErrors({});
        let request = {};
        if (checkboxAddNewSubject === true)
            request = { ...request, newSubject: newSubject, isSubjectCreate: true };
        else
            request = { ...request, subjectId: subject };
        if (checkboxAddNewTopic === true)
            request = { ...request, newTopic: newTopic, isTopicCreate: true }
        else
            request = { ...request, topicId: topic };
        request.difficulty = difficulty;
        request.type = type;
        if (type === DEFINE_TYPE.ONLY)
            request = { ...request, questions: [mapQuestionRequest(questionObj, 0)] };
        else if (type === DEFINE_TYPE.GROUP) {
            if (questionGroup.content?.trim().length > 0) {
                request.contents = [{ no: 0, content: questionGroup.content, type: CONTENT_TYPE.TEXT }]
            } else request.contents = [];
            const size = request.contents.length;
            if (questionGroup.photos?.length > 0)
                request.contents = [
                    ...request.contents,
                    ...questionGroup.photos.map((item, index) => { return { no: size + index, photoId: item.id, type: CONTENT_TYPE.PHOTO } })
                ]
            if (questionGroup.canMix === true)
                request.canMix = true;
            request.questions = questionGroup.questions.map((item, index) => {
                return mapQuestionRequest(item, index)
            })
        }

        console.log(request)
        const newErrors = validateForm(request);
        console.log(newErrors)
        if (newErrors === true || Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (action === 'add')
            create(request)
                .then(() => {
                    toast.success('Thêm câu hỏi thành công')
                    navigate(ROUTER_PAGE.QUESTION.INDEX)
                })
                .catch(() => {

                })
        else if (action === 'edit') {
            confirmAlert({
                title: 'Xác nhận chỉnh sửa',
                message: 'Bạn có chắc muốn cập nhật bản ghi này không?',
                buttons: [
                    {
                        label: 'Có',
                        onClick: () => {    
                            request.id = group.id;
                            update(request)
                                .then(() => {
                                    toast.success('Cập nhật thành công');
                                    navigate(ROUTER_PAGE.QUESTION.INDEX)
                                })  
                                .catch(() => {})
                        }
                    },
                    {
                        label: 'Không',
                        onClick: () => { } // hủy
                    }
                ],
                overlayClassName: 'bg-white/20',
                className: 'custom-confirm-box'
            });
        }
    }
    const mapQuestionRequest = (question, no) => {
        if (!question) return {};
        let questionRequest = {};
        questionRequest.no = no;
        questionRequest.type = question.type;
        questionRequest.contents = [
            { no: 0, content: question.content, type: CONTENT_TYPE.TEXT },
            ...(question.photos?.map((item, index) => { return { no: 1 + index, photoId: item.id, type: CONTENT_TYPE.PHOTO } }) ?? [])
        ];
        questionRequest.answers = question.answers.map((item, index) => {
            return {
                no: index, isCorrect: item.isCorrect ? true : false,
                contents: [{ no: 0, content: item.content, type: CONTENT_TYPE.TEXT }]
            }
        });
        return questionRequest;
    }
    const validateForm = (request) => {
        let errors = {};
        if (request.isSubjectCreate === true) {
            if (!request.newSubject?.trim().length > 0)
                errors.subject = 'Môn học mới không thể để trống';
        }
        else if (!request.subjectId?.trim().length > 0) {
            errors.subject = 'Môn học không thể để trống';
        }
        if (request.isSubjectCreate === true || request.isTopicCreate === true) {
            if (!request.newTopic?.trim().length > 0)
                errors.topic = 'Chủ đề mới không thể để trống';
        }
        else if (!request.topicId?.trim().length > 0) {
            errors.topic = 'Chủ đề không thể để trống';
        }
        if (!request.difficulty?.trim().length > 0) {
            errors.difficulty = 'Độ khó không thể để trống';
        }
        if (!request.type?.trim().length > 0) {
            errors.type = 'Loại không thể để trống';
        }
        if (Object.keys(errors).length === 0 && request.questions)
            for (let item of request.questions) {
                if (!item.type) {
                    toast.error('Loại câu hỏi không thể để trống');
                    return true;
                }
                if (isEmptyContent(item.contents)) {
                    toast.error('Nội dung câu hỏi không thể để trống');
                    return true;
                }
                let hasCorrect = false;
                for (let answer of item.answers) {
                    if (isEmptyContent(answer.contents)) {
                        toast.error('Nội dung câu trả lời không thể để trống');
                        return true;
                    }
                    if (answer.isCorrect) hasCorrect = true;
                }
                if (!hasCorrect) {
                    toast.error('Cần ít nhất 1 câu trả lời đúng');
                    return true;
                }
            }
        return errors;
    }
    const isEmptyContent = (contents) => {
        if (!contents || contents.length === 0) return true;
        return contents.every(item => !item.content);
    }
    return <div className="">
        <form className="" autoComplete="off">
            <div className="space-y-12 flex flex-col items-center">
                <div className="w-full">
                    <Link to={ROUTER_PAGE.QUESTION.INDEX} className="text-start text-md text-purple-500 hover:text-purple-600" type="button">
                        <span className="material-icons text-md">arrow_back</span>
                    </Link><br></br>
                </div>
                {(action === 'add' || group) &&
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                        <div className="border-b border-white/10 pb-12">
                            <h2 className="text-xl font-bold text-center text-purple-500 mt-2">{action === 'add' ? 'Thêm câu hỏi' : 'Sửa câu hỏi'}</h2>
                            <div className="mt-4 text-md">
                                <div className="">
                                    <label className="block font-medium mb-1">
                                        Môn học (<span className="text-red-500">*</span>)
                                        <span className="text-gray-500 text-sm ms-2">
                                            <input value={checkboxAddNewSubject} onChange={() => { setCheckboxAddNewSubject(!checkboxAddNewSubject) }} type="checkbox" className="size-2.5 me-0.5 border" name="add-new-subject-checkbox" id="add-new-subject-checkbox" />
                                            <label htmlFor="add-new-subject-checkbox">Thêm mới</label>
                                        </span>
                                    </label>
                                    {!checkboxAddNewSubject ? <select
                                        placeholder="Môn học"
                                        className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.subject ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                        value={subject}
                                        onChange={(e) => { setSubject(String(e.target.value)) }}
                                    >
                                        <option value=''>Chọn môn học</option>
                                        {subjectsLookup && subjectsLookup.map((item, index) => {
                                            return <option key={index} value={item.id}>{item.name}</option>
                                        })}
                                    </select>
                                        :
                                        <input
                                            type="text"
                                            value={newSubject}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.newSubject ? "border-red-500" : ""} disabled:bg-gray-50 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            onChange={(e) => { setNewSubject(e.target.value) }}
                                            placeholder="Nhập môn học mới"
                                        />
                                    }
                                    <p className="text-red-500 text-sm mt-1">{errors?.subject ?? <>&nbsp;</>}</p>
                                </div>
                                <div className="">
                                    <label className="block font-medium mb-1">
                                        Chủ đề (<span className="text-red-500">*</span>)
                                        <span className="text-gray-500 text-sm ms-2">
                                            <input value={checkboxAddNewTopic} checked={checkboxAddNewTopic} disabled={checkboxAddNewSubject} onChange={() => { setCheckboxAddNewTopic(!checkboxAddNewTopic) }} type="checkbox" className="size-2.5 me-0.5" name="add-new-topic-checkbox" id="add-new-topic-checkbox" />
                                            <label htmlFor="add-new-topic-checkbox">Thêm mới</label>
                                        </span>
                                    </label>
                                    {!checkboxAddNewTopic ? <select
                                        placeholder="Chủ đề"
                                        className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.topic ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                        onChange={(e) => { setTopic(String(e.target.value)) }}
                                        value={topic}
                                    >
                                        <option value=''>Chọn chủ đề</option>
                                        {topicsLookup && topicsLookup.map((item, index) => {
                                            return <option key={index} value={item.id}>{item.name}</option>
                                        })}
                                    </select>
                                        :
                                        <input
                                            type="text"
                                            value={newTopic}
                                            className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.newTopic ? "border-red-500" : ""} disabled:bg-gray-50 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                            onChange={(e) => { setNewTopic(e.target.value) }}
                                            placeholder="Nhập chủ đề mới"
                                        />
                                    }
                                    <p className="text-red-500 text-sm mt-1">{errors?.topic ?? <>&nbsp;</>}</p>
                                </div>
                                <div className="">
                                    <label className="block font-medium mb-1">Độ khó (<span className="text-red-500">*</span>)</label>
                                    <select
                                        placeholder="Độ khó"
                                        className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.difficulty ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                        onChange={(e) => { setDifficulty(String(e.target.value)) }}
                                        value={difficulty}
                                    >
                                        <option value=''>Chọn độ khó</option>
                                        {
                                            [
                                                { key: DEFINE_DIFFICULTY.EASY, txt: 'Dễ' },
                                                { key: DEFINE_DIFFICULTY.MEDIUM, txt: 'Trung bình' },
                                                { key: DEFINE_DIFFICULTY.HARD, txt: 'Khó' }
                                            ].map((item, index) => <option key={index} value={item.key}>{item.txt}</option>)
                                        }
                                    </select>
                                    <p className="text-red-500 text-sm mt-1">{errors?.difficulty ?? <>&nbsp;</>}</p>
                                </div>
                                <div className="">
                                    <label className="block font-medium mb-1">Loại (<span className="text-red-500">*</span>)</label>
                                    <select
                                        placeholder="Loại câu hỏi"
                                        className={`w-full mt-1 border rounded-lg p-2 px-4 ${errors?.type ? "border-red-500" : ""} shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                        onChange={(e) => { setType(String(e.target.value)); }}
                                        value={type}
                                    >
                                        <option value=''>Chọn loại</option>
                                        {
                                            [
                                                { key: DEFINE_TYPE.ONLY, txt: 'Câu hỏi riêng biệt' },
                                                { key: DEFINE_TYPE.GROUP, txt: 'Nhóm câu hỏi' }
                                            ].map((item, index) => <option key={index} value={item.key}>{item.txt}</option>)
                                        }
                                    </select>
                                    <p className="text-red-500 text-sm mt-1">{errors?.type ?? <>&nbsp;</>}</p>
                                </div>
                                {type && <div className="">
                                    {type === DEFINE_TYPE.GROUP && <QuestionGroupInput questionGroup={questionGroup} setQuestionGroup={setQuestionGroup} createNewQuestion={createNewQuestion} />}
                                    {type === DEFINE_TYPE.ONLY && <QuestionInput question={questionObj} setQuestion={setQuestionObj} />}
                                </div>}
                                <button onClick={handlerAddClass} type="submit" className="bg-purple-500 text-white rounded hover:bg-purple-700 hover:text-white font-semibold text-nowrap flex items-center justify-center p-2 mt-1 float-right">
                                    {action === 'add' ? 'Thêm' : 'Cập nhật'}
                                </button>
                            </div>
                        </div>
                        <div className="w-full h-full p-2">
                            <div className="bg-gray-100 rounded-sm w-full h-full p-2">
                                <p className="text-gray-500">Xem trước</p>
                                <hr className="w-full"></hr>
                                {type === DEFINE_TYPE.ONLY && <div>
                                    <pre className="font-semibold">{questionObj.content}</pre>
                                    {questionObj.photos && <div className="flex flex-row flex-wrap max-w-full justify-center">
                                        {questionObj.photos.map((item, index) => <img key={index} alt="" className="w-80 m-1" src={item.url} />)}
                                    </div>}
                                    {questionObj.answers && <div className="flex flex-col">
                                        {questionObj.answers.map((item, index) => <span key={index}><span className={item.isCorrect === true ? 'underline' : ''}>{String.fromCharCode(65 + index)}. </span>{item?.content ?? ''}</span>)}
                                    </div>}
                                </div>}
                                {type === DEFINE_TYPE.GROUP && <>
                                    <pre className="font-semibold">{questionGroup.content}</pre>
                                    {questionGroup.photos && <div className="flex flex-row flex-wrap max-w-full justify-center">
                                        {questionGroup.photos.map((item, index) => <img key={index} alt="" className="w-80 m-1" src={item.url} />)}
                                    </div>}
                                    {
                                        questionGroup.questions && questionGroup.questions.map((item, index) => <div key={index}>
                                            <pre className="font-semibold">Câu {index + 1}: {item.content}</pre>
                                            {item.photos && <div className="flex flex-row flex-wrap max-w-full justify-center">
                                                {item.photos.map((item, index) => <img key={index} alt="" className="w-80 m-1" src={item.url} />)}
                                            </div>}
                                            {item.answers && <div className="flex flex-col">
                                                {item.answers.map((item, index) => <span key={index}><span className={item.isCorrect === true ? 'underline' : ''}>{String.fromCharCode(65 + index)}.</span> {item?.content ?? ''}</span>)}
                                            </div>}
                                        </div>)
                                    }
                                </>}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </form>
    </div>
}