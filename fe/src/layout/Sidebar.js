import { logout } from "../service/AuthService";
import { useNavigate } from "react-router-dom";
import { KEY, ROUTER_PAGE } from "../common/Const";
import { logoutAfter } from "../helper/Util";
import React from "react";
const Sidebar = React.memo(({ isExpanded, toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
      logout().finally(() => {
        logoutAfter();
        navigate(ROUTER_PAGE.AUTH.LOGIN);
      })
  };
  const pathNameSplit = document.location.pathname.split('/');
  const controllerName = '/' + (pathNameSplit[1].trim().length > 0 ? pathNameSplit[1].trim() : 'home');
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-purple-50 shadow-lg ${isExpanded ? "w-64" : "w-16"
        } transition-all duration-300 flex flex-col`}
      onMouseEnter={() => toggleSidebar(true)}
      onMouseLeave={() => toggleSidebar(false)}
    >
      {/* Logo */}
      <div className="my-4 flex justify-center">
        <img src="/image/logo.jpg" alt="Logo" className="w-12 h-12" />
      </div>

      {/* Các nút danh mục */}
      <div className="flex flex-col w-full space-y-2">
        <button
          className={`w-full flex items-center p-3 rounded-md ${controllerName === ROUTER_PAGE.HOME.INDEX
            ? "bg-purple-200 text-purple-800 font-bold"
            : "hover:bg-purple-100 text-purple-700"
            }`}
          onClick={() => { if (controllerName !== ROUTER_PAGE.HOME.INDEX) navigate(ROUTER_PAGE.HOME.INDEX) }}
        >
          <div
            className={`flex items-center ${isExpanded ? "justify-start pl-6" : "justify-center"
              } w-full`}
          >
            <span className="material-icons">home</span>
            <span
              className={`ml-2 text-sm ${isExpanded ? "inline-block" : "hidden"}`}
            >
              Trang chủ
            </span>
          </div>
        </button>

        <button
          className={`!outline-none w-full flex items-center p-3 rounded-md ${controllerName === ROUTER_PAGE.CLASS.INDEX
            ? "bg-purple-200 text-purple-800 font-bold"
            : "hover:bg-purple-100 text-purple-700"
            }`}
          onClick={() => { if (controllerName !== ROUTER_PAGE.CLASS.INDEX) navigate(ROUTER_PAGE.CLASS.INDEX) }}
        >
          <div
            className={`flex items-center ${isExpanded ? "justify-start pl-6" : "justify-center"
              } w-full`}
          >
            <span className="material-icons">class</span>
            <span
              className={`ml-2 text-sm ${isExpanded ? "inline-block" : "hidden"}`}
            >
              Lớp học
            </span>
          </div>
        </button>

        <button
          className={`!outline-none w-full flex items-center p-3 rounded-md ${controllerName === ROUTER_PAGE.QUESTION.INDEX
            ? "bg-purple-200 text-purple-800 font-bold"
            : "hover:bg-purple-100 text-purple-700"
            }`}
          onClick={() => { if (controllerName !== ROUTER_PAGE.QUESTION.INDEX) navigate(ROUTER_PAGE.QUESTION.INDEX) }}
        >
          <div
            className={`flex items-center ${isExpanded ? "justify-start pl-6" : "justify-center"
              } w-full`}
          >
            <span className="material-icons">subject</span>
            <span
              className={`ml-2 text-sm ${isExpanded ? "inline-block" : "hidden"}`}
            >
              Ngân hàng câu hỏi
            </span>
          </div>
        </button>

        <button
          className={`!outline-none w-full flex items-center p-3 rounded-md hover:bg-purple-100 text-purple-700`}
          onClick={() => { }}
        >
          <div
            className={`flex items-center ${isExpanded ? "justify-start pl-6" : "justify-center"
              } w-full`}
          >
            <span className="material-icons">settings</span>
            <span
              className={`ml-2 text-sm ${isExpanded ? "inline-block" : "hidden"}`}
            >
              Cài đặt
            </span>
          </div>
        </button>

        <button
          className={`!outline-none w-full flex items-center p-3 rounded-md hover:bg-purple-100 text-purple-700`}
          onClick={handleLogout}
        >
          <div
            className={`flex items-center ${isExpanded ? "justify-start pl-6" : "justify-center"
              } w-full`}
          >
            <span className="material-icons">logout</span>
            <span
              className={`ml-2 text-sm ${isExpanded ? "inline-block" : "hidden"}`}
            >
              Đăng xuất
            </span>
          </div>
        </button>
      </div>
    </div>
  );
});

export default Sidebar;
