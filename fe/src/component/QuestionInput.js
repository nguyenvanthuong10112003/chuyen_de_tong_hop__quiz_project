import { KEY } from "../common/Const";
import { ImagesInput } from "./ImagesInput";

export const QuestionInput = ({ question, setQuestion, useDel, canDel, fnDel, number }) => {
    const addAnswer = () => {
        let answers = question.answers ?? [];
        answers = [...answers, { key: answers.length }];
        setQuestion({ ...question, answers: answers })
    }
    const delAnswer = (index) => {
        let answers = question.answers ?? [];
        if (answers.length <= 2) return;
        answers = answers.filter((_, i) => i !== index)
        setQuestion({ ...question, answers: answers })
    }
    const canDelAnswer = () => {
        return question?.answers?.length > 2;
    }
    const handlerInputAnswer = (e, index) => {
        let answers = question.answers ?? [];
        try {
            answers[index].content = e.target.value;
            setQuestion({ ...question, answers: answers })
        } catch { }
    }
    const handlerSelectAnswer = (e, index) => {
        let answers = question.answers ?? [];
        if (question.type === KEY.QUESTION_TYPE.CHOICE)
            answers.forEach(item => item.isCorrect = false);
        try {
            answers[index].isCorrect = !answers[index].isCorrect ? true : false;
            setQuestion({ ...question, answers: answers })
        } catch { }
    }
    const handlerSelectType = (e) => {
        let answers = question.answers;
        answers.forEach(item => item.isCorrect = false);
        setQuestion({ ...question, type: String(e.target.value), answers: answers })
    }
    return <div className="p-2 border border-gray-200 rounded-sm my-1 relative">
        {useDel && <button disabled={!canDel} onClick={() => { if (fnDel) fnDel(question) }} type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded hover:bg-red-700 hover:text-white font-semibold text-nowrap flex items-center justify-center p-1 disabled:opacity-60 disabled:!bg-red-500">
            <span className="material-icons text-md">close</span>
        </button>}
        <p className="font-semibold">Nhập câu hỏi {number ?? ''}</p>
        <div>
            <label className="block font-medium mb-1">Nội dung câu hỏi (<span className="text-red-500">*</span>)</label>
            <textarea value={question.content} onChange={(e) => { setQuestion({ ...question, 'content': e.target.value }) }}
                className={`w-full my-1 border rounded-lg p-2 px-4 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                placeholder="Nhập nội dung câu hỏi" rows={4}></textarea>
        </div>
        <ImagesInput obj={question} setObj={setQuestion} />
        <div className="">
            <label className="block font-medium my-1">Loại (<span className="text-red-500">*</span>)</label>
            <select
                placeholder="Loại"
                className={`w-full mt-1 border rounded-lg p-2 px-4 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                onChange={(e) => handlerSelectType(e)}
                value={question.type}
            >
                <option value=''>Chọn loại</option>
                {
                    [
                        { key: KEY.QUESTION_TYPE.CHOICE, txt: 'Một đáp án đúng' },
                        { key: KEY.QUESTION_TYPE.MULTI_CHOICE, txt: 'Nhiều đáp án đúng' }
                    ].map((item, index) => <option key={index} value={item.key}>{item.txt}</option>)
                }
            </select>
        </div>
        {
            question.type && <>
                <div className="">
                    <label className="block font-medium my-1">Câu trả lời (<span className="text-red-500">*</span>)</label>
                    <div>
                        {question.answers.map((item, key) => <div key={key} className="flex flex-row space-x-2 items-center">
                            <input type={question.type === KEY.QUESTION_TYPE.CHOICE ? 'radio' : 'checkbox'} onChange={(e) => handlerSelectAnswer(e, key)}
                                checked={item.isCorrect}
                                name="answer"
                            />
                            <input type="text"
                                className={`w-full my-1 border rounded-lg p-2 px-4 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                                placeholder="Nhập câu trả lời"
                                value={item.content ?? ''}
                                onChange={(e) => handlerInputAnswer(e, key)}
                            />
                            <div>
                                <button disabled={!canDelAnswer()} onClick={() => { delAnswer(key) }} type="button" className="bg-red-500 text-white rounded hover:bg-red-700 hover:text-white font-semibold text-nowrap flex items-center justify-center p-1 disabled:opacity-60 disabled:!bg-red-500">
                                    <span className="material-icons text-md">close</span>
                                </button>
                            </div>
                        </div>)}
                        <button onClick={addAnswer} type="button" className="border-purple-500 border text-purple-500 rounded hover:bg-purple-500 hover:text-white font-semibold text-nowrap flex items-center justify-center p-2 mt-1">
                            Thêm câu trả lời
                        </button>
                    </div>
                </div>
            </>
        }
    </div>
}