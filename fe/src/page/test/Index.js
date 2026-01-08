import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSession, getById } from "../../service/TestService";
import { ROUTER_PAGE } from "../../common/Const";

export const TestIndex = ({ }) => {
    const params = useParams();
    const id = params.id;
    const [testObj, setTestObj] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        getById(id)
            .then(response => {
                document.title = response.data.data.name
                if (response.data.data.sessionId) 
                    navigate(`${ROUTER_PAGE.TEST.INDEX}/session/${response.data.data.sessionId}`)
                setTestObj(response.data.data)
            })
            .catch(() => {})
    }, [])
    const now = new Date();
    const handlerJoinSession = () => {
        createSession(id)
            .then(response => {
                const sessionId = response.data.data.id;
                if (sessionId)
                    navigate(`${ROUTER_PAGE.TEST.INDEX}/session/${sessionId}`)
            })
            .catch(() => {})
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-6">
            {Object.keys(testObj)?.length > 0 ? <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-purple-200 p-8 space-y-6">

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-purple-600">
                        {testObj.name}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Trang xem trước bài kiểm tra
                    </p>
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                        <span className="text-purple-500 text-xl">⏱</span>
                        <div>
                            <p className="text-sm text-gray-500">Thời gian</p>
                            <p className="font-semibold">{testObj.time} phút</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                        <span className="text-purple-500 text-xl">📄</span>
                        <div>
                            <p className="text-sm text-gray-500">Số câu</p>
                            <p className="font-semibold">{testObj.countQuestion} câu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                        <span className="text-purple-500 text-xl">✅</span>
                        <div>
                            <p className="text-sm text-gray-500">Hình thức</p>
                            <p className="font-semibold">Trắc nghiệm</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h2 className="font-semibold text-purple-500 mb-1">Mô tả</h2>
                    <p className="text-gray-700">
                        {testObj.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                        onClick={() => navigate(`${ROUTER_PAGE.CLASS.INDEX}/${testObj.classId}`)}
                    >
                        Quay lại
                    </button>

                    <button
                        className="px-5 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition disabled:!bg-gray-300"
                        onClick={handlerJoinSession}
                        disabled={new Date(testObj.startTime) > now || new Date(testObj.endTime) < now}
                    >
                        {new Date(testObj.startTime) > now ? 'Chưa đến giờ làm bài' : (new Date(testObj.endTime) < now ? 'Bài kiểm tra đã hết hạn' : 'Bắt đầu làm bài')}
                    </button>
                </div>

            </div> : <p>Bài kiểm tra không tồn tại</p>}
        </div>
    );
}