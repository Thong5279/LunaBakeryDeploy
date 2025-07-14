// Utility functions cho Flash Sale
import { useSelector } from 'react-redux';

// Lấy active flash sales từ Redux store
export const getActiveFlashSales = (state) => {
  return state.flashSale.activeFlashSales || [];
};

// Tính toán giá hiển thị cho sản phẩm có flash sale
export const calculateProductDisplayPrice = (product, activeFlashSales = [], selectedSize = null) => {
  if (!product || !activeFlashSales || activeFlashSales.length === 0) {
    // Không có flash sale, tính giá theo size
    let basePrice = product?.discountPrice || product?.price || 0;
    
    if (product?.sizePricing && selectedSize) {
      const sizePrice = product.sizePricing.find(sp => sp.size === selectedSize);
      if (sizePrice) {
        basePrice = sizePrice.discountPrice || sizePrice.price;
      }
    }
    
    return {
      displayPrice: basePrice,
      originalPrice: product?.price || 0,
      isFlashSale: false,
      discountPercent: 0,
      flashSaleInfo: null
    };
  }

  // Tìm flash sale cho sản phẩm này
  for (const flashSale of activeFlashSales) {
    if (flashSale.status === 'active' && flashSale.products) {
      const flashSaleProduct = flashSale.products.find(fp => 
        fp.productId._id === product._id || fp.productId === product._id
      );
      
      if (flashSaleProduct && flashSaleProduct.soldQuantity < flashSaleProduct.quantity) {
        // Có flash sale cho sản phẩm này
        let displayPrice = flashSaleProduct.salePrice;
        
        // Nếu có size được chọn, tính giá flash sale dựa trên giá size
        if (product.sizePricing && selectedSize) {
          const sizePrice = product.sizePricing.find(sp => sp.size === selectedSize);
          if (sizePrice) {
            const sizeBasePrice = sizePrice.discountPrice || sizePrice.price;
            // Tính % giảm giá từ flash sale và áp dụng cho giá size
            const discountPercent = (flashSaleProduct.originalPrice - flashSaleProduct.salePrice) / flashSaleProduct.originalPrice;
            displayPrice = Math.round(sizeBasePrice * (1 - discountPercent));
          }
        }
        
        const discountPercent = Math.round(
          ((flashSaleProduct.originalPrice - flashSaleProduct.salePrice) / flashSaleProduct.originalPrice) * 100
        );
        
        return {
          displayPrice,
          originalPrice: flashSaleProduct.originalPrice,
          isFlashSale: true,
          discountPercent,
          flashSaleInfo: {
            id: flashSale._id,
            endDate: flashSale.endDate,
            remainingQuantity: flashSaleProduct.quantity - flashSaleProduct.soldQuantity
          }
        };
      }
    }
  }

  // Không có flash sale, tính giá theo size
  let basePrice = product?.discountPrice || product?.price || 0;
  
  if (product?.sizePricing && selectedSize) {
    const sizePrice = product.sizePricing.find(sp => sp.size === selectedSize);
    if (sizePrice) {
      basePrice = sizePrice.discountPrice || sizePrice.price;
    }
  }
  
  return {
    displayPrice: basePrice,
    originalPrice: product?.price || 0,
    isFlashSale: false,
    discountPercent: 0,
    flashSaleInfo: null
  };
};

// Tính toán giá hiển thị cho nguyên liệu có flash sale
export const calculateIngredientDisplayPrice = (ingredient, activeFlashSales = []) => {
  if (!ingredient || !activeFlashSales || activeFlashSales.length === 0) {
    return {
      displayPrice: ingredient?.discountPrice || ingredient?.price || 0,
      originalPrice: ingredient?.price || 0,
      isFlashSale: false,
      discountPercent: 0,
      flashSaleInfo: null
    };
  }

  // Tìm flash sale cho nguyên liệu này
  for (const flashSale of activeFlashSales) {
    if (flashSale.status === 'active' && flashSale.ingredients) {
      const flashSaleIngredient = flashSale.ingredients.find(fi => 
        fi.ingredientId._id === ingredient._id || fi.ingredientId === ingredient._id
      );
      
      if (flashSaleIngredient && flashSaleIngredient.soldQuantity < flashSaleIngredient.quantity) {
        // Có flash sale cho nguyên liệu này
        const discountPercent = Math.round(
          ((flashSaleIngredient.originalPrice - flashSaleIngredient.salePrice) / flashSaleIngredient.originalPrice) * 100
        );
        
        return {
          displayPrice: flashSaleIngredient.salePrice,
          originalPrice: flashSaleIngredient.originalPrice,
          isFlashSale: true,
          discountPercent,
          flashSaleInfo: {
            id: flashSale._id,
            endDate: flashSale.endDate,
            remainingQuantity: flashSaleIngredient.quantity - flashSaleIngredient.soldQuantity
          }
        };
      }
    }
  }

  // Không có flash sale, trả về giá thường
  return {
    displayPrice: ingredient?.discountPrice || ingredient?.price || 0,
    originalPrice: ingredient?.price || 0,
    isFlashSale: false,
    discountPercent: 0,
    flashSaleInfo: null
  };
};

// Hook để lấy giá flash sale cho sản phẩm
export const useProductFlashSalePrice = (product, selectedSize = null) => {
  const activeFlashSales = useSelector(state => state.flashSale.activeFlashSales || []);
  return calculateProductDisplayPrice(product, activeFlashSales, selectedSize);
};

// Hook để lấy giá flash sale cho nguyên liệu
export const useIngredientFlashSalePrice = (ingredient) => {
  const activeFlashSales = useSelector(state => state.flashSale.activeFlashSales || []);
  return calculateIngredientDisplayPrice(ingredient, activeFlashSales);
};

// Format giá tiền
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
};

// Kiểm tra flash sale có còn hoạt động không
export const isFlashSaleActive = (flashSale) => {
  if (!flashSale) return false;
  
  const now = new Date();
  const startDate = new Date(flashSale.startDate);
  const endDate = new Date(flashSale.endDate);
  
  return now >= startDate && now <= endDate && flashSale.status === 'active';
};

// Tính thời gian còn lại của flash sale
export const getTimeRemaining = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;
  
  if (diff <= 0) return 'Đã kết thúc';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}; 