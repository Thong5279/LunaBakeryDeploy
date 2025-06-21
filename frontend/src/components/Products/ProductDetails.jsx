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

  const idToFetch = productId || routeID;

  useEffect(() => {
    if (idToFetch && idToFetch !== "undefined") {
      console.log("✅ Đang fetch bằng ID:", idToFetch);
      dispatch(fetchProductDetails(idToFetch));
      dispatch(fetchSimilarProducts({ id: idToFetch }));
    }
  }, [idToFetch, dispatch]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "plus" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedFlavor) {
      toast.error("Vui lòng chọn kích thước và hương vị.");
      return;
    }

    setButtonDisabled(true);
    dispatch(
      addToCart({
        productId: idToFetch,
        quantity,
        size: selectedSize,
        flavor: selectedFlavor,
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
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
            <div className="flex gap-3 overflow-x-auto">
              {selectedProduct.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setMainImage(img.url)}
                  className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                    mainImage === img.url ? "border-pink-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thông tin */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl font-bold text-pink-600">{selectedProduct.name}</h1>

            <div className="space-y-1">
              <p className="line-through text-gray-400">
                {selectedProduct.originalPrice?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </p>
              <p className="text-2xl text-pink-500 font-semibold">
                {selectedProduct.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </p>
            </div>

            <p className="text-gray-600">{selectedProduct.description}</p>

            <div>
              <p className="font-semibold text-pink-500 mb-2">Kích thước:</p>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.sizes.map((s) => (
                  <button
                    key={s}
                    className={`px-4 py-1 rounded-full ${
                      selectedSize === s ? "bg-pink-200 border-2 border-pink-500" : "bg-gray-100"
                    }`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s} cm
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-pink-500 mb-2">Hương vị:</p>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.flavors.map((f) => (
                  <button
                    key={f}
                    className={`px-4 py-1 rounded-full ${
                      selectedFlavor === f ? "bg-pink-200 border-2 border-pink-500" : "bg-gray-100"
                    }`}
                    onClick={() => setSelectedFlavor(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => handleQuantityChange("minus")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange("plus")}>+</button>
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
