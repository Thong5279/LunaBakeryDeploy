import React, { useState } from "react";
const EditProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    sku: "",
    description: "",
    category: "",
    images: [
      {
        url: "https://picsum.photos/150?random=1",
      },
      {
        url: "https://picsum.photos/150?random=2",
      },
    ],
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
    console.log(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productData)
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
