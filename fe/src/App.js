import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './page/auth/Login';
import Home from './page/Home';
import ProtectedRoute from './ProtectedRoute';
import { KEY, ROUTER_PAGE } from './common/Const';
import Register from './page/auth/Register';
import { Page404 } from './page/error/404';
import { toast, ToastContainer } from 'react-toastify';
import { Loading } from './component/Loading';
import { useEffect, useState } from 'react';
import { loadingStore } from './store/LoadingStore';
import { Class } from './page/class/Class';
import { Layout } from './layout/Layout';
import { ClassAdd } from './page/class/Add';
import { ClassEdit } from './page/class/Edit';
import { ClassDetail } from './page/class/Detail';
import { Question } from './page/question/Index';
import { QuestionAdd } from './page/question/Add';
import { QuestionEdit } from './page/question/Edit';
import { TestAdd } from './page/test/Add';
import { TestEdit } from './page/test/Edit';
import { TestIndex } from './page/test/Index';
import { TestSession } from './page/test/Session';

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadingStore.register(setLoading);
    const toastMessage = localStorage.getItem(KEY.LOCAL_STORAGE.MESSAGE);
    if (toastMessage) {
      const toastObj = JSON.parse(toastMessage);
      toast(toastObj.message, {type: toastObj.type});
      localStorage.removeItem(KEY.LOCAL_STORAGE.MESSAGE);
    }
  })
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Các route không cần xác thực */}
          <Route path={ROUTER_PAGE.AUTH.REGISTER} element={<Register />} />
          <Route path={ROUTER_PAGE.AUTH.LOGIN} element={<Login />} />

          {/* Các route cần xác thực */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path={ROUTER_PAGE.CLASS.INDEX} element={<Class />} />
              <Route path={ROUTER_PAGE.CLASS.ADD} element={<ClassAdd />} />
              <Route path={ROUTER_PAGE.CLASS.EDIT} element={<ClassEdit />} />
              <Route path={ROUTER_PAGE.CLASS.DETAIL} element={<ClassDetail />} />
              <Route path={ROUTER_PAGE.QUESTION.INDEX} element={<Question />} />
              <Route path={ROUTER_PAGE.QUESTION.ADD} element={<QuestionAdd />} />
              <Route path={ROUTER_PAGE.QUESTION.EDIT} element={<QuestionEdit />} />
            </Route>
            <Route path={ROUTER_PAGE.TEST.ADD} element={<TestAdd />} />
            <Route path={ROUTER_PAGE.TEST.EDIT} element={<TestEdit />} />
            <Route path={ROUTER_PAGE.TEST.VIEW} element={<TestIndex />} />
            <Route path={`${ROUTER_PAGE.TEST.INDEX}/session/:id`} element={<TestSession />} />
          </Route>

          <Route path='*' element={<Page404 />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
      <Loading loading={loading} />
    </>
  );
}

export default App;
