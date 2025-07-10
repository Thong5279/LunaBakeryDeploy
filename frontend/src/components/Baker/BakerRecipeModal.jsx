import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBakerRecipeDetails, clearSelectedRecipe } from '../../redux/slices/bakerRecipeSlice';
import { 
  FaTimes, 
  FaClock, 
  FaUtensils, 
  FaUsers, 
  FaBook,
  FaListOl,
  FaCheckCircle,
  FaEye,
  FaPrint
} from 'react-icons/fa';
import { toast } from 'sonner';

const BakerRecipeModal = ({ recipeId, onClose }) => {
  const dispatch = useDispatch();
  const { selectedRecipe, detailsLoading, error } = useSelector(state => state.bakerRecipes);
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchBakerRecipeDetails(recipeId));
    }
    
    return () => {
      dispatch(clearSelectedRecipe());
    };
  }, [dispatch, recipeId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handlePrint = () => {
    const printContent = document.getElementById('recipe-print-content');
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Công thức: ${selectedRecipe?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .recipe-header { border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-bottom: 20px; }
            .recipe-title { color: #ec4899; font-size: 24px; font-weight: bold; }
            .recipe-meta { display: flex; gap: 20px; margin: 10px 0; }
            .recipe-section { margin: 20px 0; }
            .recipe-section h3 { color: #ec4899; border-bottom: 1px solid #ec4899; padding-bottom: 5px; }
            .ingredient-item { margin: 5px 0; }
            .instruction-step { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .step-number { font-weight: bold; color: #ec4899; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dễ':
        return 'text-green-600 bg-green-100';
      case 'Trung bình':
        return 'text-yellow-600 bg-yellow-100';
      case 'Khó':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0 phút';
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} giờ`;
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    return instructions.split('\n').filter(step => step.trim() !== '');
  };

  if (detailsLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-lg">Đang tải công thức...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedRecipe) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-pink-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBook className="text-2xl" />
            <div>
              <h2 className="text-xl font-bold">{selectedRecipe.name}</h2>
              <p className="text-pink-100">Công thức làm bánh chi tiết</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg/30 rounded-lg transition-colors"
            >
              <FaPrint />
              <span>In</span>
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(90vh-80px)]">
          {/* Recipe Image */}
          <div className="w-1/3 bg-gray-100">
            {selectedRecipe.image?.url ? (
              <img
                src={selectedRecipe.image.url}
                alt={selectedRecipe.image.altText || selectedRecipe.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaUtensils className="text-6xl" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Recipe Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-pink-500 mb-1">
                    <FaClock className="mr-1" />
                  </div>
                  <p className="text-sm text-gray-600">Chuẩn bị</p>
                  <p className="font-semibold">-</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-pink-500 mb-1">
                    <FaClock className="mr-1" />
                  </div>
                  <p className="text-sm text-gray-600">Nướng</p>
                  <p className="font-semibold">{formatTime(selectedRecipe.cookingTime)}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-pink-500 mb-1">
                    <FaUsers className="mr-1" />
                  </div>
                  <p className="text-sm text-gray-600">Số lượng</p>
                  <p className="font-semibold">{selectedRecipe.servings || 0} cái</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-pink-500 mb-1">
                    <FaEye className="mr-1" />
                  </div>
                  <p className="text-sm text-gray-600">Lượt xem</p>
                  <p className="font-semibold">{selectedRecipe.views || 0}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                  {selectedRecipe.difficulty}
                </span>
                {/* Ẩn tag */}
                {/*
                {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                  <>
                    {selectedRecipe.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </>
                )}
                */}
              </div>

              {selectedRecipe.description && (
                <p className="text-gray-600 mt-4">{selectedRecipe.description}</p>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'ingredients'
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Nguyên liệu
                </button>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'instructions'
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Cách làm
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'ingredients' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUtensils className="mr-2 text-pink-500" />
                    Nguyên liệu cần thiết
                  </h3>
                  
                  {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                    <div className="space-y-3">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">{ingredient.name}</span>
                          </div>
                          <div className="text-pink-600 font-semibold">
                            {ingredient.quantity} {ingredient.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Chưa có thông tin nguyên liệu
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'instructions' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaListOl className="mr-2 text-pink-500" />
                    Hướng dẫn thực hiện
                  </h3>
                  
                  {selectedRecipe.instructions ? (
                    <div className="space-y-4">
                      {formatInstructions(selectedRecipe.instructions).map((step, index) => (
                        <div 
                          key={index}
                          className="flex space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 leading-relaxed">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Chưa có hướng dẫn thực hiện
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  {selectedRecipe.createdBy && (
                    <span>Tạo bởi: {selectedRecipe.createdBy.name}</span>
                  )}
                  <span>Cập nhật: {new Date(selectedRecipe.updatedAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center space-x-2 text-pink-600">
                  <FaCheckCircle />
                  <span>Công thức đã được phê duyệt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Print Content */}
        <div id="recipe-print-content" className="hidden">
          <div className="recipe-header">
            <div className="recipe-title">{selectedRecipe.name}</div>
            <div className="recipe-meta">
              
              <span>Độ khó: {selectedRecipe.difficulty}</span>
                              <span>Chỉ cần thời gian làm bánh</span>
              <span>Thời gian nướng: {formatTime(selectedRecipe.cookingTime)}</span>
              <span>Phục vụ: {selectedRecipe.servings} người</span>
            </div>
            {selectedRecipe.description && <p>{selectedRecipe.description}</p>}
          </div>

          <div className="recipe-section">
            <h3>Nguyên liệu</h3>
            {selectedRecipe.ingredients?.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                • {ingredient.name}: {ingredient.quantity} {ingredient.unit}
              </div>
            ))}
          </div>

          <div className="recipe-section">
            <h3>Cách làm</h3>
            {formatInstructions(selectedRecipe.instructions).map((step, index) => (
              <div key={index} className="instruction-step">
                <span className="step-number">Bước {index + 1}:</span> {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakerRecipeModal; 