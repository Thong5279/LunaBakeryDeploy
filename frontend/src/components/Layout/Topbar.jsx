import React from 'react'
import { FaFacebookF, FaInstagram, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

// Component phân cách đẹp, tự ẩn trên mobile
const Divider = () => (
  <span
    className="mx-2 text-gray-400 select-none opacity-60 sm:inline hidden transition-opacity duration-200"
    aria-hidden="true"
  >
    |
  </span>
)

const Topbar = () => {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 text-gray-600 text-xs sm:text-sm py-3 border-b border-pink-200 shadow-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Bên trái: Social icons */}
        <div className="flex items-center gap-3 order-1 md:order-1">
          <a 
            href="https://www.facebook.com/pham.huynh.thong.2025/" 
            className="text-gray-600 hover:text-pink-600 hover:scale-110 transition-all duration-200 p-1.5 rounded-full hover:bg-white/60" 
            title="Facebook"
          >
            <FaFacebookF className="text-sm" />
          </a>
          <Divider />
          <a 
            href="https://chat.zalo.me/" 
            className="text-gray-600 hover:text-pink-600 hover:scale-110 transition-all duration-200 p-1.5 rounded-full hover:bg-white/60" 
            title="Zalo"
          >
            <SiZalo className="text-sm" />
          </a>
          <Divider />
          <a 
            href="https://www.instagram.com/thongpham.huynh/" 
            className="text-gray-600 hover:text-pink-600 hover:scale-110 transition-all duration-200 p-1.5 rounded-full hover:bg-white/60" 
            title="Instagram"
          >
            <FaInstagram className="text-sm" />
          </a>
        </div>

        {/* Chính giữa: Slogan */}
        <div className="text-center font-medium order-3 md:order-2 text-[11px] sm:text-sm">
          <span className="hidden sm:inline text-pink-600 font-semibold">
            🎂 Ngọt ngào trong từng chiếc bánh - Gửi trọn yêu thương từ Luna 🎉
          </span>
          <span className="sm:hidden text-pink-600 font-semibold">🎂 Gửi yêu thương từ Luna</span>
        </div>

        {/* Bên phải: Info */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 order-2 md:order-3 text-[11px] sm:text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 hover:text-pink-600 transition-colors duration-200">
            <FaPhone className="text-xs" />
            <span className="whitespace-nowrap font-medium">0987 654 321</span>
          </div>
          <Divider />
          <div className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-pink-600 transition-colors duration-200">
            <FaEnvelope className="text-xs" />
            <span className="font-medium">luna@bakery.com</span>
          </div>
          <Divider />
          <div className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-pink-600 transition-colors duration-200">
            <FaClock className="text-xs" />
            <span className="font-medium">08:00 - 21:00</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Topbar
