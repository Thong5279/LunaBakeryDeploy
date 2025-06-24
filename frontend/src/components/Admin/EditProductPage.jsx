import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { updateProduct } from "../../redux/slices/adminProductSlice"; 
import axios from "axios";

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
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    sku: "",
    description: "",
    category: "",
    images: [],
    sizes: "",
    flavors: "", // hương vị
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct(id, productData));
    navigate("/admin/products");
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
        {/* size */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kích thước
          </label>
          <input
            type="text"
            name="sizes"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={productData.sizes}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
          />
        </div>
        {/* flavor */}
        <div className="mb-6">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hương vị
          </label>
          <input
            type="text"
            name="flavors"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={productData.flavors}
            onChange={(e) =>
              setProductData({
                ...productData,
                flavors: e.target.value
                  .split(",")
                  .map((flavor) => flavor.trim()),
              })
            }
          />
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
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Ảnh sản phẩm"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
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
