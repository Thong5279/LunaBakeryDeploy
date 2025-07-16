import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaShoppingCart, FaArrowLeft, FaFire, FaStar, FaHeart, FaBirthdayCake } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import IngredientGrid from "./IngredientGrid";
import { 
    fetchIngredientDetails, 
    fetchSimilarIngredients, 
    clearSelectedIngredient 
} from "../../redux/slices/ingredientsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { getProductReviews, clearReviews } from "../../redux/slices/reviewSlice";
import WishlistButton from "../Common/WishlistButton";
import Rating from "../Common/Rating";
import { useIngredientFlashSalePrice, formatPrice } from "../../utils/flashSaleUtils";

const DEFAULT_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";

const IngredientDetails = ({ ingredientId }) => {
    const { id: routeID } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedIngredient, similarIngredients, loading, error } = useSelector((state) => state.ingredients);
    const { reviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
    const { user, guestId } = useSelector((state) => state.auth);

    const [mainImage, setMainImage] = useState(DEFAULT_IMAGE);
    const [quantity, setQuantity] = useState(1);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const idToFetch = ingredientId || routeID;

    // Flash sale price calculation
    const flashSalePrice = useIngredientFlashSalePrice(selectedIngredient);

    // Tạo các floating elements cho background
    const createFloatingElements = () => {
        const elements = [];
        for (let i = 0; i < 15; i++) {
            elements.push({
                id: i,
                type: Math.random() > 0.6 ? 'star' : Math.random() > 0.3 ? 'heart' : 'cake',
                left: Math.random() * 100,
                top: Math.random() * 100,
                animationDelay: Math.random() * 5,
                animationDuration: 4 + Math.random() * 6,
                size: 1.5 + Math.random() * 2
            });
        }
        return elements;
    };

    const floatingElements = createFloatingElements();

    // Get stock status with styling
    const getStockStatus = (quantity) => {
      if (quantity === 0) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
            ❌ Hết hàng
          </span>
        );
      } else if (quantity <= 10) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            ⚠️ Sắp hết ({quantity})
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            ✅ Còn hàng ({quantity})
          </span>
        );
      }
    };

    useEffect(() => {
        if (idToFetch && idToFetch !== "undefined") {
            console.log("✅ Đang fetch nguyên liệu bằng ID:", idToFetch);
            dispatch(fetchIngredientDetails(idToFetch));
            // Fetch đánh giá khi component mount
            dispatch(getProductReviews({ 
                productId: idToFetch,
                itemType: 'Ingredient'
            }));
        }

        // Cleanup when component unmounts
        return () => {
            dispatch(clearSelectedIngredient());
            dispatch(clearReviews());
        };
    }, [idToFetch, dispatch]);

    useEffect(() => {
        if (selectedIngredient?.images?.length > 0) {
            const validImages = selectedIngredient.images.filter(img => img && img.trim() !== '');
            if (validImages.length > 0) {
                setMainImage(validImages[0]);
            } else {
                setMainImage(DEFAULT_IMAGE);
            }
        } else {
            setMainImage(DEFAULT_IMAGE);
        }
        
        // Fetch similar ingredients when selected ingredient is loaded
        if (selectedIngredient?.category && selectedIngredient?._id) {
            dispatch(fetchSimilarIngredients({ 
                id: selectedIngredient._id, 
                category: selectedIngredient.category 
            }));
        }
    }, [selectedIngredient, dispatch]);

    const handleQuantityChange = (action) => {
      if (action === "plus") {
        // Kiểm tra số lượng tồn kho khi tăng
        if (quantity >= selectedIngredient.quantity) {
          toast.error(`Số lượng không thể vượt quá ${selectedIngredient.quantity}`);
          return;
        }
        setQuantity(prev => prev + 1);
      } else {
        setQuantity(prev => Math.max(1, prev - 1));
      }
    };

    const handleAddToCart = () => {
      if (selectedIngredient.quantity === 0) {
        toast.error("Nguyên liệu này hiện đang hết hàng.");
        return;
      }

      // Kiểm tra số lượng tồn kho
      if (quantity > selectedIngredient.quantity) {
        toast.error(`Số lượng yêu cầu (${quantity}) vượt quá số lượng tồn kho (${selectedIngredient.quantity})`);
        return;
      }

      setButtonDisabled(true);
      dispatch(
        addToCart({
          productId: idToFetch,
          quantity,
          size: "Mặc định",
          flavor: "Mặc định",
          guestId,
          userId: user?._id,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Đã thêm vào giỏ hàng!");
        })
        .catch((error) => {
          toast.error(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
        })
        .finally(() => setButtonDisabled(false));
    };

    const handleGoBack = () => {
      navigate('/ingredients');
    };

    if (loading) return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
      </div>
    );
    
    if (error) return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center">
        <div className="text-center py-10 bg-white rounded-2xl shadow-xl p-8">
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
            Quay lại danh sách nguyên liệu
          </button>
        </div>
      </div>
    );

    return selectedIngredient ? (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 relative overflow-hidden">
            {/* Floating elements background */}
            {floatingElements.map((element) => (
                <motion.div
                    key={element.id}
                    className={`absolute z-0 ${
                        element.type === 'star' ? 'text-yellow-500/60' : 
                        element.type === 'heart' ? 'text-pink-500/60' : 'text-rose-500/60'
                    }`}
                    style={{
                        left: `${element.left}%`,
                        top: `${element.top}%`,
                        fontSize: `${element.size}rem`
                    }}
                    animate={{
                        y: [0, -30, 0],
                        rotate: element.type === 'star' ? [0, 360] : 
                               element.type === 'heart' ? [0, 15, -15, 0] : [0, -360],
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        duration: element.animationDuration,
                        delay: element.animationDelay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {element.type === 'star' ? <FaStar /> : 
                     element.type === 'heart' ? <FaHeart /> : <FaBirthdayCake />}
                </motion.div>
            ))}

            {/* Overlay pattern */}
            <div className="absolute inset-0 z-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back button */}
                    <motion.button
                        onClick={handleGoBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Quay lại danh sách nguyên liệu
                    </motion.button>

                    {/* Main content card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-8"
                    >
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Hình ảnh */}
                            <div className="md:w-1/2 space-y-4">
                                <div className="overflow-hidden rounded-2xl shadow-xl group relative bg-gradient-to-br from-pink-50 to-rose-50">
                                    <img
                                        src={mainImage || DEFAULT_IMAGE}
                                        alt={selectedIngredient.name}
                                        className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = DEFAULT_IMAGE;
                                        }}
                                    />
                                    
                                    {/* Flash Sale Badge */}
                                    {flashSalePrice.isFlashSale && (
                                      <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10 flex items-center gap-1 animate-pulse shadow-lg"
                                      >
                                        <FaFire className="text-sm" />
                                        -{flashSalePrice.discountPercent}%
                                      </motion.div>
                                    )}
                                </div>
                                <div className="flex gap-3 overflow-x-auto">
                                    {selectedIngredient.images && selectedIngredient.images.length > 0 ? (
                                        selectedIngredient.images
                                            .filter(img => img && img.trim() !== '')
                                            .map((img, i) => (
                                                <div key={i} className="overflow-hidden rounded-xl group">
                                                    <img
                                                        src={img}
                                                        alt={`${selectedIngredient.name} - Ảnh ${i + 1}`}
                                                        onClick={() => setMainImage(img)}
                                                        className={`w-20 h-20 object-cover rounded-xl border cursor-pointer transition-transform duration-300 group-hover:scale-110 ${
                                                            mainImage === img ? "border-pink-500 shadow-lg" : "border-gray-300"
                                                        }`}
                                                        onError={(e) => {
                                                            e.target.src = DEFAULT_IMAGE;
                                                        }}
                                                    />
                                                </div>
                                            ))
                                    ) : (
                                        <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl border border-pink-200 flex items-center justify-center">
                                            <span className="text-xs text-pink-600">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thông tin */}
                            <div className="md:w-1/2 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-pink-600 mb-2">{selectedIngredient.name}</h1>
                                        {/* Category badge */}
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-50 text-pink-700 border border-pink-200">
                                            {selectedIngredient.category}
                                        </span>
                                    </div>
                                    <WishlistButton productId={idToFetch} itemType="Ingredient" />
                                </div>

                                {/* SKU */}
                                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-xl">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Mã sản phẩm:</span> {selectedIngredient.sku}
                                    </p>
                                </div>

                                {/* Stock status */}
                                <div>
                                    {getStockStatus(selectedIngredient.quantity)}
                                </div>

                                {/* Hiển thị giá */}
                                <div className="space-y-1 bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl">
                                    {flashSalePrice.isFlashSale ? (
                                        <>
                                            <p className="text-3xl text-red-600 font-bold">
                                                {formatPrice(flashSalePrice.displayPrice)}
                                            </p>
                                            <p className="text-xl text-gray-500 line-through">
                                                {formatPrice(flashSalePrice.originalPrice)}
                                            </p>
                                            <p className="text-sm text-red-500 font-medium">
                                                ⚡ Flash Sale
                                            </p>
                                        </>
                                    ) : selectedIngredient.discountPrice > 0 && selectedIngredient.discountPrice < selectedIngredient.price ? (
                                        <>
                                            <p className="text-3xl text-pink-500 font-bold">
                                                {formatPrice(selectedIngredient.discountPrice)}
                                            </p>
                                            <p className="text-xl text-gray-500 line-through">
                                                {formatPrice(selectedIngredient.price)}
                                            </p>
                                            <p className="text-sm text-green-600 font-medium">
                                                Tiết kiệm: {formatPrice(selectedIngredient.price - selectedIngredient.discountPrice)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-3xl text-pink-500 font-bold">
                                            {formatPrice(selectedIngredient.discountPrice || selectedIngredient.price)}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-pink-100">
                                    <p className="text-gray-600">{selectedIngredient.description}</p>
                                </div>

                                {/* Supplier info */}
                                {selectedIngredient.supplier && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                        <p className="font-semibold text-blue-500 mb-1">Nhà cung cấp:</p>
                                        <p className="text-gray-700">{selectedIngredient.supplier}</p>
                                    </div>
                                )}

                                {/* Notes */}
                                {selectedIngredient.notes && (
                                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                                        <p className="font-semibold text-yellow-600 mb-1">Ghi chú:</p>
                                        <p className="text-gray-700 text-sm">{selectedIngredient.notes}</p>
                                    </div>
                                )}

                                {/* Quantity selector */}
                                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-pink-100">
                                    <span className="font-medium text-gray-700">Số lượng:</span>
                                    <button 
                                        onClick={() => handleQuantityChange("minus")}
                                        className="bg-pink-200 hover:bg-pink-300 px-3 py-1 rounded-lg transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1 border rounded-lg bg-white">{quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange("plus")}
                                        disabled={quantity >= selectedIngredient.quantity}
                                        className={`px-3 py-1 rounded-lg transition-colors ${
                                            quantity >= selectedIngredient.quantity
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-pink-200 hover:bg-pink-300'
                                        }`}
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        (Còn {selectedIngredient.quantity} sản phẩm)
                                    </span>
                                </div>

                                {/* Add to cart button */}
                                <motion.button
                                    onClick={handleAddToCart}
                                    disabled={buttonDisabled || selectedIngredient.quantity === 0}
                                    whileTap={{ scale: 0.95 }}
                                    className={`bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full w-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                                        buttonDisabled || selectedIngredient.quantity === 0 
                                            ? "opacity-50 cursor-not-allowed" 
                                            : "hover:from-pink-600 hover:to-rose-600"
                                    }`}
                                >
                                    <FaShoppingCart className="inline mr-2" />
                                    {selectedIngredient.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                                </motion.button>
                            </div>
                        </div>

                        {/* Phần đánh giá */}
                        <div className="mt-8 border-t border-pink-200 pt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaStar className="text-yellow-500" />
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
                                <div className="text-center py-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                                    <p className="text-gray-500">
                                        Chưa có đánh giá nào cho nguyên liệu này
                                    </p>
                                </div>
                            )}

                            {/* Reviews list */}
                            {!reviewsLoading && reviews && reviews.length > 0 && (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <motion.div 
                                            key={review._id} 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-pink-100"
                                        >
                                            <div className="flex items-start space-x-4">
                                                <img 
                                                    src={review.user?.avatar || DEFAULT_IMAGE} 
                                                    alt={review.user?.name || 'Người dùng'}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
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
                                                    
                                                    {/* Hiển thị số sao */}
                                                    {review.rating && (
                                                        <div className="mt-2">
                                                            <Rating 
                                                                value={review.rating} 
                                                                size="small"
                                                                color="#fbbf24"
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    {review.comment && (
                                                        <p className="mt-3 text-gray-700">
                                                            {review.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nguyên liệu tương tự */}
                        {similarIngredients.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-xl font-bold text-pink-500 mb-6 text-center flex items-center justify-center gap-2">
                                  
                                    <img 
                                        src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3am93c2J0YTd6czJ5czB4MjdicTF0OWF4aTdycXd0ZHoybGZuNWpnMiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/YswZffvIvv3SE/giphy.gif" 
                                        alt="Nguyên liệu tương tự" 
                                        className="w-8 h-8 object-contain"
                                    />
                                    Nguyên liệu tương tự
                                    <img 
                                        src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3am93c2J0YTd6czJ5czB4MjdicTF0OWF4aTdycXd0ZHoybGZuNWpnMiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/YswZffvIvv3SE/giphy.gif" 
                                        alt="Nguyên liệu tương tự" 
                                        className="w-8 h-8 object-contain"
                                    />
                                    
                                </h2>
                                <IngredientGrid ingredients={similarIngredients} loading={false} error={null} />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    ) : null;
};

export default IngredientDetails; 