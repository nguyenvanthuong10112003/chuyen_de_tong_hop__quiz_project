import React, { useEffect, useRef, useState } from "react";
import { changeAnswer, getAllChangeLatestBySession, getSessionById, submit } from "../../service/TestService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CONTENT_TYPE, KEY, ROUTER_PAGE } from "../../common/Const";
import { Popup } from "../../component/Popup";
import { ConfirmAlertComp } from "../../component/ConfirmAlert";
import { confirmAlert } from "react-confirm-alert";

export const TestSession = ({ }) => {
    const params = useParams();
    const [session, setSession] = useState({})
    const [groups, setGroups] = useState([])
    const sessionId = params.id;
    const [timeLeft, setTimeLeft] = useState(0);
    const [current, setCurrent] = useState({});
    const [answers, setAnswers] = useState({});
    const [imgPreview, setImgPreview] = useState('');
    const [lstSelected, setLstSelected] = useState({});
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [contentPopup, setContentPopup] = useState(<></>);
    const navigate = useNavigate();

    useEffect(() => {
        saveChanges();
    }, [current])

    const saveChanges = () => {
        const lstQuestionId = Object.keys(lstSelected).filter(item => !lstSelected[item].saved) || [];
        if (lstQuestionId.length === 0) return;
        changeAnswer({ sessionId: sessionId, changes: lstQuestionId.map(item => { return { questionId: item, lstAnswerId: lstSelected[item].answers } }) })
            .then(_ => {
                setLstSelected(prev => {
                    const clone = { ...prev };

                    lstQuestionId.forEach(qid => {
                        clone[qid] = {
                            ...clone[qid],
                            saved: true
                        };
                    });

                    return clone;
                });
            })
            .catch(() => {

            })
    }

    /* Countdown */
    useEffect(() => {
        getSessionById(sessionId)
            .then(response => {
                const sessionData = response.data.data;
                document.title = sessionData.test.name || 'Làm bài kiểm tra';
                setSession(sessionData);
                if (new Date() > new Date(sessionData.endTime)) {
                    toast.info('Bài thi đã kết thúc');
                    navigate(`${ROUTER_PAGE.TEST.INDEX}/${sessionData.testId}`);
                };
                setTimeLeft(Number.parseInt((new Date(sessionData.endTime).getTime() - new Date().getTime()) / (1000)));
                let index = 0;
                sessionData.groups = sessionData.groups.map(group => {
                    return {
                        ...group,
                        questions: group.questions.map(question => {
                            return {
                                ...question,
                                num: index++
                            }
                        })
                    }
                })
                setGroups(sessionData.groups)
                setCurrent(sessionData.groups[0])

            })
            .catch(() => { })
        getAllChangeLatestBySession(sessionId)
            .then(response => {
                const obj = {};
                response.data.data.forEach(change => {
                    obj[change.questionId] = { saved: true, answers: change.lstAnswerId }
                })
                console.log(obj)
                setLstSelected(obj)
            })
            .catch(() => { })
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (Object.keys(session)?.length > 0) {
                clearInterval(timer);
                toast.info('Bài thi đã kết thúc');
                try {
                    submit(sessionId);
                } catch { }
                navigate(`${ROUTER_PAGE.TEST.INDEX}/${session.testId}`);
                return;
            }
        }
        const timer = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft])

    const handlerSubmit = () => {
        saveChanges();
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertComp title={'Xác nhận'}
                    onClose={onClose}
                    label={'Bạn có chắc muốn nộp bài?'}
                    onAccept={() => {
                        submit(sessionId)
                            .then(_ => {
                                toast.success('Nộp bài thành công');
                                navigate(`${ROUTER_PAGE.TEST.INDEX}/${session.testId}`);
                            })
                            .catch(() => { })
                    }}
                />
            }
        });
    }
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');

        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r p-4 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                    <h2 className="font-bold text-purple-600 text-lg">
                        Bài kiểm tra
                    </h2>

                    <div className="text-center bg-purple-50 rounded-lg p-2 flex flex-row items-center justify-around">
                        <span>⏱</span>
                        <span className="flex flex-col">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {
                            groups
                                ?.flatMap(g =>
                                    g.questions.map(q => ({
                                        group: g,
                                        question: q
                                    }))
                                )
                                .map((item, idx) => (
                                    <button
                                        key={item.question.id}
                                        onClick={() => setCurrent(item.group)}
                                        className={`h-9 rounded text-sm font-medium
                                ${current?.id === item.group.id
                                                ? "bg-purple-500 text-white"
                                                : answers[item.question.id]
                                                    ? "bg-purple-100 text-purple-600"
                                                    : "bg-gray-100"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))
                        }
                    </div>
                </div>

                <button
                    onClick={handlerSubmit}
                    className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                    Nộp bài
                </button>
            </div>

            {/* Main */}
            <div className="w-full p-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="">
                        {current?.contents?.length > 0 && <div className="space-x-2 space-y-2 w-full flex flex-row flex-wrap justify-center mb-4">
                            {current?.contents?.map((content, i1) => content.type === CONTENT_TYPE.TEXT ?
                                <pre key={i1} className="w-full" >{content.content}</pre> :
                                <img key={i1} className="w-40 hover:cursor-zoom-in" src={content.photo} alt="" onClick={() => setImgPreview(content.photo)} />)}
                        </div>}
                        <div className="space-y-4">
                            {current?.questions?.map((question, idx) => {
                                return <div className="w-full bg-gray-50 rounded border border-gray-200" key={idx}>
                                    <div className="p-2 w-full">
                                        <p className="font-semibold">Câu hỏi {question.num + 1}</p>
                                    </div>
                                    <hr></hr>
                                    <div className="p-2">
                                        {Object.keys(question.contents)?.length > 0 && <div className="w-full flex justify-center flex-wrap space-x-2 space-y-2 mb-2">
                                            {question.contents.map((content, key) => content.type === CONTENT_TYPE.TEXT ?
                                                <pre key={key} className="w-full" >{content.content}</pre> :
                                                <img key={key} className="w-40 hover:cursor-zoom-in" src={content.photo} alt="" onClick={() => setImgPreview(content.photo)} />)}
                                        </div>}
                                        <div className=''>
                                            {question.answers.map((answer, key1) => {
                                                const content = answer.contents[0].content;
                                                return <div key={key1} className="mb-2">
                                                    <input
                                                        checked={question.type === KEY.QUESTION_TYPE.CHOICE ?
                                                            lstSelected[question.id]?.answers[0] === answer.id :
                                                            lstSelected[question.id]?.answers?.includes(answer.id)}
                                                        onChange={() => {
                                                            setLstSelected(prev => {
                                                                const answersSelected = prev[question.id]?.answers;
                                                                if (question.type === KEY.QUESTION_TYPE.CHOICE) {
                                                                    if (answersSelected?.length > 0 && answersSelected[0] === answer.id)
                                                                        return { ...prev };
                                                                    else
                                                                        return { ...prev, [question.id]: { answers: [answer.id], saved: false } }
                                                                } else {
                                                                    if (answersSelected?.includes(answer.id))
                                                                        return { ...prev, [question.id]: { answers: [...(answersSelected?.filter(item => item !== answer.id) || [])], saved: false } };
                                                                    else
                                                                        return { ...prev, [question.id]: { answers: [...(answersSelected || []), answer.id], saved: false } }
                                                                }
                                                            })
                                                        }}
                                                        type={question.type === KEY.QUESTION_TYPE.CHOICE ? "radio" : "checkbox"} name={`question-${question.id}`} id={`answer-${answer.id}`} />
                                                    <label className="ms-2" htmlFor={`answer-${answer.id}`}>{content}</label>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                        <button
                            disabled={current?.id === groups[0]?.id}
                            onClick={() => setCurrent(prev => {
                                const newId = groups.findIndex(item => item.id === prev?.id) - 1;
                                return groups[newId] ?? groups[0];
                            })}
                            className="px-4 py-2 rounded border disabled:opacity-50"
                        >
                            ← Câu trước
                        </button>

                        <button
                            disabled={current?.id === groups[groups.length - 1]?.id}
                            onClick={() => setCurrent(prev => {
                                const newId = groups.findIndex(item => item.id === prev?.id) + 1;
                                return groups[newId] ?? groups[groups.length - 1];
                            })
                            }
                            className="px-4 py-2 rounded bg-purple-500 text-white disabled:opacity-50"
                        >
                            Câu tiếp →
                        </button>
                    </div>
                </div>
            </div>
            {imgPreview && <div className="fixed inset-0 bg-black/20 p-2 flex justify-center items-center" onClick={() => setImgPreview('')}>
                <img className="w-auto h-auto max-w-[80%] max-h-[80%]" src={imgPreview} alt="" onClick={e => e.stopPropagation()} />
            </div>}
            {isOpenPopup && <Popup onClose={() => { setIsOpenPopup(false); setContentPopup(<></>) }} Content={contentPopup} />}
        </div>
    );
}
