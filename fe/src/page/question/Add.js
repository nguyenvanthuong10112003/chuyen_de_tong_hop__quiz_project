import { QuestionAddOrEdit } from "../../component/QuestionAddOrEdit";

export const QuestionAdd = () => {
    document.title = "Thêm câu hỏi";
    return <QuestionAddOrEdit action={'add'} />
}