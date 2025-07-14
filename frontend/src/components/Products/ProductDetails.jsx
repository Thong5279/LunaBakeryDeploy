import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaShoppingCart, FaArrowLeft, FaStar, FaHeart, FaBirthdayCake, FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "./ProductGrid";
import { fetchProductDetails, fetchSimilarProducts, clearSelectedProduct } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { getProductReviews, clearReviews } from '../../redux/slices/reviewSlice';
import Rating from '../Common/Rating';
import WishlistButton from '../Common/WishlistButton';
import { useProductFlashSalePrice, formatPrice, getTimeRemaining } from "../../utils/flashSaleUtils";

const PREVIOUS_PATH_KEY = 'luna_bakery_previous_path';
const DEFAULT_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";

const ProductDetails = ({ productId }) => {
  const { id: routeID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { selectedProduct, similarProducts, loading, error } = useSelector((state) => state.products);
  const { reviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const idToFetch = productId || routeID;
  const flashSalePrice = useProductFlashSalePrice(selectedProduct, selectedSize);
  
  // Tính toán giá hiển thị với size
  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;
    
    // Nếu có flash sale, ưu tiên giá flash sale
    if (flashSalePrice.isFlashSale) {
      return flashSalePrice.displayPrice;
    }
    
    // Tính giá theo size
    if (selectedProduct.sizePricing && selectedProduct.sizePricing.length > 0 && selectedSize) {
      const sizePrice = selectedProduct.sizePricing.find(sp => sp.size === selectedSize);
      if (sizePrice) {
        return sizePrice.discountPrice || sizePrice.price;
      }
    }
    
    // Fallback về giá thường
    return selectedProduct.discountPrice || selectedProduct.price;
  };
  
  const currentPrice = getCurrentPrice();

  // Tạo các floating elements cho background
  const createFloatingElements = () => {
    const elements = [];
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        type: Math.random() > 0.5 ? 'star' : Math.random() > 0.25 ? 'heart' : 'cake',
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 4 + Math.random() * 6,
        size: 1 + Math.random() * 1.5
      });
    }
    return elements;
  };

  const floatingElements = createFloatingElements();

  // Lưu đường dẫn trước khi vào trang chi tiết
  useEffect(() => {
    const currentPath = location.pathname;

    // Chỉ lưu path mới nếu không phải là trang chi tiết sản phẩm
    if (!currentPath.includes('/product/')) {
      localStorage.setItem(PREVIOUS_PATH_KEY, currentPath);
    }
  }, [location]);



  const handleGoBack = () => {
    const previousPath = localStorage.getItem(PREVIOUS_PATH_KEY) || '/collections/all';
    navigate(previousPath);
  };

  useEffect(() => {
    if (idToFetch && idToFetch !== "undefined") {
      console.log("✅ Đang fetch sản phẩm bằng ID:", idToFetch);
      dispatch(fetchProductDetails(idToFetch));
      // Fetch đánh giá khi component mount
      dispatch(getProductReviews({ 
          productId: idToFetch,
          itemType: 'Product'
      }));
      // Fetch sản phẩm tương tự
      dispatch(fetchSimilarProducts({ id: idToFetch }));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(clearReviews());
    };
  }, [idToFetch, dispatch]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0 && selectedProduct.images[0]?.url) {
      setMainImage(selectedProduct.images[0].url);
    } else {
      setMainImage("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=");
    }
    
    // Auto-select first size if available
    if (selectedProduct?.sizes?.length > 0 && !selectedSize) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
  }, [selectedProduct]);



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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Floating background elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute z-0 ${
            element.type === 'star' ? 'text-yellow-500 drop-shadow-lg' : 
            element.type === 'heart' ? 'text-pink-500 drop-shadow-lg' : 'text-rose-500 drop-shadow-lg'
          }`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            fontSize: `${element.size * 1.5}rem`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: element.animationDuration,
            delay: element.animationDelay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {element.type === 'star' ? <FaStar /> : 
           element.type === 'heart' ? <FaHeart /> : <FaBirthdayCake />}
        </motion.div>
      ))}

      {/* Sparkle overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-pink-100/20 to-transparent animate-pulse" />
      
      {/* Additional sparkle effects */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-rose-400 rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
      
      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-pink-100">
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
                        onClick={() => setMainImage(img?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=")}
                        className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-transform duration-300 group-hover:scale-110 ${
                          mainImage === (img?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=") ? "border-pink-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="md:w-1/2 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-pink-600 mb-2">{selectedProduct.name}</h1>
                  {/* Category badge */}
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-pink-50 text-pink-700 border border-pink-200">
                    {selectedProduct.category}
                  </span>
                </div>
                <WishlistButton productId={idToFetch} itemType="Product" />
              </div>

              {/* SKU */}
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Mã sản phẩm:</span> {selectedProduct.sku}
                </p>
              </div>

              {/* Stock status */}
              <div>
                {selectedProduct.quantity > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Còn hàng ({selectedProduct.quantity})
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Hết hàng
                  </span>
                )}
              </div>

              {/* Hiển thị giá */}
              <div className="space-y-2">
                {(() => {
                  if (flashSalePrice.isFlashSale) {
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-red-600">
                            {formatPrice(currentPrice)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(flashSalePrice.originalPrice)}
                          </span>
                          <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            <FaFire className="inline mr-1" />
                            -{flashSalePrice.discountPercent}%
                          </span>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FaFire className="text-red-500" />
                            <span className="text-sm text-red-500 font-medium">
                              ⚡ Flash Sale
                            </span>
                          </div>
                          <p className="text-sm text-red-600">
                            Kết thúc: {getTimeRemaining(flashSalePrice.flashSaleInfo.endDate)}
                          </p>
                        </div>
                      </div>
                    );
                  } else if (selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.price) {
                    return (
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-pink-600">
                          {formatPrice(currentPrice)}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(selectedProduct.price)}
                        </span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                          -{Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)}%
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <span className="text-3xl font-bold text-pink-600">
                        {formatPrice(currentPrice)}
                      </span>
                    );
                  }
                })()}
              </div>

              {/* Rating */}
              {selectedProduct.rating && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                  <span className="text-xs text-gray-600">{selectedProduct.rating.toFixed(1)}</span>
                </div>
              )}

              {/* Mô tả */}
              {selectedProduct.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                </div>
              )}

              {/* Size selection */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kích thước</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedSize === size
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-300 hover:border-pink-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flavor selection */}
              {selectedProduct.flavors && selectedProduct.flavors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hương vị</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedFlavor === flavor
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-300 hover:border-pink-300"
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Số lượng</h3>
                <div className="flex items-center gap-4">
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

          {/* Phần đánh giá sản phẩm */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              Đánh giá từ khách hàng ({reviews?.length || 0})
            </h2>
            
            {/* Loading state */}
            {reviewsLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
              </div>
            )}

            {/* No reviews */}
            {!reviewsLoading && (!reviews || reviews.length === 0) && (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  Chưa có đánh giá nào cho sản phẩm này
                </p>
              </div>
            )}

            {/* Reviews list */}
            {!reviewsLoading && reviews && reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={review.user?.avatar || DEFAULT_IMAGE} 
                        alt={review.user?.name || 'Người dùng'}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {review.user?.name || 'Người dùng ẩn danh'}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          <Rating value={review.rating} />
                        </div>

                        {review.comment && (
                          <p className="mt-3 text-gray-700">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phần sản phẩm tương tự */}
          {selectedProduct.category && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-center">🌟 Có thể bạn sẽ thích 🌟</h2>
              <div className="-mx-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 px-2">
                  {(similarProducts || []).slice(0, 8).map((product) => (
                    <div key={product._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-300 flex flex-col items-center max-w-xs mx-auto">
                      <div className="w-full aspect-square mb-4 overflow-hidden rounded-xl">
                        <img
                          src={product.images && product.images.length > 0 && product.images[0]?.url ? product.images[0].url : 'https://via.placeholder.com/500x500?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <h3 className="text-lg mb-2 font-semibold text-center line-clamp-2 text-gray-900" title={product.name}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-gray-600 mb-3 text-center line-clamp-2">
                          {product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-3 mb-2">
                        {product.category && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-pink-500">{product.category}</span>
                          </div>
                        )}
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                            <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-lg text-center text-pink-500 mb-1">
                        {product.price ? product.price.toLocaleString('vi-VN') + ' ₫' : ''}
                      </p>
                      {product.discountPrice && product.discountPrice < product.price && (
                        <p className="text-xs text-gray-400 text-center line-through mb-1">
                          {product.price.toLocaleString('vi-VN')} ₫
                        </p>
                      )}
                      <a href={`/product/${product._id}`} className="mt-auto w-full block text-center bg-pink-500 text-white py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors text-sm mt-4">Xem chi tiết</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default ProductDetails;
