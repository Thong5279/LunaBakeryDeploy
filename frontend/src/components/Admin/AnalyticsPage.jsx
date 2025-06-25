import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRevenue,
  fetchSummary,
  fetchOrderStatus,
  setPeriod,
  clearAnalyticsError,
} from "../../redux/slices/analyticsSlice";
import {
  FaDollarSign,
  FaShoppingCart,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaArrowUp,
  FaChartPie,
  FaUsers,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const {
    revenue,
    summary,
    orderStatus,
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchRevenue({ period: selectedPeriod, year: selectedYear }));
    dispatch(fetchOrderStatus());
  }, [dispatch, selectedPeriod, selectedYear]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    dispatch(setPeriod(period));
    dispatch(fetchRevenue({ period, year: selectedYear }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getRevenueLabel = (item) => {
    const { _id } = item;
    switch (selectedPeriod) {
      case "day":
        return `${_id.day}/${_id.month}/${_id.year}`;
      case "week":
        return `Tuần ${_id.week}/${_id.year}`;
      case "month":
        return `Tháng ${_id.month}/${_id.year}`;
      case "quarter":
        return `Quý ${_id.quarter}/${_id.year}`;
      case "year":
        return `Năm ${_id.year}`;
      default:
        return `${_id.month}/${_id.year}`;
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      Processing: "Đang xử lý",
      Shipped: "Đã gửi",
      Delivered: "Đã giao",
      Cancelled: "Đã hủy"
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      Processing: "bg-yellow-100 text-yellow-800",
      Shipped: "bg-blue-100 text-blue-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Tạo data cho biểu đồ doanh thu
  const createRevenueChartData = () => {
    if (!revenue.data || revenue.data.length === 0) return null;

    const labels = revenue.data.map(item => getRevenueLabel(item));
    const revenueData = revenue.data.map(item => item.totalRevenue);
    const orderCountData = revenue.data.map(item => item.orderCount);

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu (VND)',
          data: revenueData,
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 2,
          yAxisID: 'y',
        },
        {
          label: 'Số đơn hàng',
          data: orderCountData,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          yAxisID: 'y1',
        },
      ],
    };
  };

  // Tạo data cho biểu đồ trạng thái đơn hàng
  const createOrderStatusChartData = () => {
    if (!orderStatus.data || orderStatus.data.length === 0) return null;

    const labels = orderStatus.data.map(item => getStatusLabel(item._id));
    const data = orderStatus.data.map(item => item.count);
    const backgroundColors = [
      'rgba(251, 191, 36, 0.8)',  // Processing - Yellow
      'rgba(59, 130, 246, 0.8)',  // Shipped - Blue  
      'rgba(34, 197, 94, 0.8)',   // Delivered - Green
      'rgba(239, 68, 68, 0.8)',   // Cancelled - Red
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    };
  };

  // Tạo data cho biểu đồ line revenue theo ngày
  const createRevenueLineChartData = () => {
    if (!revenue.data || revenue.data.length === 0) return null;

    const labels = revenue.data.map(item => getRevenueLabel(item));
    const data = revenue.data.map(item => item.totalRevenue);

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data,
          borderColor: 'rgba(236, 72, 153, 1)',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(236, 72, 153, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    };
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Doanh thu và Số đơn hàng',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} VND`;
            } else {
              return `Đơn hàng: ${context.parsed.y} đơn`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Thời gian',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Doanh thu (VND)',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN');
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Số đơn hàng',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Phân bổ trạng thái đơn hàng',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} đơn (${percentage}%)`;
          }
        }
      }
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Xu hướng doanh thu',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} VND`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Thời gian',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Doanh thu (VND)',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN');
          }
        }
      },
    },
  };

  if (summary.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bảng điều khiển thống kê
        </h1>
        <p className="text-gray-600">
          Theo dõi doanh thu và hiệu suất kinh doanh của Luna Bakery
        </p>
      </div>

      {/* Summary Cards */}
      {summary.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu hôm nay</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.data.summary.today.revenue)}
                </p>
                <p className="text-sm text-gray-500">
                  {summary.data.summary.today.orders} đơn hàng
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <FaCalendarDay className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu tháng này</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summary.data.summary.month.revenue)}
                </p>
                <p className="text-sm text-gray-500">
                  {summary.data.summary.month.orders} đơn hàng
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu năm nay</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(summary.data.summary.year.revenue)}
                </p>
                <p className="text-sm text-gray-500">
                  {summary.data.summary.year.orders} đơn hàng
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <FaArrowUp className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ Doanh thu & Đơn hàng</h3>
          <div className="h-80">
            {revenue.loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : createRevenueChartData() ? (
              <Bar data={createRevenueChartData()} options={barChartOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FaChartPie className="text-gray-300 text-6xl mb-4" />
                <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Doughnut Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bổ Trạng thái Đơn hàng</h3>
          <div className="h-80">
            {orderStatus.loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : createOrderStatusChartData() ? (
              <Doughnut data={createOrderStatusChartData()} options={doughnutOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FaChartPie className="text-gray-300 text-6xl mb-4" />
                <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Trend Line Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng Doanh thu</h3>
        <div className="h-80">
          {revenue.loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : createRevenueLineChartData() ? (
            <Line data={createRevenueLineChartData()} options={lineChartOptions} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FaChartPie className="text-gray-300 text-6xl mb-4" />
              <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Biểu đồ doanh thu
            </h2>
            <div className="flex gap-2">
              {["day", "week", "month", "quarter", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {period === "day" && "Ngày"}
                  {period === "week" && "Tuần"}
                  {period === "month" && "Tháng"}
                  {period === "quarter" && "Quý"}
                  {period === "year" && "Năm"}
                </button>
              ))}
            </div>
          </div>

          {revenue.loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {revenue.data.length > 0 ? (
                revenue.data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {getRevenueLabel(item)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.orderCount} đơn hàng
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(item.totalRevenue)}
                      </p>
                      <p className="text-sm text-gray-600">
                        TB: {formatCurrency(item.averageOrderValue)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Không có dữ liệu cho khoảng thời gian này
                </p>
              )}
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Phân bổ trạng thái đơn hàng
          </h2>
          
          {orderStatus.loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {orderStatus.data.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status._id)}`}>
                      {getStatusLabel(status._id)}
                    </span>
                    <span className="font-medium text-gray-900">
                      {status.count} đơn
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(status.totalValue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products and Recent Orders */}
      {summary.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Sản phẩm bán chạy
            </h2>
            <div className="space-y-3">
              {summary.data.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product._id}</p>
                    <p className="text-sm text-gray-600">
                      Đã bán: {product.totalSold} sản phẩm
                    </p>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Đơn hàng gần đây
            </h2>
            <div className="space-y-3">
              {summary.data.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.user?.name || 'Khách vãng lai'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(revenue.error || summary.error || orderStatus.error) && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">Lỗi:</p>
          <ul className="list-disc list-inside mt-2">
            {revenue.error && <li>{revenue.error}</li>}
            {summary.error && <li>{summary.error}</li>}
            {orderStatus.error && <li>{orderStatus.error}</li>}
          </ul>
          <button
            onClick={() => dispatch(clearAnalyticsError())}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage; 