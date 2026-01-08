import { TestAddOrEdit } from "../../component/TestAddOrEdit";

export const TestEdit = () => {
    document.title = 'Chỉnh sửa bài kiểm tra';
    return <TestAddOrEdit action='edit' />
}