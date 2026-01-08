import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Cardbaikiemtra = ({testid, name, thoigian, imagetest,role, link,onEdit, onDelete}) => {
	

  return (
    
	<div className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300" id = {testid} >
	{/* Ảnh và tiêu đề có liên kết */}
	<Link to={link}>
	  <img src={imagetest} alt={name} className="w-full h-48 object-cover" />
	</Link>
	<div className="p-4">
	  <Link to={link}>
		<h3 className="text-lg font-bold mb-2">{name}</h3>
	  </Link>
	  <p className="text-gray-600">Thời gian làm bài: {thoigian} phút</p>
	</div>

	   {/* Kiểm tra nếu role là "teacher" */}
	   {role === 'TEACHER' && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          {/* Icon sửa */}
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-600"
          >
            <span className="material-icons">edit</span>
          </button>
          {/* Icon xóa */}
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
          >
            <span className="material-icons">delete</span>
          </button>
        </div>
      )}
  </div>
);

};

export default Cardbaikiemtra;
