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
  FaChartPie,
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
import { Bar, Doughnut } from 'react-chartjs-2';

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

const ManagerAnalytics = () => {
  const dispatch = useDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { revenue, summary, orderStatus } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchRevenue({ period: selectedPeriod, year: new Date().getFullYear() }));
    dispatch(fetchOrderStatus());
  }, [dispatch, selectedPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    dispatch(setPeriod(period));
    dispatch(fetchRevenue({ period, year: new Date().getFullYear() }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  // Chart data
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

  const createOrderStatusChartData = () => {
    if (!orderStatus.data || orderStatus.data.length === 0) return null;
    const labels = orderStatus.data.map(item => item._id);
    const data = orderStatus.data.map(item => item.count);
    const backgroundColors = [
      'rgba(251, 191, 36, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(147, 51, 234, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(99, 102, 241, 0.8)',
      'rgba(156, 163, 175, 0.8)',
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

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { padding: 20, usePointStyle: true } },
      title: { display: true, text: 'Doanh thu & Đơn hàng', font: { size: 16, weight: 'bold' }, padding: 20 },
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
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: { display: true, title: { display: true, text: 'Thời gian', font: { weight: 'bold' } }, grid: { display: false } },
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Doanh thu (VND)', font: { weight: 'bold' } }, ticks: { callback: value => value.toLocaleString('vi-VN') } },
      y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Số đơn hàng', font: { weight: 'bold' } }, grid: { drawOnChartArea: false } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
      title: { display: true, text: 'Phân bổ trạng thái đơn hàng', font: { size: 16, weight: 'bold' }, padding: 20 },
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

  if (summary.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Thống kê kinh doanh
        </h1>
        <p className="text-gray-600">
          Theo dõi doanh thu và hiệu suất kinh doanh của Luna Bakery (Quản lý)
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
      {/* Top Products */}
      {summary.data && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            🏆 Top sản phẩm bán chạy
          </h2>
          <div className="space-y-3">
            {summary.data.topProducts && summary.data.topProducts.length > 0 ? (
              summary.data.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-pink-500 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{product._id}</p>
                      <p className="text-sm text-gray-600">
                        Đã bán: {product.totalSold} sản phẩm
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Chưa có dữ liệu sản phẩm
              </p>
            )}
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

export default ManagerAnalytics; 