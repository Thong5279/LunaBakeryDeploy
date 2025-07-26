import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import featured from '../../assets/featured.jpg'
import { FaShoppingCart } from 'react-icons/fa'

const FeaturedCakes = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-20 px-3 sm:px-4 lg:px-0 bg-gradient-to-br from-pink-50 via-white to-rose-100">
      <motion.div
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center 
        rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        {/* Left content */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 text-center lg:text-left">
          <h3 className="text-xs sm:text-sm font-semibold text-pink-600 uppercase tracking-widest mb-2 sm:mb-3">
            Ngọt ngào & Tinh tế
          </h3>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Bánh ngọt cho cuộc sống thường ngày của bạn
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
            Khám phá những chiếc bánh thủ công tươi ngon, làm từ nguyên liệu tự nhiên chất lượng cao. 
            Vị ngon truyền thống hòa quyện với phong cách hiện đại – mỗi chiếc bánh là một câu chuyện ngọt ngào.
          </p>

          {/* CTA Button with icon & animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <Link
              to="/collections/all"
              className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg text-sm sm:text-base lg:text-lg font-semibold hover:from-pink-600 hover:to-rose-500 transition-all duration-300 min-h-[44px]"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <img src="https://i.pinimg.com/originals/18/65/23/186523fbc4745b7cd94189d6a89db77d.gif" alt="Shopping Cart" className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.span>
              Mua ngay
            </Link>
          </motion.div>
        </div>

        {/* Right image */}
        <motion.div
          className="lg:w-1/2 overflow-hidden group"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={featured}
            alt="Bánh ngọt"
            className="w-full h-[250px] sm:h-[300px] lg:h-full object-cover lg:rounded-l-3xl lg:rounded-r-none rounded-t-2xl sm:rounded-t-3xl lg:rounded-t-none transition-transform duration-500 group-hover:scale-110"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default FeaturedCakes
