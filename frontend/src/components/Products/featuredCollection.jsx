import React from 'react'
import { HiShoppingBag } from 'react-icons/hi'
import { FaUndo, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <HiShoppingBag className="text-4xl text-pink-500" />,
    title: 'Miễn phí vận chuyển',
    desc: 'Cho đơn hàng từ 500.000₫',
  },
  {
    icon: <FaUndo className="text-3xl text-pink-500" />,
    title: 'Đổi trả hàng miễn phí',
    desc: 'Đảm bảo hoàn tiền nếu sang phẩm không đúng mô tả',
  },
  {
    icon: <FaLock className="text-3xl text-pink-500" />,
    title: 'Thanh toán an toàn',
    desc: 'Mã hoá & bảo mật 100%',
  },
]

const FeaturedCollection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center bg-pink-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mb-4"
            >
              {feature.icon}
            </motion.div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 tracking-tight">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCollection
