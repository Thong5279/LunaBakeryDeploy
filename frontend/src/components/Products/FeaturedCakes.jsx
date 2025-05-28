import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/featured.jpg'

const FeaturedCakes = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-pink-50 
        rounded-3xl shadow-xl overflow-hidden'>

        {/* Left content */}
        <div className='w-full lg:w-1/2 p-8 text-center lg:text-left'>
          <h2 className='text-sm font-medium text-pink-500 mb-2 uppercase tracking-wide'>
            Ngọt ngào & Tinh tế
          </h2>

          <h2 className='text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight'>
            Bánh ngọt cho cuộc sống thường ngày của bạn
          </h2>

          <p className='text-lg text-gray-600 mb-6'>
            Khám phá những chiếc bánh thủ công tươi ngon, được làm từ nguyên liệu chất lượng cao. 
            Sự kết hợp hoàn hảo giữa hương vị truyền thống và phong cách hiện đại – giúp mỗi khoảnh khắc của bạn thêm trọn vẹn và đáng nhớ.
          </p>

          <Link
            to="/collections/all"
            className='bg-pink-500 text-white px-6 py-3 rounded-full text-lg shadow-md hover:bg-pink-600 transition duration-300'
          >
            Mua ngay 🍰
          </Link>
        </div>

        {/* Right image */}
        <div className="lg:w-1/2">
          <img
            src={featured}
            alt="Featured cake"
            className='w-full h-full object-cover lg:rounded-l-3xl lg:rounded-r-none rounded-b-3xl lg:rounded-b-none'
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedCakes
