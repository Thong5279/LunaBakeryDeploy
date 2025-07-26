import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlashSaleDebug = () => {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/flash-sales/test/debug`);
      setDebugData(response.data);
      console.log('🔧 Flash Sale Debug Data:', response.data);
    } catch (error) {
      console.error('❌ Debug error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  if (loading) {
    return <div className="p-4">Đang tải debug data...</div>;
  }

  if (!debugData) {
    return <div className="p-4">Không có debug data</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      iso: date.toISOString(),
      local: date.toLocaleString('vi-VN'),
      utc: date.toUTCString()
    };
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Flash Sale Debug</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Thông tin hiện tại:</h3>
        <p><strong>Thời gian hiện tại (Server):</strong> {debugData.currentTime}</p>
        <p><strong>Thời gian hiện tại (Local):</strong> {new Date().toLocaleString('vi-VN')}</p>
        <p><strong>Timezone Offset:</strong> {new Date().getTimezoneOffset()} phút</p>
        <p><strong>Tổng số Flash Sales:</strong> {debugData.totalFlashSales}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Danh sách Flash Sales:</h3>
        {debugData.flashSales.map((fs, index) => {
          const startDateInfo = formatDate(fs.startDate);
          const endDateInfo = formatDate(fs.endDate);
          
          return (
            <div key={fs.id} className="border p-4 mb-2 rounded">
              <h4 className="font-semibold">{fs.name}</h4>
              <p><strong>ID:</strong> {fs.id}</p>
              <p><strong>Start Date (ISO):</strong> {startDateInfo.iso}</p>
              <p><strong>Start Date (Local):</strong> {startDateInfo.local}</p>
              <p><strong>End Date (ISO):</strong> {endDateInfo.iso}</p>
              <p><strong>End Date (Local):</strong> {endDateInfo.local}</p>
              <p><strong>Status:</strong> {fs.status}</p>
              <p><strong>Is Active:</strong> {fs.isActive ? 'Yes' : 'No'}</p>
              <p><strong>Products:</strong> {fs.productsCount}</p>
              <p><strong>Ingredients:</strong> {fs.ingredientsCount}</p>
              <p><strong>Is Currently Active:</strong> {fs.isCurrentlyActive ? 'Yes' : 'No'}</p>
            </div>
          );
        })}
      </div>

      <button 
        onClick={fetchDebugData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh Debug Data
      </button>
    </div>
  );
};

export default FlashSaleDebug; 