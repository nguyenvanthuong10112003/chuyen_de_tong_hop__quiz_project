import { useEffect } from "react";
import { ImagesInput } from "./ImagesInput";
import { QuestionInput } from "./QuestionInput";

export const QuestionGroupInput = ({ questionGroup, setQuestionGroup, createNewQuestion }) => {

    const addQuestion = () => {
        const newQuestionGroup = {...questionGroup, questions: [...questionGroup.questions ?? [], {...createNewQuestion(), key: questionGroup.questions?.length ?? 0}]};
        setQuestionGroup(newQuestionGroup)
    }
    const setQuestion = (question) => {
        const length = questionGroup.questions.length;
        if (!(length > 0)) return;
        const index = questionGroup.questions.findIndex(item => item.key === question.key);
        if (index < 0 || index >= length) return; 
        const newQuestionGroup = {...questionGroup};
        newQuestionGroup.questions = [...newQuestionGroup.questions.slice(0, index), question, ...newQuestionGroup.questions.slice(index + 1, length)];
        setQuestionGroup(newQuestionGroup);
    }
    const delQuestion = (question) => {
        if (!(questionGroup.questions?.length > 1)) return;
        const newQuestions = questionGroup.questions.filter(item => item.key !== question.key);
        newQuestions.forEach((item, index) => item.key = index);
        setQuestionGroup({...questionGroup, questions: newQuestions});
    }
    return <div>
        <div>
            <label className="block font-medium mb-1">Tiêu đề nhóm</label>
            <textarea value={questionGroup.content} onChange={(e) => { setQuestionGroup({ ...questionGroup, 'content': e.target.value }) }}
                className={`whitespace-pre-wrap w-full my-1 border rounded-lg p-2 px-4 shadow-sm shadow-gray-50 focus:border-purple-500 border-1 focus:outline-none focus:shadow-purple-300`}
                placeholder="Nhập tiêu đề nhóm" rows={4}></textarea>
        </div>
        <div className="flex flex-row space-x-2 my-1">
            <input type="checkbox" name="canMix" id="canMix" checked={questionGroup.canMix} onChange={(e) => { setQuestionGroup({ ...questionGroup, 'canMix': !questionGroup.canMix ? true : false }) }} />
            <label htmlFor="canMix" className="block font-medium mb-1">Có thể trộn câu hỏi</label>
        </div>
        <ImagesInput obj={questionGroup} setObj={setQuestionGroup} />

        {questionGroup.questions?.length > 0 && <div className="space-y-2">{questionGroup.questions.map((item, index) => 
            <QuestionInput question={item} key={index} number={index + 1} setQuestion={setQuestion} useDel={true} canDel={questionGroup.questions.length > 1} fnDel={delQuestion}/>
        )}</div>}
        <button onClick={addQuestion} type="button" className="flex-initial border-purple-500 border text-purple-500 rounded hover:bg-purple-500 hover:text-white font-semibold text-nowrap items-center justify-center p-2 my-2">
            Thêm câu hỏi
        </button>
    </div>
}