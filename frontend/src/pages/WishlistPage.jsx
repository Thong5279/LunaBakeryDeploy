import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fetchWishlist, removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleRemoveFromWishlist = async (productId, itemType) => {
    try {
      await dispatch(removeFromWishlist({ productId, itemType })).unwrap();
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
      try {
        await dispatch(clearWishlist()).unwrap();
        toast.success('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích');
      } catch (error) {
        toast.error(error || 'Có lỗi xảy ra');
      }
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const productId = product._id || product.productId?._id || product.productId;
      await dispatch(addToCart({
        productId: productId,
        quantity: 1,
        size: "Mặc định",
        flavor: "Mặc định",
        guestId,
        userId: user?._id,
      })).unwrap();
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem danh sách yêu thích</p>
          <Link
            to="/login"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaHeart className="text-3xl text-red-500" />
              <h1 className="text-3xl font-bold text-gray-800">Danh sách yêu thích</h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                Xóa tất cả
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh sách yêu thích trống</h2>
              <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
              <Link
                to="/collections/all"
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => {
                const product = item.productId;
                const isProduct = item.itemType === 'Product';
                
                // Tạo key an toàn
                const safeKey = `${product?._id || product?.productId || index}-${item.itemType}`;
                
                return (
                  <motion.div
                    key={safeKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      {/* Xử lý ảnh cho cả Product và Ingredient */}
                      {(() => {
                        let imageUrl = '/placeholder-image.svg';
                        let imageAlt = product?.name || 'Sản phẩm';
                        
                        if (product?.images && product.images.length > 0) {
                          const firstImage = product.images[0];
                          if (typeof firstImage === 'string') {
                            // Ingredient: images là array of strings
                            imageUrl = firstImage;
                          } else if (firstImage?.url) {
                            // Product: images là array of objects với url
                            imageUrl = firstImage.url;
                            imageAlt = firstImage.altText || product.name || 'Sản phẩm';
                          }
                        }
                        
                        return (
                          <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.svg';
                            }}
                          />
                        );
                      })()}
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => {
                            const productId = product?._id || product?.productId;
                            if (productId) {
                              handleRemoveFromWishlist(productId, item.itemType);
                            }
                          }}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title="Xóa khỏi yêu thích"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isProduct 
                            ? 'bg-pink-100 text-pink-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {isProduct ? 'Sản phẩm' : 'Nguyên liệu'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {product.name || 'Tên sản phẩm không có'}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-lg font-bold text-pink-500">
                          {(() => {
                            const price = product?.price || 0;
                            const discountPrice = product?.discountPrice || 0;
                            
                            if (discountPrice > 0 && discountPrice < price) {
                              return (
                                <>
                                  <span className="line-through text-gray-400 text-sm">
                                    {formatPrice(price)}
                                  </span>
                                  <br />
                                  {formatPrice(discountPrice)}
                                </>
                              );
                            } else {
                              return formatPrice(discountPrice || price);
                            }
                          })()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const productId = product?._id || product?.productId;
                            if (productId) {
                              handleAddToCart(product);
                            }
                          }}
                          className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart className="w-4 h-4" />
                          Thêm vào giỏ
                        </button>
                        <Link
                          to={(() => {
                            const productId = product?._id || product?.productId;
                            if (!productId) return '#';
                            return isProduct ? `/product/${productId}` : `/ingredient/${productId}`;
                          })()}
                          className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage; 