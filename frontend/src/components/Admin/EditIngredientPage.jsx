import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchIngredientById, 
  updateIngredient, 
  clearCurrentIngredient,
  clearError 
} from "../../redux/slices/adminIngredientSlice";
import { 
  INGREDIENT_CATEGORIES, 
  INGREDIENT_STATUS
} from "../../constants/ingredientConstants";

const EditIngredientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  console.log("🔥 EditIngredientPage rendered with ID:", id);
  
  const { 
    currentIngredient, 
    actionLoading, 
    actionError 
  } = useSelector((state) => state.adminIngredients);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: INGREDIENT_CATEGORIES[0],
    price: "",
    discountPrice: "",
    quantity: "",
    sku: "",
    status: "active",
    supplier: "",
    notes: "",
    images: []
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    console.log("🔥 EditIngredientPage useEffect - ID:", id);
    if (id) {
      console.log("🔥 Dispatching fetchIngredientById for ID:", id);
      dispatch(fetchIngredientById(id));
    }
    
    return () => {
      dispatch(clearCurrentIngredient());
      dispatch(clearError());
    };
  }, [id, dispatch]);

  useEffect(() => {
    console.log("🔥 Current ingredient changed:", currentIngredient);
    if (currentIngredient) {
      setFormData({
        name: currentIngredient.name || "",
        description: currentIngredient.description || "",
        category: currentIngredient.category || INGREDIENT_CATEGORIES[0],
        price: currentIngredient.price?.toString() || "",
        discountPrice: currentIngredient.discountPrice?.toString() || "",
        quantity: currentIngredient.quantity?.toString() || "",
        sku: currentIngredient.sku || "",
        status: currentIngredient.status || "active",
        supplier: currentIngredient.supplier || "",
        notes: currentIngredient.notes || "",
        images: currentIngredient.images || []
      });
    }
  }, [currentIngredient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Xử lý upload ảnh
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Chỉ hỗ trợ file ảnh (JPG, PNG, WebP)");
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Kích thước file không được vượt quá 5MB");
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('userToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Thêm ảnh vào danh sách
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), data.imageUrl]
      }));

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError("Lỗi khi upload ảnh. Vui lòng thử lại.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Xóa ảnh khỏi danh sách
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Tên nguyên liệu là bắt buộc";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Mô tả là bắt buộc";
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = "Giá bán phải là số dương";
    }
    
    if (formData.discountPrice && (isNaN(Number(formData.discountPrice)) || Number(formData.discountPrice) < 0)) {
      errors.discountPrice = "Giá giảm phải là số dương";
    }
    
    if (formData.discountPrice && Number(formData.discountPrice) > Number(formData.price)) {
      errors.discountPrice = "Giá giảm không được lớn hơn giá gốc";
    }
    
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      errors.quantity = "Số lượng phải là số không âm";
    }
    
    if (!formData.sku.trim()) {
      errors.sku = "Mã SKU là bắt buộc";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updateData = {
      ...formData,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || 0,
      quantity: Number(formData.quantity)
    };

    dispatch(updateIngredient({ 
      ingredientId: id, 
      ingredientData: updateData 
    }))
      .then((result) => {
        if (result.type.endsWith("/fulfilled")) {
          setUpdateSuccess(true);
          setTimeout(() => {
            setUpdateSuccess(false);
            const currentPath = window.location.pathname;
            const basePath = currentPath.includes('/admin/') ? '/admin' : '/manager';
            navigate(`${basePath}/ingredients`);
          }, 2000);
        }
      });
  };

  const handleCancel = () => {
    // Determine where to navigate back based on current path
    const currentPath = window.location.pathname;
    const basePath = currentPath.includes('/admin/') ? '/admin' : '/manager';
    console.log("🔥 EditIngredientPage - Navigating back to:", `${basePath}/ingredients`);
    navigate(`${basePath}/ingredients`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  if (actionLoading && !currentIngredient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (actionError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">Lỗi: {actionError}</p>
          <button 
            onClick={() => {
              const currentPath = window.location.pathname;
              const basePath = currentPath.includes('/admin/') ? '/admin' : '/manager';
              navigate(`${basePath}/ingredients`);
            }}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Success Message */}
      {updateSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Cập nhật nguyên liệu thành công!</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa nguyên liệu
          </h2>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            ← Quay lại
          </button>
        </div>

        {currentIngredient && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Thông tin hiện tại:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Giá hiện tại:</span> {formatPrice(currentIngredient.price)} VNĐ
              </div>
              <div>
                <span className="font-medium">Số lượng:</span> {currentIngredient.quantity}
              </div>
              <div>
                <span className="font-medium">Trạng thái:</span> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  currentIngredient.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentIngredient.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                </span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {actionError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {actionError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên nguyên liệu *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên nguyên liệu"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mô tả nguyên liệu"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {INGREDIENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá bán (VNĐ) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {validationErrors.price && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá giảm (VNĐ)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  validationErrors.discountPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {validationErrors.discountPrice && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.discountPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  validationErrors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {validationErrors.quantity && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  validationErrors.sku ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mã SKU"
              />
              {validationErrors.sku && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.sku}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {INGREDIENT_STATUS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhà cung cấp
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nhập tên nhà cung cấp"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh sản phẩm
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Hỗ trợ: JPG, PNG, WebP. Tối đa 5MB
                </p>
                
                {uploadError && (
                  <p className="text-xs text-red-600 mt-2">{uploadError}</p>
                )}
                
                {uploadingImage && (
                  <p className="text-xs text-blue-600 mt-2">Đang upload...</p>
                )}
              </div>

              {/* Hiển thị ảnh đã upload */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Ảnh hiện tại ({formData.images.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Nguyên liệu ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nhập ghi chú thêm về nguyên liệu"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? "Đang cập nhật..." : "Cập nhật nguyên liệu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIngredientPage; 