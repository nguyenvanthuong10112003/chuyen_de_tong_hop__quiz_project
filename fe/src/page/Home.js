import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserId } from '../helper/Util';
import axios from "axios";
import Cardbaikiemtra from "../component/Cardbaikiemtra";
const Home = () => {
	document.title = 'Trang chủ';
	const userId = getUserId();
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Trạng thái Sidebar
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingQuiz, setEditingQuiz] = useState(null); // Trạng thái chỉnh sửa bài kiểm tra
	const [lophoc, setLophoc] = useState([]);  // Khai báo state trong component
	const [className, setClassName] = useState(''); // Lưu tên lớp
	const [imagePreview, setImagePreview] = useState(null); // Lưu ảnh đại diện lớp
	const [imageUrl, setImageUrl] = useState(null);
	const [classid, setclassid] = useState(null);
	const [baikiemtra, setBaikiemtra] = useState([]);
	const [errors, setErrors] = useState({});
	const kiemtratenlopvaanh = async () => {
		const newErrors = {};
		if (!className.trim()) {
			newErrors.className = "không được để tên lớp trống.";
		}
		if (!imagePreview) {
			newErrors.imagePreview = "Hãy chọn hình ảnh đại diện.";
		}
		if (newErrors.className || newErrors.imagePreview) {
			setErrors(newErrors);
			return; // Dừng lại nếu có lỗi
		}
		try {

			const { message, code } = {}
			if (code === 1000) {

				toast.success("sửa lớp thành công", {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});

			}
			else if (code === 1004) {
				toast.error(message, {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		} catch (error) {
			console.error('Sửa thất bại:', error);
			toast.error('Có lỗi xảy ra, vui lòng thử lại!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}

		handleCloseModal();
		getClassByUser1ID();
		resetForm();
	};
	const resetForm = () => {
		setClassName("");
		setImagePreview(null)
	};
	const [loading, setLoading] = useState(false);
	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return; // Nếu không có file, thoát hàm

		try {
			setLoading(true); // Bật trạng thái loading
			// Tải ảnh lên server
			const formData = new FormData();
			formData.append("image", file);
			const response = await axios.post("http://localhost:5000/upload", formData);

			// Lưu link ảnh từ server
			const imageUrl = response.data.link;
			setImageUrl(imageUrl)
			setImagePreview(imageUrl); // Gán link ảnh từ server làm preview (nếu cần)
		} catch (error) {
			console.error("Error uploading image:", error);
			alert("Đã xảy ra lỗi khi tải ảnh lên");
		} finally {
			setLoading(false); // Tắt trạng thái loading
		}
	};
	const handleCloseModal = () => {
		// Đóng modal (cập nhật state hoặc chạy hiệu ứng đóng modal)
		setIsEditModalOpen(false);
		setEditingQuiz(null);

		// Gọi callback sau khi đóng modal xong
	};

	const handleRemoveImage = () => {
		setImagePreview(null);
	};
	const navigate = useNavigate();
	useEffect(() => {

		//handgetbaikiemtra()
	}, []);

	const refest = () => {
		getClassByUser1ID();
	}

	const getClassByUser1ID = async () => {
		try {
			const { result, code } = {}
			if (code === 1000) {
				// Cập nhật dữ liệu lớp học từ API vào state
				setLophoc(result);  // Cập nhật `lophoc` với dữ liệu từ API
			} else {
				// Xử lý khi không có dữ liệu hợp lệ từ API
				console.error("Không có dữ liệu lớp học.");
			}
		} catch (error) {
			console.error("Lỗi khi gọi API:", error);
		}
	}
	const [activeItem, setActiveItem] = useState("home"); // Trạng thái mục được chọn
	const getModalData = () => {
		if (activeItem === "home") {
			return {
				buttonLabel: "Nhập mã",
				modalTitle: "Nhập mã tham gia",
				modalPlaceholder: "Nhập mã tham gia",
				modalButtonText: "Join",
			};
		} else if (activeItem === "class") {
			return {
				buttonLabel: "Tạo lớp học",
				modalTitle: "Tạo lớp học mới",
				modalPlaceholder: "Nhập tên lớp học",
				modalButtonText: "Tạo",
			};
		}
		return {};
	};
	const handleEdit = (quiz) => {
		setEditingQuiz(quiz); // Gán dữ liệu bài kiểm tra vào editingQuiz
		setImagePreview(quiz.imageclass)
		setClassName(quiz.name)
		setclassid(quiz.classid)
		setIsEditModalOpen(true); // Mở modal
	};


	const handleDelete = async (classid) => {
		try {

			const { message, code } = {};
			console.log({ message, code });
			if (code === 1000) {

				toast.success(message, {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});

			}
			else if (code === 1004) {
				toast.error(message, {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		} catch (error) {
			console.error('xóa thất bại:', error);
			toast.error('Có lỗi xảy ra, vui lòng thử lại!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}

	};
	// Khai báo state trong component

	const handgetbaikiemtra = async () => {
		try {

			const { result, code } = {};
			setBaikiemtra(result);

		} catch (error) {
			console.error(' thất bại:', error);
			toast.error('Có lỗi xảy ra, vui lòng thử lại!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}

	};

	const renderContent = () => {
		switch (activeItem) {
			case "home":
				return (

					<div >
						{/* Navbar */}
						<Navbar {...getModalData()} />

						{/* Main Content */}
						<div className="p-4">


						</div>
						{isEditModalOpen && (
							<div className="h-screen flex items-center justify-center bg-black bg-opacity-50 fixed inset-0 z-50">
								<div className="bg-white rounded-lg shadow-lg w-3/4 h-5/6 overflow-hidden">
									<button
										onClick={() => handleCloseModal()} // Đóng modal
										className="absolute top-2 right-2 bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
									>
										✕
									</button>
								</div>
							</div>
						)}
					</div>
				);
			case "class":
				return (
					<div>
						<Navbar {...{ ...getModalData(), ...refest() }} />
						<div className="p-4">

							<div className="grid grid-cols-4 gap-4">
								{lophoc.map((CardClass, index) => (
									<CardClass key={index} {...CardClass}
										onEdit={() => handleEdit(CardClass)} // Truyền hàm sửa
										onDelete={() => handleDelete(CardClass.classid)} // Truyền hàm xóa
									/>

								))}
							</div>
						</div>
						{isEditModalOpen && (
							<>
								{/* Lớp nền tối */}
								<div className="fixed inset-0 bg-black bg-opacity-50 z-[50]"></div>

								{/* Nội dung modal */}
								<div className="fixed inset-0 flex justify-center items-center z-[60]">
									<div className="bg-gradient-to-b from-purple-700 to-purple-900 p-12 rounded-xl relative shadow-lg flex flex-col items-center max-w-xl w-full pointer-events-auto">
										{/* Nút X để đóng modal */}
										<button
											className="absolute top-2 right-2 text-white bg-transparent rounded-full w-8 h-8 flex items-center justify-center hover:text-red-600 hover:scale-110 transition-all duration-200"
											onClick={() => handleCloseModal()}
										>
											✕
										</button>

										<h3 className="text-white text-2xl font-bold mb-6">Sửa lớp</h3>

										{/* Ô nhập liệu tên lớp */}
										<div className="relative flex items-center w-full mb-4">
											<input
												type="text"
												value={className}
												placeholder="Nhập tên lớp"
												className="flex-1 outline-none px-2 py-2 text-gray-600 rounded-l-full border border-r-0"
												onChange={(e) => setClassName(e.target.value)}
											/>

											{/* Nút sửa */}
											<button
												className="bg-purple-600 text-white px-4 py-2 rounded-r-full hover:bg-purple-700"
												onClick={() => kiemtratenlopvaanh()}
											>
												Sửa
											</button>
										</div>
										{errors.className && (
											<p className="text-red-500 text-sm mt-1">{errors.className}</p>
										)}

										{/* Phần hiển thị ảnh */}
										<div className="relative w-full max-w-md mb-4">
											<div
												className={`w-96 h-96 border rounded-lg flex items left-6 justify-center overflow-hidden relative ${imagePreview ? "" : "border-dashed"}`}
											>
												{/* Spinner loading chỉ hiển thị trong khung ảnh */}
												{loading && (
													<div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
														<div className="spinner border-t-4 border-purple-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
													</div>
												)}

												{/* Hiển thị ảnh nếu có */}
												{imagePreview && !loading ? (
													<>
														<img
															src={imagePreview}
															alt="Hình đại diện"
															className="object-cover w-full h-full"
														/>
														{/* Nút xóa ảnh */}
														<button
															onClick={handleRemoveImage}
															className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl rounded-lg opacity-0 hover:opacity-100 transition"
														>
															🗑
														</button>
													</>
												) : !loading ? (
													<label className="cursor-pointer text-gray-500 flex items-center justify-center w-full h-full">
														<span>+ Thêm ảnh</span>
														<input
															type="file"
															accept="image/*"
															onChange={handleImageUpload}
															className="hidden"
														/>
													</label>
												) : null}
											</div>

											{/* Hiển thị lỗi nếu có */}
											{errors.imagePreview && (
												<p className="text-red-500 text-sm mt-1">{errors.imagePreview}</p>
											)}
										</div>

									</div>
								</div>
							</>
						)}
					</div>
				);
			case "logout":
				// replace để kiểm soát việc lưu hoặc thay thế trang hiện tại trong lịch sử trình duyệt.
				return <Navigate to="/dangnhap" replace />;
			case "settings":
				return (
					<div className="p-10">
					</div>
				);
			default:
				return (
					<div className="p-10">
						<h2 className="text-2xl font-bold mb-4">Trang không tồn tại</h2>
					</div>
				);
		}
	};

	return (
		<div className="grid grid-cols-4 gap-4">
			{baikiemtra.map((CardClass, index) => (
				<Cardbaikiemtra
					key={index}
					testid={CardClass.testid}
					name={CardClass.name}
					thoigian={CardClass.thoigian}
					imagetest={CardClass.imagetest}
					link={`/lambaikiemtra?testid=${CardClass.testid}&time=${CardClass.thoigian}`}  // Link đến trang chi tiết bài kiểm tra

				/>
			))}
		</div>
	);
};

export default Home;