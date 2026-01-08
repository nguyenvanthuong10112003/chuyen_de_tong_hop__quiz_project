import { Navigate, Outlet } from "react-router-dom";
import  { getToken } from './helper/Util';
import { ROUTER_PAGE } from "./common/Const";

const ProtectedRoute = () => {
  return getToken()
    ? <Outlet />
    : <Navigate to={ROUTER_PAGE.AUTH.LOGIN} replace />;
};

export default ProtectedRoute;