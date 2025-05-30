import React from 'react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

// Component phân cách đẹp, tự ẩn trên mobile
const Divider = () => (
  <span
    className="mx-2 text-gray-300 select-none opacity-50 sm:inline hidden transition-opacity duration-200"
    aria-hidden="true"
  >
    |
  </span>
)

const Topbar = () => {
  return (
    <div className="bg-[#fceffb] text-white text-xs sm:text-sm py-2  z-100 w-full ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">

        {/* Bên trái: Social icons */}
        <div className="flex items-center gap-1 order-1 md:order-1 text-[#a37ba3]">
          <a href="https://www.facebook.com/pham.huynh.thong.2025/" className="hover:text-[#814d81] transition-colors duration-200" title="Facebook">
            <FaFacebookF />
          </a>
          <Divider />
          <a href="#" className="hover:text-[#814d81] transition-colors duration-200" title="Zalo">
            <SiZalo />
          </a>
          <Divider />
          <a href="#" className="hover:text-[#814d81] transition-colors duration-200" title="Instagram">
            <FaInstagram />
          </a>
        </div>

        {/* Chính giữa: Slogan */}
        <div className="text-center font-medium order-3 md:order-2 text-[11px] sm:text-sm text-[#814d81]">
          <span className="hidden sm:inline">
            🎂 Ngọt ngào trong từng chiếc bánh - Gửi trọn yêu thương từ Luna 🎉
          </span>
          <span className="sm:hidden">🎂 Gửi yêu thương từ Luna</span>
        </div>

        {/* Bên phải: Info */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 order-2 md:order-3 text-[11px] sm:text-sm">
          <span className="whitespace-nowrap text-[#3c3c3c]">☎ 0987 654 321</span>
          <Divider />
          <span className="hidden sm:inline text-[#3c3c3c]">✉ luna@bakery.com</span>
          <Divider />
          <span className="hidden sm:inline text-[#666666]">🕒 08:00 - 21:00</span>
        </div>

      </div>
    </div>
  )
}

export default Topbar
