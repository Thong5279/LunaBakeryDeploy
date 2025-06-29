import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBox, FaExclamationTriangle, FaWarehouse, FaChartBar, FaArrowUp, FaArrowDown, FaClock, FaCalendarAlt } from "react-icons/fa";
import { 
  fetchInventoryStatistics,
  fetchAlerts
} from "../../redux/slices/inventorySlice";

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    statistics = {},
    alerts = [],
    loading = false,
    error = null
  } = useSelector((state) => state.inventory) || {};

  // Time filter state
  const [timeFilter, setTimeFilter] = useState({
    period: "month", // month, quarter, year
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    quarter: Math.ceil((new Date().getMonth() + 1) / 3)
  });

  // Fetch data khi component mount hoặc time filter thay đổi
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "manager")) {
      dispatch(fetchInventoryStatistics(timeFilter));
      dispatch(fetchAlerts());
    }
  }, [user, dispatch, timeFilter]);

  // Handle time filter changes
  const handleTimeFilterChange = (filterType, value) => {
    setTimeFilter(prev => ({ ...prev, [filterType]: value }));
  };

  // Utility functions
  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number || 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price || 0) + " đ";
  };

  const getTimePeriodText = () => {
    switch (timeFilter.period) {
      case "month":
        return `Tháng ${timeFilter.month}/${timeFilter.year}`;
      case "quarter":
        return `Quý ${timeFilter.quarter}/${timeFilter.year}`;
      case "year":
        return `Năm ${timeFilter.year}`;
      default:
        return "";
    }
  };

  // Mock data for demo (trong thực tế sẽ từ API)
  const mockAnalytics = {
    ingredientsImported: 1250,
    ingredientsSold: 980,
    newCakeTypes: 8,
    cakesSold: 2340,
    slowMovingIngredients: [
      { name: "Bột mì đặc biệt", daysOld: 45, quantity: 20 },
      { name: "Tinh dầu vani", daysOld: 38, quantity: 15 },
      { name: "Socola đen 85%", daysOld: 32, quantity: 8 }
    ],
    slowMovingCakes: [
      { name: "Bánh Red Velvet", daysOld: 25, quantity: 5 },
      { name: "Bánh Matcha Tiramisu", daysOld: 18, quantity: 3 },
      { name: "Bánh Lavender", daysOld: 15, quantity: 7 }
    ]
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

  if (loading) {
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
        <h1 className="text-2xl font-bold text-gray-900">
          Báo cáo kho hàng
        </h1>
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-pink-500" />
          <span className="text-lg font-medium text-gray-700">
            {getTimePeriodText()}
          </span>
        </div>
      </div>

      {/* Time Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Period Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kỳ báo cáo
            </label>
            <select
              value={timeFilter.period}
              onChange={(e) => handleTimeFilterChange('period', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
              <option value="year">Theo năm</option>
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm
            </label>
            <select
              value={timeFilter.year}
              onChange={(e) => handleTimeFilterChange('year', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Month Selector (if period is month) */}
          {timeFilter.period === "month" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tháng
              </label>
              <select
                value={timeFilter.month}
                onChange={(e) => handleTimeFilterChange('month', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>Tháng {month}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quarter Selector (if period is quarter) */}
          {timeFilter.period === "quarter" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quý
              </label>
              <select
                value={timeFilter.quarter}
                onChange={(e) => handleTimeFilterChange('quarter', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value={1}>Quý 1</option>
                <option value={2}>Quý 2</option>
                <option value={3}>Quý 3</option>
                <option value={4}>Quý 4</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaArrowUp className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Nguyên liệu nhập</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(mockAnalytics.ingredientsImported)}
              </p>
              <p className="text-xs text-gray-500">kg/lít</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaArrowDown className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Nguyên liệu xuất</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(mockAnalytics.ingredientsSold)}
              </p>
              <p className="text-xs text-gray-500">kg/lít</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaBox className="text-purple-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Loại bánh mới</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(mockAnalytics.newCakeTypes)}
              </p>
              <p className="text-xs text-gray-500">loại</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaChartBar className="text-pink-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Bánh đã bán</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(mockAnalytics.cakesSold)}
              </p>
              <p className="text-xs text-gray-500">cái</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaWarehouse className="text-pink-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof statistics.totalItems === 'number' ? statistics.totalItems : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Sắp hết hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof statistics.lowStockItems === 'number' ? statistics.lowStockItems : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaClock className="text-red-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Tồn kho lâu</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof statistics.slowMovingItems === 'number' ? statistics.slowMovingItems : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaBox className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-600">Tổng giá trị</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof statistics.totalValue === 'number' 
                  ? statistics.totalValue.toLocaleString('vi-VN') + ' đ'
                  : '0 đ'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {Array.isArray(alerts) && alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-red-800 mb-3">
            🚨 Cảnh báo ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert, index) => (
              <div key={`alert-${index}`} className="text-sm text-red-700">
                • {typeof alert === 'string' ? alert : 
                   typeof alert === 'object' && alert?.message ? alert.message : 
                   `Alert ${index + 1}`}
              </div>
            ))}
            {alerts.length > 5 && (
              <div className="text-sm text-red-600">
                ... và {alerts.length - 5} cảnh báo khác
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slow Moving Items Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slow Moving Ingredients */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaClock className="text-orange-500 mr-2" />
              Nguyên liệu tồn kho lâu
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalytics.slowMovingIngredients.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      {item.daysOld} ngày
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slow Moving Cakes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaClock className="text-red-500 mr-2" />
              Bánh tồn kho lâu
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalytics.slowMovingCakes.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {item.daysOld} ngày
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
