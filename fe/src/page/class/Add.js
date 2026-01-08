import { ClassAddOrEdit } from "../../component/ClassAddOrEdit";

export const ClassAdd = () => {
    document.title = "Thêm lớp học";
    return <ClassAddOrEdit action={'add'} />
}
