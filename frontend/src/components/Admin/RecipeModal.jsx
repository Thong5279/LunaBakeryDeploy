import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTimes,
  FaPlus,
  FaTrash,
  FaUpload,
  FaImage,
  FaClock,
  FaUsers,
  FaUtensils,
  FaSave,
  FaSpinner
} from "react-icons/fa";
import {
  createRecipe,
  updateRecipe,
  clearError,
} from "../../redux/slices/adminRecipeSlice";
import {
  RECIPE_DIFFICULTIES,
  INGREDIENT_UNITS,
  TIME_OPTIONS,
  SERVING_OPTIONS,
} from "../../constants/recipeConstants";

const RecipeModal = ({ isOpen, onClose, recipe = null }) => {
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.adminRecipes);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    image: {
      url: "",
      altText: "",
    },
    difficulty: "Trung bình",
    cookingTime: 30,
    servings: 4,
    ingredients: [{ name: "", quantity: "", unit: "g" }],
    status: "active",
    isPublished: false,
    category: "Khác", // Set default category
    preparationTime: 30, // Set default preparationTime
  });

  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  // Initialize form data when recipe changes
  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name || "",
        description: recipe.description || "",
        instructions: recipe.instructions || "",
        image: recipe.image || { url: "", altText: "" },
        difficulty: recipe.difficulty || "Trung bình",
        cookingTime: recipe.cookingTime || 30,
        servings: recipe.servings || 4,
        ingredients: recipe.ingredients?.length > 0 
          ? recipe.ingredients 
          : [{ name: "", quantity: "", unit: "g" }],
        status: recipe.status || "active",
        isPublished: recipe.isPublished || false,
        category: recipe.category || "Khác",
        preparationTime: recipe.preparationTime || 30,
      });
      setImagePreview(recipe.image?.url || "");
    } else {
      // Reset form for new recipe
      setFormData({
        name: "",
        description: "",
        instructions: "",
        image: { url: "", altText: "" },
        difficulty: "Trung bình",
        cookingTime: 30,
        servings: 4,
        ingredients: [{ name: "", quantity: "", unit: "g" }],
        status: "active",
        isPublished: false,
        category: "Khác",
        preparationTime: 30,
      });
      setImagePreview("");
    }
    setFormErrors({});
  }, [recipe, isOpen]);

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      image: { ...prev.image, [name]: value },
    }));
    
    if (name === "url") {
      setImagePreview(value);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "g" }],
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Tên công thức là bắt buộc";
    if (!formData.description.trim()) errors.description = "Mô tả là bắt buộc";
    if (!formData.instructions.trim()) errors.instructions = "Hướng dẫn làm bánh là bắt buộc";
    if (!formData.image.url.trim()) errors.imageUrl = "URL hình ảnh là bắt buộc";
    if (!formData.cookingTime) errors.cookingTime = "Thời gian nướng là bắt buộc";
    if (!formData.servings) errors.servings = "Số phần ăn là bắt buộc";
    
    // Validate ingredients
    const hasEmptyIngredients = formData.ingredients.some(
      (ing) => !ing.name.trim() || !ing.quantity.trim()
    );
    if (hasEmptyIngredients) {
      errors.ingredients = "Tất cả nguyên liệu phải có tên và số lượng";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (recipe) {
        // Update existing recipe
        await dispatch(updateRecipe({ 
          id: recipe._id, 
          recipeData: formData 
        })).unwrap();
      } else {
        // Create new recipe
        await dispatch(createRecipe(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      // Error is handled by Redux slice
      console.error("Error saving recipe:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-pink-50">
            <div className="flex items-center gap-3">
              <FaUtensils className="text-pink-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">
                {recipe ? "Chỉnh sửa công thức" : "Thêm công thức mới"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUtensils className="text-pink-500" />
                    Thông tin cơ bản
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên công thức *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập tên công thức"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      formErrors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Mô tả ngắn về công thức"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>
              </div>

              {/* Image Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaImage className="text-pink-500" />
                  Hình ảnh công thức
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL hình ảnh *
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.image.url}
                      onChange={handleImageChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        formErrors.imageUrl ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formErrors.imageUrl && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.imageUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xem trước hình ảnh
                    </label>
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain rounded"
                          onError={() => setImagePreview("")}
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <FaUpload size={32} className="mx-auto mb-2" />
                          <p>Nhập URL để xem trước</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipe Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClock className="text-pink-500" />
                  Chi tiết công thức
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Độ khó
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {RECIPE_DIFFICULTIES.map((diff) => (
                        <option key={diff.value} value={diff.value}>
                          {diff.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian nướng (phút) *
                    </label>
                    <select
                      name="cookingTime"
                      value={formData.cookingTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time} phút
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số phần ăn *
                    </label>
                    <select
                      name="servings"
                      value={formData.servings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {SERVING_OPTIONS.map((serving) => (
                        <option key={serving} value={serving}>
                          {serving} phần
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Hướng dẫn làm bánh *
                </h3>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="8"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    formErrors.instructions ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập từng bước làm bánh một cách chi tiết..."
                />
                {formErrors.instructions && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.instructions}</p>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUsers className="text-pink-500" />
                  Nguyên liệu
                </h3>
                
                {formErrors.ingredients && (
                  <p className="text-red-500 text-sm mb-3">{formErrors.ingredients}</p>
                )}
                
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Tên nguyên liệu"
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          placeholder="Số lượng"
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-32">
                        <select
                          value={ingredient.unit}
                          onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          {INGREDIENT_UNITS.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        disabled={formData.ingredients.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-3 flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <FaPlus />
                  Thêm nguyên liệu
                </button>
              </div>

              {/* Status Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Cài đặt trạng thái
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm ngưng</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Công khai cho nhân viên làm bánh
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={actionLoading}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave />
                  {recipe ? "Cập nhật" : "Tạo công thức"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal; 