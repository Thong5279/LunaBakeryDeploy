import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaHeart, FaStar, FaCertificate, FaHandHoldingHeart } from 'react-icons/fa';

const About = () => {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/about-hero.jpg"
            alt="Luna Bakery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Luna Bakery</h1>
            <p className="text-xl md:text-2xl italic">
              "Không chỉ là bánh - Là nghệ thuật của tâm hồn"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-center mb-8"
            >
              Câu Chuyện Thương Hiệu
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="prose prose-lg mx-auto text-gray-600"
            >
              <p>
                Luna Bakery được sinh ra từ niềm đam mê với bánh ngọt và ước mơ mang đến những trải nghiệm ẩm thực độc đáo. Chúng tôi bắt đầu hành trình của mình từ một căn bếp nhỏ, nơi mỗi công thức đều được nghiên cứu và hoàn thiện với tất cả tâm huyết.
              </p>
              <p>
                Cái tên Luna - lấy cảm hứng từ ánh trăng dịu dàng, thể hiện sự tinh tế và hoàn mỹ trong từng sản phẩm. Chúng tôi tin rằng mỗi chiếc bánh không chỉ là món ăn, mà còn là tác phẩm nghệ thuật, là cầu nối gắn kết những khoảnh khắc hạnh phúc.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Giá Trị Cốt Lõi
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaLeaf className="text-4xl text-green-500" />,
                title: "Nguyên Liệu Tự Nhiên",
                description: "Chúng tôi cam kết sử dụng 100% nguyên liệu tự nhiên, không chất bảo quản, không phụ gia độc hại."
              },
              {
                icon: <FaHeart className="text-4xl text-pink-500" />,
                title: "Làm Với Tâm Huyết",
                description: "Mỗi sản phẩm đều được làm thủ công với tình yêu và sự tận tâm của đội ngũ thợ bánh chuyên nghiệp."
              },
              {
                icon: <FaStar className="text-4xl text-yellow-500" />,
                title: "Chất Lượng Hàng Đầu",
                description: "Chúng tôi không ngừng hoàn thiện để mang đến những sản phẩm chất lượng nhất cho khách hàng."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kitchen & Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Không Gian & Đội Ngũ</h2>
              <p className="text-gray-600">
                Bếp bánh Luna là nơi hội tụ của sự sáng tạo và chuyên nghiệp. Với không gian rộng rãi, thiết bị hiện đại và đội ngũ thợ bánh tay nghề cao, chúng tôi tự hào mang đến những sản phẩm chất lượng nhất.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <FaCertificate className="text-pink-500 mr-3" />
                  <span>Đạt chuẩn VSATTP</span>
                </li>
                <li className="flex items-center">
                  <FaCertificate className="text-pink-500 mr-3" />
                  <span>Thợ bánh chuyên nghiệp</span>
                </li>
                <li className="flex items-center">
                  <FaCertificate className="text-pink-500 mr-3" />
                  <span>Thiết bị hiện đại</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="/images/kitchen-1.jpg"
                alt="Kitchen"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/images/kitchen-2.jpg"
                alt="Team"
                className="rounded-lg shadow-lg mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <FaHandHoldingHeart className="text-5xl text-pink-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cam Kết Của Chúng Tôi</h2>
            <p className="text-gray-600 text-lg">
              Luna Bakery cam kết mang đến những sản phẩm chất lượng nhất, được làm từ nguyên liệu tự nhiên, 
              đảm bảo vệ sinh an toàn thực phẩm. Chúng tôi luôn lắng nghe và không ngừng cải tiến để đáp ứng 
              mọi yêu cầu của khách hàng.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Chị Hương",
                role: "Khách hàng thân thiết",
                content: "Bánh ở Luna không chỉ ngon mà còn rất đẹp mắt. Tôi luôn tin tưởng đặt bánh ở đây cho những dịp đặc biệt."
              },
              {
                name: "Anh Tuấn",
                role: "Food Blogger",
                content: "Luna Bakery là một trong những tiệm bánh có chất lượng tốt nhất mà tôi từng trải nghiệm. Đặc biệt ấn tượng với service chu đáo."
              },
              {
                name: "Chị Mai",
                role: "Chủ tiệc cưới",
                content: "Đặt bánh cưới ở Luna là một quyết định đúng đắn. Chiếc bánh không chỉ đẹp mà còn nhận được nhiều lời khen từ khách mời."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 