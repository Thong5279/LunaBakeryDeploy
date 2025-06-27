import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { toast } from 'sonner';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const userString = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        console.error('Google OAuth error:', error);
        toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
        navigate('/login');
        return;
      }

      if (token && userString) {
        try {
          const user = JSON.parse(decodeURIComponent(userString));
          
          // Lưu token và user info vào localStorage
          localStorage.setItem('userToken', token);
          localStorage.setItem('userInfo', JSON.stringify(user));
          
          // Cập nhật Redux state sử dụng action creator
          dispatch(setUser(user));
          
          // Hiển thị thông báo thành công
          const message = user.role === 'admin' 
            ? '🎉 Chào mừng Admin! Đăng nhập Google thành công'
            : user.role === 'manager'
            ? '👨‍💼 Chào mừng Manager! Đăng nhập Google thành công'
            : '🍰 Chào mừng bạn trở lại Luna Bakery! Đăng nhập Google thành công';
          
          toast.success(message);
          
          // Navigate based on role
          setTimeout(() => {
            if (user.role === 'admin') {
              navigate('/admin');
            } else if (user.role === 'manager') {
              navigate('/manager');
            } else {
              navigate('/');
            }
          }, 1500);
          
        } catch (error) {
          console.error('Error parsing user data:', error);
          toast.error('Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.');
          navigate('/login');
        }
      } else {
        console.error('Missing token or user data');
        toast.error('Thiếu thông tin đăng nhập. Vui lòng thử lại.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Đang xử lý đăng nhập Google...</h2>
        <p className="text-gray-600 text-sm mb-4">Vui lòng đợi trong giây lát</p>
        <div className="flex justify-center items-center space-x-1">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback; 