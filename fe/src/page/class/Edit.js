import { ClassAddOrEdit } from "../../component/ClassAddOrEdit";

export const ClassEdit = () => {
    document.title = "Cập nhật thông tin lớp học";
    return <ClassAddOrEdit action={'edit'} />
}