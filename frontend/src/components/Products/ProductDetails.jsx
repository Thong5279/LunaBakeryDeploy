import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "./ProductGrid";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id: routeID } = useParams();
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
      setMainImage("https://via.placeholder.com/500x500?text=No+Image");
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
  if (error) return <div className="text-center text-red-500 py-10">Lỗi: {error}</div>;

  return selectedProduct ? (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
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
                      src={img?.url || "https://via.placeholder.com/80x80?text=No+Image"}
                      onClick={() => setMainImage(img?.url || "https://via.placeholder.com/500x500?text=No+Image")}
                      className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-transform duration-300 group-hover:scale-110 ${
                        mainImage === (img?.url || "https://via.placeholder.com/500x500?text=No+Image") ? "border-pink-500" : "border-gray-300"
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

            {/* Hiển thị giá - chỉ 1 giá duy nhất */}
            <div className="space-y-1">
              <p className="text-3xl text-pink-500 font-bold">
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
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        selectedSize === s 
                          ? "bg-pink-500 text-white border-pink-500 shadow-lg" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-pink-300"
                      }`}
                      onClick={() => handleSizeChange(s)}
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
                      className={`px-4 py-1 rounded-full ${
                        selectedFlavor === f ? "bg-pink-200 border-2 border-pink-500" : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedFlavor(f)}
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
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                -
              </button>
              <span className="px-4 py-1 border rounded">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange("plus")}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                +
              </button>
            </div>

            <motion.button
              onClick={handleAddToCart}
              disabled={buttonDisabled}
              whileTap={{ scale: 0.95 }}
              className={`bg-pink-500 text-white px-6 py-3 rounded-full w-full font-semibold transition ${
                buttonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-600"
              }`}
            >
              <FaShoppingCart className="inline mr-2" />
              Thêm vào giỏ hàng
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
