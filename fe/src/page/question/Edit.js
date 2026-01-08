import { QuestionAddOrEdit } from "../../component/QuestionAddOrEdit";

export const QuestionEdit = () => {
    document.title = 'Sửa câu hỏi';
    return <QuestionAddOrEdit action={'edit'} />
}