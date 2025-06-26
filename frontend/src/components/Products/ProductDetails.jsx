import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "./ProductGrid";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id: routeID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct, similarProducts, loading, error } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);

  const idToFetch = productId || routeID;

  // Tính giá theo size đã chọn
  const calculateCurrentPrice = () => {
    if (!selectedProduct) return 0;
    
    // Nếu có sizePricing và đã chọn size
    if (selectedProduct.sizePricing && selectedProduct.sizePricing.length > 0 && selectedSize) {
      const sizePrice = selectedProduct.sizePricing.find(sp => sp.size === selectedSize);
      if (sizePrice) {
        return sizePrice.discountPrice || sizePrice.price;
      }
    }
    
    // Fallback về giá gốc
    return selectedProduct.discountPrice || selectedProduct.price;
  };

  const handleGoBack = () => {
    // Kiểm tra collection từ URL hoặc product category để navigate về đúng collection
    if (selectedProduct?.collection) {
      navigate(`/collections/${selectedProduct.collection.toLowerCase()}`);
    } else {
      // Fallback về trang home nếu không xác định được collection
      navigate('/');
    }
  };

  useEffect(() => {
    if (idToFetch && idToFetch !== "undefined") {
      console.log("✅ Đang fetch bằng ID:", idToFetch);
      dispatch(fetchProductDetails(idToFetch));
      dispatch(fetchSimilarProducts({ id: idToFetch }));
    }
  }, [idToFetch, dispatch]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0 && selectedProduct.images[0]?.url) {
      setMainImage(selectedProduct.images[0].url);
    } else {
      setMainImage("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5Oxgo8L3RleHQ+PC9zdmc+");
    }
    
    // Auto-select first size if available
    if (selectedProduct?.sizes?.length > 0 && !selectedSize) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
  }, [selectedProduct]);

  // Cập nhật giá khi selectedSize hoặc selectedProduct thay đổi
  useEffect(() => {
    const newPrice = calculateCurrentPrice();
    setCurrentPrice(newPrice);
  }, [selectedSize, selectedProduct]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "plus" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    // Check if product has sizes/flavors and they are required
    const hasSizes = selectedProduct.sizes && selectedProduct.sizes.length > 0;
    const hasFlavors = selectedProduct.flavors && selectedProduct.flavors.length > 0;
    
    if (hasSizes && !selectedSize) {
      toast.error("Vui lòng chọn kích thước.");
      return;
    }
    
    if (hasFlavors && !selectedFlavor) {
      toast.error("Vui lòng chọn hương vị.");
      return;
    }

    setButtonDisabled(true);
    dispatch(
      addToCart({
        productId: idToFetch,
        quantity,
        size: selectedSize || "Mặc định",
        flavor: selectedFlavor || "Mặc định",
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Đã thêm vào giỏ hàng!");
      })
      .finally(() => setButtonDisabled(false));
  };

  if (loading) return <div className="text-center py-10">Đang tải sản phẩm...</div>;
  if (error) return (
    <div className="text-center py-10">
      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
      <p className="text-red-600">{error}</p>
      <button
        onClick={handleGoBack}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
      >
        Quay lại danh sách sản phẩm
      </button>
    </div>
  );

  return selectedProduct ? (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        {/* Back button */}
        <motion.button
          onClick={handleGoBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          Quay lại danh sách sản phẩm
        </motion.button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Hình ảnh */}
          <div className="md:w-1/2 space-y-4">
            <div className="overflow-hidden rounded-lg shadow-lg group">
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-auto object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                selectedProduct.images.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-lg group">
                    <img
                      src={img?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"}
                      onClick={() => setMainImage(img?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=")}
                      className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-transform duration-300 group-hover:scale-110 ${
                        mainImage === (img?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=") ? "border-pink-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                ))
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl font-bold text-pink-600">{selectedProduct.name}</h1>
            
            {/* Trạng thái sản phẩm */}
            {selectedProduct.status === 'inactive' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 font-medium">Sản phẩm tạm ngừng bán</span>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  Sản phẩm này hiện không có sẵn. Vui lòng chọn sản phẩm khác.
                </p>
              </div>
            )}

            {/* Hiển thị giá - chỉ 1 giá duy nhất */}
            <div className="space-y-1">
              <p className={`text-3xl font-bold ${selectedProduct.status === 'inactive' ? 'text-gray-400' : 'text-pink-500'}`}>
                {currentPrice.toLocaleString("vi-VN")} ₫
              </p>
              {selectedSize && selectedProduct.sizePricing && (
                <p className="text-sm text-blue-600">
                  Giá cho size: {selectedSize}
                </p>
              )}
            </div>

            <p className="text-gray-600">{selectedProduct.description}</p>

            <div>
              <p className="font-semibold text-pink-500 mb-2">Kích thước:</p>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
                  selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      disabled={selectedProduct.status === 'inactive'}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        selectedProduct.status === 'inactive'
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : selectedSize === s 
                            ? "bg-pink-500 text-white border-pink-500 shadow-lg" 
                            : "bg-white text-gray-700 border-gray-300 hover:border-pink-300"
                      }`}
                      onClick={() => selectedProduct.status === 'active' && handleSizeChange(s)}
                    >
                      {s.includes('cm') || s.includes('Size') || s.includes('Hộp') || s.includes('Nhỏ') || s.includes('Vừa') || s.includes('Lớn') ? s : `${s} cm`}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-500">Chưa có kích thước</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold text-pink-500 mb-2">Hương vị:</p>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.flavors && selectedProduct.flavors.length > 0 ? (
                  selectedProduct.flavors.map((f) => (
                    <button
                      key={f}
                      disabled={selectedProduct.status === 'inactive'}
                      className={`px-4 py-1 rounded-full transition-all duration-200 ${
                        selectedProduct.status === 'inactive'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedFlavor === f 
                            ? "bg-pink-200 border-2 border-pink-500" 
                            : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => selectedProduct.status === 'active' && setSelectedFlavor(f)}
                    >
                      {f}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-500">Chưa có hương vị</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleQuantityChange("minus")}
                disabled={selectedProduct.status === 'inactive'}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedProduct.status === 'inactive' 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                -
              </button>
              <span className={`px-4 py-1 border rounded ${
                selectedProduct.status === 'inactive' ? 'bg-gray-100 text-gray-400' : ''
              }`}>
                {quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange("plus")}
                disabled={selectedProduct.status === 'inactive'}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedProduct.status === 'inactive' 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                +
              </button>
            </div>

            <motion.button
              onClick={handleAddToCart}
              disabled={buttonDisabled || selectedProduct.status === 'inactive'}
              whileTap={{ scale: selectedProduct.status === 'inactive' ? 1 : 0.95 }}
              className={`px-6 py-3 rounded-full w-full font-semibold transition flex items-center justify-center ${
                selectedProduct.status === 'inactive'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : buttonDisabled 
                    ? 'bg-pink-300 text-white cursor-not-allowed' 
                    : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              <FaShoppingCart className="inline mr-2" />
              {selectedProduct.status === 'inactive' 
                ? 'Sản phẩm ngừng bán' 
                : 'Thêm vào giỏ hàng'
              }
            </motion.button>
          </div>
        </div>

        {/* Sản phẩm tương tự */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-pink-500 mb-6 text-center">🌟 Bạn có thể thích 🌟</h2>
          <ProductGrid products={similarProducts} loading={loading} error={error} />
        </div>
      </div>
    </div>
  ) : null;
};

export default ProductDetails;
