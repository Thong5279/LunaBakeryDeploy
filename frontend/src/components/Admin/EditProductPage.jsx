import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { updateProduct } from "../../redux/slices/adminProductSlice"; 
import axios from "axios";
import { PRODUCT_CATEGORIES, PRODUCT_FLAVORS, PRODUCT_SIZES } from "../../constants/productConstants";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch]);
  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        sizes: selectedProduct.sizes || [],
        flavors: selectedProduct.flavors || [],
        countInStock: selectedProduct.countInStock || 0
      });
    }
  }, [selectedProduct]);

  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    sku: "",
    description: "",
    category: "",
    countInStock: 0,
    images: [],
    sizes: [],
    flavors: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";
      const uploadUrl = `${baseUrl}/api/upload`;
      console.log("Upload URL:", uploadUrl);
      console.log("Environment:", import.meta.env.VITE_BACKEND_URL);
      
      const { data } = await axios.post(
        uploadUrl,
        formData,
        {
          headers: { 
            "Authorization": `Bearer ${localStorage.getItem("userToken")}`
          },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating product with ID:", id);
    console.log("Product data:", productData);
    
    if (!id) {
      console.error("No product ID found!");
      return;
    }

    const formattedData = {
      ...productData,
      price: Number(productData.price),
      countInStock: Number(productData.countInStock),
    };
    
    dispatch(updateProduct({ id, productData: formattedData }))
      .then((result) => {
        console.log("Update result:", result);
        if (result.type.endsWith("/fulfilled")) {
          navigate("/admin/products");
        }
      })
      .catch((error) => {
        console.error("Update failed:", error);
      });
  };
  if(loading) {
    return <p>Đang tải dữ liệu...</p>
  }
  if(error) {
    return <p>Lỗi khi tải dữ liệu: {error}</p>
  }

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        {/* name */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tên sản phẩm
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* description */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mô tả
          </label>
          <textarea
            name="description"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={productData.description}
            rows={4}
            onChange={handleChange}
            required
          />
        </div>
        {/* price */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Giá
          </label>
          <input
            name="price"
            type="number"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={productData.price}
            onChange={handleChange}
          />
        </div>
        {/* sku */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mã sản phẩm
          </label>
          <input
            type="text"
            name="sku"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={productData.sku}
            onChange={handleChange}
          />
        </div>
        {/* category */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Danh mục
          </label>
          <select
            name="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={productData.category}
            onChange={handleChange}
            required
          >
            <option value="">Chọn danh mục</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {/* countInStock */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Số lượng tồn kho
          </label>
          <input
            type="number"
            name="countInStock"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={productData.countInStock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        {/* size */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kích thước
          </label>
          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
            {PRODUCT_SIZES.map((size) => (
              <label key={size} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={size}
                  checked={productData.sizes.includes(size)}
                  onChange={(e) => handleCheckboxChange(e, 'sizes')}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">{size}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Đã chọn: {productData.sizes.join(", ") || "Chưa chọn"}
          </p>
        </div>
        {/* flavor */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hương vị
          </label>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
            {PRODUCT_FLAVORS.map((flavor) => (
              <label key={flavor} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={flavor}
                  checked={productData.flavors.includes(flavor)}
                  onChange={(e) => handleCheckboxChange(e, 'flavors')}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">{flavor}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Đã chọn: {productData.flavors.join(", ") || "Chưa chọn"}
          </p>
        </div>
        {/* images */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload ảnh
          </label>
          <input
            type="file"
            name="images"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            onChange={handleImageUpload}
          />
          {uploading && <p className="text-blue-500 mt-2">Đang tải ảnh...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images && productData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.altText || "Ảnh sản phẩm"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  title="Xóa ảnh"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* submit */}
        <button
          type="submit"
          className="w-full bg-pink-400 text-white py-2 rounded-md hover:bg-pink-600 transition-colors"
        >
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
