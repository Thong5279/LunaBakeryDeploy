import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaBox, 
  FaExclamationTriangle, 
  FaWarehouse, 
  FaChartBar, 
  FaArrowUp, 
  FaArrowDown, 
  FaClock, 
  FaCalendarAlt,
  FaTrophy,
  FaBan,
  FaBoxOpen
} from "react-icons/fa";
import { 
  fetchProductSales,
  fetchIngredientInventory
} from "../../redux/slices/analyticsSlice";

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    productSales,
    ingredientInventory
  } = useSelector((state) => state.analytics);

  // Time filter state
  const [activeTab, setActiveTab] = useState("products"); // products hoặc ingredients

  // Fetch data khi component mount
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "manager")) {
      dispatch(fetchProductSales());
      dispatch(fetchIngredientInventory());
    }
  }, [user, dispatch]);

  // Utility functions
  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number || 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Kiểm tra quyền truy cập
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có quyền truy cập
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Chỉ Admin và Manager mới có thể truy cập chức năng này.
          </p>
        </div>
      </div>
    );
  }

  const isLoading = productSales.loading || ingredientInventory.loading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span className="w-19 h-19 bg-pink-100 rounded-full flex items-center justify-center p-1">
            <img src="https://cdn-icons-gif.flaticon.com/19012/19012991.gif" alt="Thống kê nguyên liệu" className="w-18 h-18 object-cover rounded-full border-2 border-white shadow" />
          </span>
          Thống kê nguyên liệu và sản phẩm
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-700">
            Thống kê tồn kho và bán hàng
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "products"
                  ? "border-pink-500 text-pink-600 bg-pink-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🍰 Sản phẩm Bánh
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "ingredients"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🥄 Nguyên liệu
            </button>
          </nav>
        </div>
      </div>

      {/* Product Sales Tab */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Product Summary Cards */}
          {productSales.data && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Tổng số sản phẩm */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-600 text-sm font-medium mb-1">Tổng số sản phẩm</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{productSales.data.totalProducts}</p>
                    <p className="text-gray-500 text-sm mt-1">Sản phẩm</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center p-1">
                    <img src="https://cdn-icons-gif.flaticon.com/11188/11188746.gif" alt="Tổng số sản phẩm" className="w-14 h-14 object-cover rounded-full border-2 border-white shadow" />
                  </div>
                </div>
              </div>

              {/* Đã có bán */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium mb-1">Đã có bán</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{productSales.data.totalProductsSold}</p>
                    <p className="text-green-500 text-sm mt-1">Sản phẩm</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center p-1">
                    <img src="https://cdn-icons-gif.flaticon.com/15576/15576189.gif" alt="Đã có bán" className="w-14 h-14 object-cover rounded-full border-2 border-white shadow" />
                  </div>
                </div>
              </div>

              {/* Chưa bán được */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium mb-1">Chưa bán được</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{productSales.data.totalProductsNotSold}</p>
                    <p className="text-yellow-500 text-sm mt-1">Sản phẩm</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center p-1">
                    <img src="https://cdn-icons-gif.flaticon.com/15576/15576071.gif" alt="Chưa bán được" className="w-14 h-14 object-cover rounded-full border-2 border-white shadow" />
                  </div>
                </div>
              </div>

              {/* Tỷ lệ bán được */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium mb-1">Tỷ lệ bán được</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{productSales.data.totalProducts > 0 
                        ? Math.round((productSales.data.totalProductsSold / productSales.data.totalProducts) * 100)
                        : 0}%</p>
                    <p className="text-blue-500 text-sm mt-1">Tỷ lệ</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center p-1">
                    <img src="https://cdn-icons-gif.flaticon.com/11679/11679193.gif" alt="Tỷ lệ bán được" className="w-14 h-14 object-cover rounded-full border-2 border-white shadow" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Best Sellers */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaTrophy className="text-green-500 mr-2" />
                  Bán chạy nhất
                </h3>
                <p className="text-sm text-gray-600 mt-1">Sản phẩm có doanh số cao</p>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {productSales.data?.bestSellers?.length > 0 ? (
                    productSales.data.bestSellers.map((product, index) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{product.totalQuantitySold} cái</p>
                          <p className="text-sm text-gray-600">{formatCurrency(product.totalRevenue)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaTrophy className="text-gray-300 text-4xl mb-4 mx-auto" />
                      <p className="text-gray-500">Chưa có sản phẩm nào được bán</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Worst Sellers */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaExclamationTriangle className="text-orange-500 mr-2" />
                  Bán ít nhất
                </h3>
                <p className="text-sm text-gray-600 mt-1">Cần cải thiện marketing</p>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {productSales.data?.worstSellers?.length > 0 ? (
                    productSales.data.worstSellers.map((product, index) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">{product.totalQuantitySold} cái</p>
                          <p className="text-sm text-gray-600">{formatCurrency(product.totalRevenue)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaExclamationTriangle className="text-gray-300 text-4xl mb-4 mx-auto" />
                      <p className="text-gray-500">Tất cả sản phẩm đều bán tốt!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Zero Sellers */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaBan className="text-red-500 mr-2" />
                  Chưa bán được
                </h3>
                <p className="text-sm text-gray-600 mt-1">Cần xem xét lại</p>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {productSales.data?.zeroSellers?.length > 0 ? (
                    productSales.data.zeroSellers.map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">0 cái</p>
                          <p className="text-xs text-gray-500">Cần xem xét</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaTrophy className="text-green-400 text-4xl mb-4 mx-auto" />
                      <p className="text-green-600 font-medium">Tuyệt vời!</p>
                      <p className="text-gray-500">Tất cả sản phẩm đều có bán</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ingredients Tab */}
      {activeTab === "ingredients" && (
        <div className="space-y-6">
          {/* Ingredient Summary Cards */}
          {ingredientInventory.data && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <FaBox className="text-blue-500 text-2xl mb-2 mx-auto" />
                <div className="text-2xl font-bold text-blue-600">
                  {ingredientInventory.data.summary.totalIngredients}
                </div>
                <div className="text-sm text-gray-600">Tổng nguyên liệu</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <FaArrowUp className="text-green-500 text-2xl mb-2 mx-auto" />
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(ingredientInventory.data.summary.totalInboundQuantity)}
                </div>
                <div className="text-sm text-gray-600">Tổng nhập</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <FaArrowDown className="text-orange-500 text-2xl mb-2 mx-auto" />
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(ingredientInventory.data.summary.totalOutboundQuantity)}
                </div>
                <div className="text-sm text-gray-600">Tổng bán</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <FaWarehouse className="text-purple-500 text-2xl mb-2 mx-auto" />
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(ingredientInventory.data.summary.totalCurrentStock)}
                </div>
                <div className="text-sm text-gray-600">Tồn kho hiện tại</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <FaExclamationTriangle className="text-red-500 text-2xl mb-2 mx-auto" />
                <div className="text-2xl font-bold text-red-600">
                  {ingredientInventory.data.summary.lowStockCount}
                </div>
                <div className="text-sm text-gray-600">Sắp hết hàng</div>
              </div>
            </div>
          )}

          {/* Ingredient Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Input */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaArrowUp className="text-blue-500 mr-2" />
                  Nhập nhiều nhất
                </h3>
                <p className="text-sm text-gray-600 mt-1">Top nguyên liệu nhập kho</p>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {ingredientInventory.data?.topInput?.length > 0 ? (
                    ingredientInventory.data.topInput.map((ingredient, index) => (
                      <div key={ingredient._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{ingredient.name}</p>
                            <p className="text-sm text-gray-600">{ingredient.supplier || 'Nhà cung cấp chưa rõ'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{formatNumber(ingredient.totalQuantityIn)}</p>
                          <p className="text-sm text-gray-600">{ingredient.inboundTransactions} lần nhập</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaBoxOpen className="text-gray-300 text-4xl mb-4 mx-auto" />
                      <p className="text-gray-500">Chưa có lịch sử nhập kho</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Top Output */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaArrowDown className="text-green-500 mr-2" />
                  Bán nhiều nhất
                </h3>
                <p className="text-sm text-gray-600 mt-1">Nguyên liệu hot</p>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {ingredientInventory.data?.topOutput?.length > 0 ? (
                    ingredientInventory.data.topOutput.map((ingredient, index) => (
                      <div key={ingredient._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{ingredient.name}</p>
                            <p className="text-sm text-gray-600">{ingredient.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatNumber(ingredient.totalQuantitySold)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(ingredient.totalRevenue)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaBoxOpen className="text-gray-300 text-4xl mb-4 mx-auto" />
                      <p className="text-gray-500">Chưa có nguyên liệu nào được bán</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                  Sắp hết hàng
                </h3>
                <p className="text-sm text-gray-600 mt-1">Cần nhập thêm ngay</p>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {ingredientInventory.data?.lowStock?.length > 0 ? (
                    ingredientInventory.data.lowStock.map((ingredient) => (
                      <div key={ingredient._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <div>
                          <p className="font-medium text-gray-900">{ingredient.name}</p>
                          <p className="text-sm text-gray-600">{ingredient.supplier || 'Chưa có nhà cung cấp'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{formatNumber(ingredient.currentStock)}</p>
                          <p className="text-xs text-red-500">Cần nhập thêm!</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaTrophy className="text-green-400 text-4xl mb-4 mx-auto" />
                      <p className="text-green-600 font-medium">Tuyệt vời!</p>
                      <p className="text-gray-500">Tất cả nguyên liệu đều đủ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(productSales.error || ingredientInventory.error) && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">Lỗi:</p>
          <ul className="list-disc list-inside mt-2">
            {productSales.error && <li>{productSales.error}</li>}
            {ingredientInventory.error && <li>{ingredientInventory.error}</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
