import React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const Topbar = () => {
  return (
    <div className="bg-[#a37ba3] text-white text-xs sm:text-sm py-2">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Bên trái: Social icons */}
        <div className="flex items-center gap-3 order-1 md:order-1">
          <a href="https://www.facebook.com/pham.huynh.thong.2025/" className="hover:text-gray-200" title="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-gray-200" title="Zalo">
            <SiZalo />
          </a>
          <a href="#" className="hover:text-gray-200" title="Instagram">
            <FaInstagram />
          </a>
        </div>

        {/* Chính giữa: Slogan */}
        <div className="text-center font-medium order-3 md:order-2 text-[11px] sm:text-sm">
          <span className="hidden sm:inline">
            🎂 Ngọt ngào trong từng chiếc bánh - Gửi trọn yêu thương từ Luna 🎉
          </span>
          <span className="sm:hidden">🎂 Gửi yêu thương từ Luna</span>
        </div>

        {/* Bên phải: Info */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 order-2 md:order-3 text-[11px] sm:text-sm">
          <span className="whitespace-nowrap">☎ 0987 654 321</span>
          <span className="hidden sm:inline">✉ luna@bakery.com</span>
          <span className="hidden sm:inline">🕒 08:00 - 21:00</span>
        </div>

      </div>
    </div>
  );
};

export default Topbar;
