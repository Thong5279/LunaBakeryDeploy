import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from '../../redux/slices/wishlistSlice';
import { toast } from 'sonner';

const WishlistButton = ({ productId, itemType = 'Product', className = '' }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlistStatus } = useSelector((state) => state.wishlist);
  const [isLoading, setIsLoading] = useState(false);

  const key = `${productId}-${itemType}`;
  const isInWishlist = wishlistStatus[key] || false;

  useEffect(() => {
    if (user && productId) {
      dispatch(checkWishlistStatus({ productId, itemType }));
    }
  }, [dispatch, user, productId, itemType]);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist({ productId, itemType })).unwrap();
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await dispatch(addToWishlist({ productId, itemType })).unwrap();
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Không hiển thị nút nếu chưa đăng nhập
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isInWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      {isInWishlist ? (
        <FaHeart className="w-5 h-5" />
      ) : (
        <FaRegHeart className="w-5 h-5" />
      )}
    </button>
  );
};

export default WishlistButton; 