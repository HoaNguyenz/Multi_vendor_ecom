import React from 'react';
import { Button } from "@mui/material";

const CancelReasonPopup = ({ open, onClose, reason }) => {
  if (!open) return null; // Nếu popup không mở thì không render

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
        <h3 className="text-xl font-semibold mb-4">Lý do hủy</h3>
        <p className="text-gray-700 mb-4">{reason}</p>
        
        {/* Nút Đóng ở góc phải */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default CancelReasonPopup;
