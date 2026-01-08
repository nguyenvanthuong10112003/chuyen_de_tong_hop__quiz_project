import React, { useState } from "react";

const Navbar = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);

	return (
		<div className="fixed w-full flex items-center justify-between bg-purple-100 p-4 z-20">
			{/* Phần trái: Tiêu đề */}
			<div className="flex items-center space-x-5 w-full">
				<span className="text-purple-800 text-xl font-bold">Quiz</span>
			</div>
		</div>
	);
};

export default Navbar;
