import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, formData);
      toast.success('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-lg text-gray-600">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Thông Tin Liên Hệ</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-pink-500 text-xl mt-1 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Địa Chỉ</h3>
                  <p className="text-gray-600 mt-1">
                    số 69 đường B2 khu dân cư hưng phú Q.Cái Răng<br />
                    TP. Cần thơ, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FaPhone className="text-pink-500 text-xl mt-1 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Điện Thoại</h3>
                  <p className="text-gray-600 mt-1">
                    Hotline: (84) 919 164 967<br />
                    Đặt bánh: (84) 337 615 279
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FaEnvelope className="text-pink-500 text-xl mt-1 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">
                    info@lunabakery.com<br />
                    phamhuynhthong192@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FaClock className="text-pink-500 text-xl mt-1 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Giờ Làm Việc</h3>
                  <p className="text-gray-600 mt-1">
                    Thứ 2 - Thứ 7: 7:00 - 21:00<br />
                    Chủ nhật: 8:00 - 20:00
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/pham.huynh.thong.2025/" className="text-pink-500 hover:text-pink-600 text-2xl">
                    <FaFacebook />
                  </a>
                  <a href="https://www.instagram.com/thongpham.huynh/" className="text-pink-500 hover:text-pink-600 text-2xl">
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gửi Tin Nhắn</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Chủ đề
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vị Trí Của Chúng Tôi</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.9362289084293!2d105.78411337588592!3d10.022121372651931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0629cb70e5707%3A0xbd4b585c67938484!2zNjktYmkgxJDGsOG7nW5nIEIyLCBIxrBuZyBQaMO6LCBDw6FpIFLEg25nLCBD4bqnbiBUaMahLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1752115585161!5m2!1svi!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 