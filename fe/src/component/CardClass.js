import { Link, useNavigate } from 'react-router-dom';
import { FaShareAlt } from 'react-icons/fa';
import { getUserId } from '../helper/Util';
import { KEY, ROUTER_PAGE } from '../common/Const';

const CardClass = ({ classObj, handlerShare, handlerDelete }) => {
  const userId = getUserId();
  const navigate = useNavigate();
  return (
    <div className='min-w-[300px] max-w-[300px] h-full'>
      <div className="w-full relative bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300">
        {/* Ảnh và tiêu đề có liên kết */}
        <Link to={`${ROUTER_PAGE.CLASS.INDEX}/${classObj.id}`}>
          <img src={classObj.photo ?? '/image/class_default.jpg'} alt={classObj.name} className="w-full h-48 object-cover" />
        </Link>
        <div className="p-4 h-full">
          <Link to={`${ROUTER_PAGE.CLASS.INDEX}/${classObj.id}`}>
            <h3 className="text-lg font-bold mb-2">{classObj.name}</h3>
          </Link>
          <p className="text-gray-600">{classObj.studentCount} thành viên </p>
          {classObj.owner.id === userId && <span className='text-blue-400 size-1'>{classObj.isPrivate === true ? 'Riêng tư' : 'Công khai'}</span>}
        </div>

        {classObj.owner.id === userId && (
          <div className="absolute bottom-2 right-2 flex items-center flex-row space-x-2">
            {/* Icon sửa */}
            <button
              onClick={() => {
                navigate(`${ROUTER_PAGE.CLASS.EDIT}?id=${classObj.id}`)
              }}
              className="text-blue-500 hover:text-blue-600 flex flex-row items-center"
            >
              <span className="material-icons">edit</span>
            </button>
            {/* Icon xóa */}
            <button
              onClick={handlerDelete}
              className="text-red-500 hover:text-red-600 flex flex-row items-center"
            >
              <span className="material-icons">delete</span>
            </button>
            <button onClick={handlerShare} className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded">
              <FaShareAlt />
            </button>
          </div>
        )}
      </div>
    </div>
  );

};

export default CardClass;
