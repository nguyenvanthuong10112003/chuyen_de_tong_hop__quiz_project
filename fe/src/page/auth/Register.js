import React, { useEffect, useState } from 'react';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { register } from '../../service/AuthService';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { getToken, loginAfter } from '../../helper/Util';
import { ROUTER_PAGE } from '../../common/Const';
import { KEY } from '../../common/Const';
function Register() {
  document.title = 'Đăng ký'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate(); // Hook dùng để điều hướng trang
  useEffect(() => {
    const checkToken = async () => {
      if (getToken()) {
        navigate('/'); 
      }
    };

    checkToken();
  }, [navigate]);
  // Hàm validate để kiểm tra dữ liệu đầu vào
  const validateInputs = (inputs) => {
    const errors = {};
    for (const [key, value] of Object.entries(inputs)) {
      if (!value.trim()) {
        errors[key] = `${key === 'nickname' ? 'Nick name' : key === 'username' ? 'Tên tài khoản' : key === 'password' ? 'Mật khẩu' : 'Trường này'} không được để trống`;
      }
    }
    return errors;
  };

  // Hàm xử lý khi người dùng nhấn đăng ký
  const handledangki = (e) => {
    e.preventDefault();
    setErrorMessages({});
    const nickname = e.target.nickname.value.trim();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    // Validate dữ liệu đầu vào
    setErrorMessages({});
    const errors = validateInputs({ nickname, username, password });
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    // Gọi API đăng ký tài khoản
    register(username, password, nickname)
      .then(response => {
        var data = response.data.data;
        loginAfter(data.token, data.user.id, data.user.displayName);
        toast.success('Đăng ký thành công');
        navigate('/');
      })
      .catch(error => {
        console.log(error);
        toast.error(error?.response?.data?.message ?? 'Đăng ký thất bại')
      })

    // toast.error('Password phải lớn hơn 8 kí tự', {
    //   position: 'top-right',
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    // });
  };

  return (
    <div className="min-h-screen bg-purple-900 flex flex-col items-center justify-center">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-8 lg:px-80 py-4 text-white fixed top-0 bg-purple-900">
        <h1 className="text-xl font-bold">Quiz</h1>
        <div className="flex space-x-4">
          <Link to={ROUTER_PAGE.AUTH.LOGIN} className="bg-white text-purple-900 py-1 px-4 rounded font-semibold">Đăng nhập</Link>
        </div>
      </header>
      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto lg:max-w-4xl lg:flex">
        {/* Form Section */}
        <div className="lg:w-1/2 lg:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chào mừng tới Quiz</h2>

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handledangki} autoComplete='off'>
            <div>
              <label className="block text-gray-700">Tên đầy đủ</label>
              <input
                name="nickname"
                type="text"
                placeholder="Nhập biệt hiệu..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {/* Hiển thị lỗi cho trường Nick name */}
              {errorMessages.nickname && (
                <p className="text-red-500 text-sm">{errorMessages.nickname}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Tên đăng nhập</label>
              <input
                name="username"
                type="text"
                placeholder="Nhập tên đăng nhập..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {/* Hiển thị lỗi cho trường Username */}
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
              {/* Hiển thị icon eye để hiển thị/ẩn mật khẩu */}
              <span
                className="absolute top-10 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {/* Hiển thị lỗi cho trường Password */}
              {errorMessages.password && (
                <p className="text-red-500 text-sm">{errorMessages.password}</p>
              )}
            </div>

            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Đăng ký
            </button>
          </form>

          <p className="text-center mt-2">
            Đã có tài khoản? <Link to={ROUTER_PAGE.AUTH.LOGIN} className="text-purple-600 font-semibold">Đăng nhập</Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2 lg:relative">
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

export default Register;
