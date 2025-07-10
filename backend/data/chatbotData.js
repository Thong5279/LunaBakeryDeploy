const chatbotData = {
  // Thông tin chung về cửa hàng
  general: {
    'giới thiệu': 'Luna Bakery là tiệm bánh chuyên cung cấp các loại bánh ngọt, bánh kem và bánh sinh nhật với chất lượng cao. Chúng tôi tự hào về việc sử dụng nguyên liệu tươi ngon và tạo ra những chiếc bánh đẹp mắt, ngon miệng.',
    'địa chỉ': 'Luna Bakery tọa lạc tại 123 Đường ABC, Quận XYZ, TP.HCM',
    'giờ làm việc': 'Chúng tôi mở cửa từ 7:00 - 21:00 các ngày trong tuần, kể cả ngày lễ.',
    'liên hệ': 'Bạn có thể liên hệ với chúng tôi qua:\n- Hotline: 0123.456.789\n- Email: info@lunabakery.com\n- Facebook: facebook.com/lunabakery',
  },

  // Thông tin về sản phẩm
  products: {
    'bánh kem': 'Luna Bakery có đa dạng các loại bánh kem với nhiều kích thước và mẫu mã khác nhau. Giá từ 200,000đ đến 2,000,000đ tùy loại.',
    'bánh sinh nhật': 'Chúng tôi có dịch vụ đặt bánh sinh nhật theo yêu cầu với nhiều mẫu mã độc đáo. Thời gian đặt trước 2-3 ngày.',
    'bánh mì': 'Bánh mì tươi được làm mới mỗi ngày, có các loại như bánh mì Pháp, bánh mì sandwich, bánh mì ngọt.',
    'cookies': 'Cookies được làm từ nguyên liệu cao cấp, có nhiều hương vị như chocolate chip, matcha, oatmeal raisin.',
    'cupcake': 'Cupcake với nhiều hương vị và trang trí đẹp mắt, thích hợp cho tiệc nhỏ hoặc quà tặng.',
  },

  // Thông tin về đặt hàng
  ordering: {
    'cách đặt hàng': 'Để đặt hàng, bạn có thể:\n1. Chọn sản phẩm trên website\n2. Thêm vào giỏ hàng\n3. Tiến hành thanh toán\n4. Chọn phương thức giao hàng',
    'thanh toán': 'Chúng tôi chấp nhận các hình thức thanh toán:\n- PayPal\n- ZaloPay\n- Chuyển khoản ngân hàng\n- Tiền mặt khi nhận hàng',
    'giao hàng': 'Dịch vụ giao hàng:\n- Nội thành: 15,000đ - 30,000đ\n- Ngoại thành: 30,000đ - 50,000đ\n- Thời gian giao: 30-90 phút tùy khu vực',
    'đổi trả': 'Chính sách đổi trả:\n- Hoàn tiền 100% nếu sản phẩm lỗi do nhà sản xuất\n- Đổi sản phẩm mới trong vòng 24h nếu không hài lòng về chất lượng',
  },

  // Thông tin về dịch vụ đặc biệt
  special: {
    'tiệc cưới': 'Dịch vụ bánh cưới cao cấp:\n- Tư vấn thiết kế miễn phí\n- Nhiều mẫu mã đa dạng\n- Giao hàng tận nơi\n- Đặt trước 1-2 tuần',
    'tiệc sinh nhật': 'Tổ chức tiệc sinh nhật tại Luna Bakery:\n- Không gian thoáng đãng\n- Trang trí theo chủ đề\n- Dịch vụ ẩm thực đa dạng\n- Đặt trước 3-5 ngày',
    'quà tặng': 'Dịch vụ quà tặng:\n- Hộp quà sang trọng\n- Thiết kế theo yêu cầu\n- Giao hàng tận nơi\n- Có thể đặt số lượng lớn',
  },

  // Từ khóa và câu trả lời
  keywords: {
    'giá': ['giá', 'bảng giá', 'chi phí', 'giá cả'],
    'đặt hàng': ['đặt', 'order', 'mua', 'đặt hàng'],
    'giao hàng': ['giao', 'ship', 'vận chuyển', 'giao hàng'],
    'thời gian': ['giờ', 'thời gian', 'mấy giờ', 'khi nào'],
    'liên hệ': ['liên hệ', 'số điện thoại', 'email', 'địa chỉ'],
    'sản phẩm': ['bánh', 'sản phẩm', 'đồ ngọt', 'món'],
    'thanh toán': ['thanh toán', 'trả tiền', 'payment', 'tiền'],
    'khuyến mãi': ['khuyến mãi', 'giảm giá', 'ưu đãi', 'sale'],
  },

  // Câu chào và câu mặc định
  greetings: {
    welcome: 'Xin chào! Tôi là Luna Assistant. Tôi có thể giúp gì cho bạn?',
    goodbye: 'Cảm ơn bạn đã liên hệ với Luna Bakery. Chúc bạn một ngày tốt lành!',
    default: 'Xin lỗi, tôi không hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n- Thông tin sản phẩm\n- Cách đặt hàng\n- Giá cả và khuyến mãi\n- Dịch vụ giao hàng\n- Hoặc liên hệ trực tiếp với nhân viên qua hotline: 0123.456.789',
  }
};

module.exports = chatbotData; 