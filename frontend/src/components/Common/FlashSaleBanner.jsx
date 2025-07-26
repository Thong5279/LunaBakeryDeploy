import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaFire, FaClock, FaTag, FaStar, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchActiveFlashSales } from '../../redux/slices/flashSaleSlice';

const FlashSaleBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeFlashSales, loading } = useSelector((state) => state.flashSale);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    console.log('🔥 FlashSaleBanner: Fetching active flash sales...');
    dispatch(fetchActiveFlashSales());
    
    // Cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const formatTimeRemaining = (endDate) => {
    const end = new Date(endDate);
    const diff = end - currentTime;
    
    console.log('🕐 Flash Sale Time Debug:', {
      endDate,
      end: end.toISOString(),
      currentTime: currentTime.toISOString(),
      diff,
      diffHours: diff / (1000 * 60 * 60),
      endLocal: end.toLocaleString('vi-VN'),
      currentLocal: currentTime.toLocaleString('vi-VN')
    });
    
    if (diff <= 0) return 'Đã kết thúc';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0) {
      if (typeof item.images[0] === 'string') {
        return item.images[0];
      } else if (item.images[0].url) {
        return item.images[0].url;
      }
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
  };

  // Lấy tối đa 6 sản phẩm nổi bật nhất (có % giảm cao nhất)
  const getFeaturedItems = () => {
    if (!activeFlashSales || activeFlashSales.length === 0) return [];
    
    const allItems = [];
    activeFlashSales.forEach(flashSale => {
      flashSale.products.forEach(product => {
        const discountPercent = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
        allItems.push({
          ...product,
          type: 'product',
          discountPercent,
          endDate: flashSale.endDate
        });
      });
      
      flashSale.ingredients.forEach(ingredient => {
        const discountPercent = Math.round(((ingredient.originalPrice - ingredient.salePrice) / ingredient.originalPrice) * 100);
        allItems.push({
          ...ingredient,
          type: 'ingredient',
          discountPercent,
          endDate: flashSale.endDate
        });
      });
    });
    
    // Sắp xếp theo % giảm cao nhất và lấy 6 sản phẩm đầu
    return allItems
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, 6);
  };

  const featuredItems = getFeaturedItems();

  // Tạo các ngôi sao và mặt trăng rơi
  const createFallingElements = () => {
    const elements = [];
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        type: Math.random() > 0.5 ? 'star' : 'moon',
        left: Math.random() * 100,
        animationDelay: Math.random() * 10,
        animationDuration: 3 + Math.random() * 4
      });
    }
    return elements;
  };

  const fallingElements = createFallingElements();

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white p-6 rounded-lg">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-lg font-medium">Đang tải Flash Sale...</span>
        </div>
      </div>
    );
  }

  console.log('🔥 FlashSaleBanner Debug:', {
    activeFlashSales: activeFlashSales?.length || 0,
    featuredItems: featuredItems?.length || 0,
    loading
  });

  if (!activeFlashSales || activeFlashSales.length === 0 || featuredItems.length === 0) {
    console.log('🔥 FlashSaleBanner: No active flash sales to display');
    return null;
  }

  return (
    <div className="relative w-full py-12 px-2 md:px-0 overflow-hidden">
      {/* Background gradient phù hợp với theme */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-pink-50/80 via-transparent to-pink-200/80" />
      
      {/* Ngôi sao và mặt trăng rơi */}
      {fallingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute z-1 ${
            element.type === 'star' ? 'text-yellow-400/70' : 'text-pink-300/70'
          }`}
          style={{
            left: `${element.left}%`,
            top: '-20px',
            fontSize: element.type === 'star' ? '1.5rem' : '1.2rem'
          }}
          animate={{
            y: ['0vh', '100vh'],
            rotate: element.type === 'star' ? [0, 360] : [0, -360],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: element.animationDuration,
            delay: element.animationDelay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {element.type === 'star' ? <FaStar /> : <FaMoon />}
        </motion.div>
      ))}

      {/* Overlay sparkle effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header với hiệu ứng nổi bật */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <FaFire className="text-3xl text-pink-500 drop-shadow-lg" />
            </motion.div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-pink-700 tracking-wide drop-shadow-lg flex items-center gap-2">
                <img src="https://i.pinimg.com/originals/6f/d3/43/6fd34383dcc18aa07775bf1f62af2ec1.gif" alt="Fire" className="w-15 h-15" />
                FLASH SALE
                <img src="https://i.pinimg.com/originals/ec/b3/45/ecb3455c4ab0058ec05769a7e9f93e49.gif" alt="Fire" className="w-15 h-15" />
              </h2>
              <p className="text-pink-600 text-sm md:text-base mt-1">
                Giảm giá cực sốc - Số lượng có hạn!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-end bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 border border-pink-200">
            <FaClock className="text-xl text-pink-500" />
            <span className="font-medium text-pink-700">Còn lại:</span>
            <motion.span 
              className="font-bold text-pink-600 text-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {formatTimeRemaining(activeFlashSales[0].endDate)}
            </motion.span>
          </div>
        </motion.div>

        {/* Grid sản phẩm flash sale - to hơn trên PC */}
        <div className="w-full pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6" style={{minWidth: '320px'}}>
            {featuredItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.type === 'product' ? item.productId._id : item.ingredientId._id}`}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)'
                }}
                className="bg-white rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center border-2 border-pink-200 hover:border-pink-400 group cursor-pointer transform hover:rotate-1 min-w-[220px] md:min-w-[240px] lg:min-w-[260px]"
                onClick={() => navigate(item.type === 'product' ? `/product/${item.productId._id}` : `/ingredient/${item.ingredientId._id}`)}
              >
                <div className="relative mb-4">
                  <img
                    src={getImageUrl(item.type === 'product' ? item.productId : item.ingredientId)}
                    alt={item.type === 'product' ? item.productId.name : item.ingredientId.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                  {/* Badge giảm giá với hiệu ứng */}
                  <motion.div 
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    -{item.discountPercent}%
                  </motion.div>
                </div>
                
                <h3 className="font-bold text-gray-900 text-sm md:text-base text-center line-clamp-2 mb-3 group-hover:text-pink-600 transition-colors duration-300 px-2">
                  {item.type === 'product' ? item.productId.name : item.ingredientId.name}
                </h3>
                
                <div className="flex items-center gap-2 justify-center mb-3">
                  <span className="text-gray-400 line-through text-xs md:text-sm">
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="text-pink-600 font-bold text-lg md:text-xl">
                    {formatPrice(item.salePrice)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 justify-center bg-pink-50 rounded-full px-3 py-1">
                  <FaTag className="text-pink-500 text-sm" />
                  <span className="text-pink-600 text-xs md:text-sm font-medium">
                    Tiết kiệm {formatPrice(item.originalPrice - item.salePrice)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nút xem tất cả với hiệu ứng */}
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 text-lg tracking-wide border-2 border-pink-400 hover:border-pink-500 transform hover:rotate-1"
            onClick={() => navigate('/flash-sale')}
          >
            🎉 Xem tất cả Flash Sale ({featuredItems.length}+ sản phẩm) 🎉
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner; 