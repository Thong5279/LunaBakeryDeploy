import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

// Ảnh nền
import hero1 from '../../assets/hero1.jpg'
import hero2 from '../../assets/hero2.jpg'
import hero3 from '../../assets/hero3.jpg'

const images = [hero1, hero2, hero3]

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)

  // Tự động chuyển ảnh sau mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full h-[600px] md:h-[750px] lg:h-[850px] overflow-hidden">
      {/* Ảnh động */}
      <AnimatePresence>
        <motion.img
          key={current}
          src={images[current]}
          alt={`Hero ${current}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      {/* Lớp phủ & nội dung */}
      <div className="absolute inset-0 bg-black/40 flex items-center">
        <div className="max-w-4xl mx-auto px-6 text-white">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 drop-shadow"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            Chào mừng đến với <span className="text-pink-300">Luna Bakery</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-pink-100 font-light mb-6 max-w-2xl drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Nơi những chiếc bánh không chỉ ngọt ngào mà còn chất chứa yêu thương. Cùng khám phá thực đơn đầy sắc màu và hương vị nhé!
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.3 }}
          >
            <Link
              to="/products"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold text-lg px-6 py-3 rounded-full transition duration-300 shadow-md"
            >
              Khám phá ngay 🎂
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
