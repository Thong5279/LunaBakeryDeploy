import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-pink-100 text-gray-800 py-10 mt-12 shadow-inner">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {/* Logo + mô tả */}
      <div>
        <h2 className="text-2xl font-bold text-pink-600">🎂 Luna Bakery</h2>
        <p className="mt-2 text-sm">
          Nơi những chiếc bánh kể câu chuyện ngọt ngào của bạn.
        </p>
      </div>
  
      {/* Liên kết nhanh */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Liên kết</h3>
        <ul className="space-y-1 text-sm">
          <li><a href="#" className="hover:text-pink-500">Trang chủ</a></li>
          <li><a href="#" className="hover:text-pink-500">Sản phẩm</a></li>
          <li><a href="#" className="hover:text-pink-500">Về chúng tôi</a></li>
          <li><a href="#" className="hover:text-pink-500">Liên hệ</a></li>
        </ul>
      </div>
  
      {/* Thông tin liên hệ */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Liên hệ</h3>
        <p className="text-sm">📍 123 Đường Bánh Ngọt, Quận Kem, TP. Ngọt Ngào</p>
        <p className="text-sm">📞 0123 456 789</p>
        <p className="text-sm">✉️ hello@lunabakery.vn</p>
      </div>
  
      {/* Mạng xã hội */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Kết nối</h3>
        <div className="flex space-x-3 mt-1">
          <a href="#" className="text-xl hover:text-pink-500">🌐</a>
          <a href="#" className="text-xl hover:text-pink-500">📸</a>
          <a href="#" className="text-xl hover:text-pink-500">📘</a>
        </div>
        <p className="text-xs mt-4">Made with ❤️ by Luna Team</p>
      </div>
    </div>
  
    {/* Dòng cuối */}
    <div className="text-center mt-8 text-sm text-gray-500">
      © {new Date().getFullYear()} Luna Bakery. All rights reserved.
    </div>
  </footer>
  
  )
}
