import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../service/AuthService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getToken, loginAfter } from '../../helper/Util';
import { toast } from "react-toastify";
import { KEY } from '../../common/Const';
function Login() {
  document.title = 'Đăng nhập';
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      if (getToken()) {
        navigate('/');
      }
    };

    checkToken();
  }, [navigate]);
  const validateInputs = (inputs) => {
    const errors = {};
    for (const [key, value] of Object.entries(inputs)) {
      if (!value.trim()) {
        errors[key] = `${key === 'username' ? 'Tên tài khoản' : key === 'password' ? 'Mật khẩu' : 'Trường này'} không được để trống`;
      }
    }
    return errors;
  };


  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    setErrorMessages({});
    const errors = validateInputs({ username, password });
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    login(username, password)
      .then(response => {
        var data = response.data.data;
        loginAfter(data.token, data.user.id, data.user.displayName);
        toast.success('Đăng nhập thành công');
        navigate('/');
      })
      .catch(error => {
        console.log(error);
        toast.error(error?.response?.data?.message ?? 'Đăng nhập thất bại')
      })
  };

  return (
    <div className="min-h-screen bg-purple-900 flex flex-col items-center justify-center">
      <header className="w-full flex justify-between items-center px-8 lg:px-80 py-4 text-white fixed top-0 bg-purple-900">
        <h1 className="text-xl font-bold">Quiz</h1>
        <div className="flex space-x-4">
          <Link to="/auth/register" className="bg-white text-purple-900 py-1 px-4 rounded font-semibold">Đăng ký</Link>
        </div>
      </header>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto lg:max-w-4xl lg:flex">
        <div className="lg:w-1/2 lg:p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Đăng nhập vào Quiz</h2>
          <form className="space-y-4" onSubmit={handleLogin} autoComplete='off'>
            <div>
              <label className="block text-gray-700">Tên đăng nhập</label>
              <input
                name="username"
                type="text"
                placeholder="Nhập tên đăng nhập..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {errorMessages.username && (
                <p className="text-red-500 text-sm">{errorMessages.username}</p>
              )}
            </div>
            <div className="relative">
              <label className="block text-gray-700">Mật khẩu</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <span
                className="absolute top-10 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errorMessages.password && (
                <p className="text-red-500 text-sm">{errorMessages.password}</p>
              )}
            </div>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Đăng Nhập
            </button>
          </form>

        </div><div className="hidden lg:block lg:w-1/2 lg:relative">
          <img
            src="/image/modern-design-icon-online-test_362714-3351.avif"
            alt="Welcome"
            className="rounded-r-lg h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
