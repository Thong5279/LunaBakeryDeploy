import React from "react";
import { FaTimes, FaClock, FaUsers, FaUtensils } from "react-icons/fa";

const RecipeViewModal = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-pink-50">
            <div className="flex items-center gap-3">
              <FaUtensils className="text-pink-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">Chi tiết công thức</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
              <FaTimes size={20} />
            </button>
          </div>
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
            {/* Ảnh */}
            <div className="flex justify-center mb-4">
              {recipe.image?.url ? (
                <img src={recipe.image.url} alt={recipe.image.altText || recipe.name} className="w-64 h-48 object-cover rounded-lg border" />
              ) : (
                <div className="w-64 h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
                  <FaUtensils size={48} />
                </div>
              )}
            </div>
            {/* Thông tin cơ bản */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.name}</h3>
              <p className="text-gray-600 mb-2">{recipe.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-2">
                <span className="flex items-center gap-1"><FaClock /> {recipe.cookingTime} phút</span>
                <span className="flex items-center gap-1"><FaUsers /> {recipe.servings} phần</span>
                <span className="flex items-center gap-1">Độ khó: <span className="font-medium">{recipe.difficulty}</span></span>
                <span className="flex items-center gap-1">Trạng thái: <span className="font-medium">{recipe.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}</span></span>
                <span className="flex items-center gap-1">{recipe.isPublished ? 'Đã công khai' : 'Chưa công khai'}</span>
              </div>
            </div>
            {/* Nguyên liệu */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Nguyên liệu</h4>
              <ul className="list-disc pl-6 text-gray-700">
                {recipe.ingredients?.map((ing, idx) => (
                  <li key={idx}>{ing.name} - {ing.quantity} {ing.unit}</li>
                ))}
              </ul>
            </div>
            {/* Hướng dẫn */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Hướng dẫn làm bánh</h4>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
                {recipe.instructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeViewModal; 