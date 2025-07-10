const chatbotData = {
  // Thông tin chung về cửa hàng
  general: {
    'giới thiệu': 'Luna Bakery là tiệm bánh chuyên cung cấp các loại bánh ngọt, bánh kem và bánh sinh nhật với chất lượng cao. Chúng tôi tự hào về việc sử dụng nguyên liệu tươi ngon và tạo ra những chiếc bánh đẹp mắt, ngon miệng.',
    'địa chỉ': 'Luna Bakery tọa lạc tại 123 Đường ABC, Quận XYZ, TP.HCM',
    'giờ làm việc': 'Chúng tôi mở cửa từ 7:00 - 21:00 các ngày trong tuần, kể cả ngày lễ.',
    'liên hệ': 'Bạn có thể liên hệ với chúng tôi qua:\n- Hotline: 0123.456.789\n- Email: info@lunabakery.com\n- Facebook: facebook.com/lunabakery',
    'lịch sử': 'Luna Bakery được thành lập năm 2020 với sứ mệnh mang đến những chiếc bánh chất lượng cao, giá cả phải chăng cho mọi người. Chúng tôi đã phục vụ hơn 10,000 khách hàng hài lòng.',
    'cam kết': 'Chúng tôi cam kết:\n- 100% nguyên liệu tươi mới\n- Không chất bảo quản\n- Giao hàng đúng giờ\n- Hoàn tiền nếu không hài lòng',
  },

  // Thông tin về sản phẩm
  products: {
    'bánh kem': 'Luna Bakery có đa dạng các loại bánh kem với nhiều kích thước và mẫu mã khác nhau. Giá từ 200,000đ đến 2,000,000đ tùy loại.',
    'bánh sinh nhật': 'Chúng tôi có dịch vụ đặt bánh sinh nhật theo yêu cầu với nhiều mẫu mã độc đáo. Thời gian đặt trước 2-3 ngày.',
    'bánh mì': 'Bánh mì tươi được làm mới mỗi ngày, có các loại như bánh mì Pháp, bánh mì sandwich, bánh mì ngọt.',
    'cookies': 'Cookies được làm từ nguyên liệu cao cấp, có nhiều hương vị như chocolate chip, matcha, oatmeal raisin.',
    'cupcake': 'Cupcake với nhiều hương vị và trang trí đẹp mắt, thích hợp cho tiệc nhỏ hoặc quà tặng.',
    'bánh ngọt': 'Các loại bánh ngọt đa dạng:\n- Tiramisu: 65,000đ/phần\n- Cheesecake: 70,000đ/phần\n- Panna cotta: 55,000đ/phần\n- Mousse các vị: 60,000đ/phần',
    'bánh truyền thống': 'Bánh truyền thống Việt Nam:\n- Bánh bông lan: 45,000đ\n- Bánh flan: 35,000đ/phần\n- Bánh chuối nướng: 40,000đ\n- Bánh bò: 50,000đ',
  },

  // Thông tin về đặt hàng
  ordering: {
    'cách đặt hàng': 'Để đặt hàng, bạn có thể:\n1. Chọn sản phẩm trên website\n2. Thêm vào giỏ hàng\n3. Tiến hành thanh toán\n4. Chọn phương thức giao hàng',
    'thanh toán': 'Chúng tôi chấp nhận các hình thức thanh toán:\n- PayPal\n- ZaloPay\n- Chuyển khoản ngân hàng\n- Tiền mặt khi nhận hàng',
    'giao hàng': 'Dịch vụ giao hàng:\n- Nội thành: 15,000đ - 30,000đ\n- Ngoại thành: 30,000đ - 50,000đ\n- Thời gian giao: 30-90 phút tùy khu vực',
    'đổi trả': 'Chính sách đổi trả:\n- Hoàn tiền 100% nếu sản phẩm lỗi do nhà sản xuất\n- Đổi sản phẩm mới trong vòng 24h nếu không hài lòng về chất lượng',
    'đặt số lượng lớn': 'Đặt hàng số lượng lớn:\n- Từ 10 sản phẩm: giảm 5%\n- Từ 20 sản phẩm: giảm 10%\n- Từ 50 sản phẩm: giảm 15%\n- Liên hệ để được tư vấn chi tiết',
  },

  // Thông tin về dịch vụ đặc biệt
  special: {
    'tiệc cưới': 'Dịch vụ bánh cưới cao cấp:\n- Tư vấn thiết kế miễn phí\n- Nhiều mẫu mã đa dạng\n- Giao hàng tận nơi\n- Đặt trước 1-2 tuần',
    'tiệc sinh nhật': 'Tổ chức tiệc sinh nhật tại Luna Bakery:\n- Không gian thoáng đãng\n- Trang trí theo chủ đề\n- Dịch vụ ẩm thực đa dạng\n- Đặt trước 3-5 ngày',
    'quà tặng': 'Dịch vụ quà tặng:\n- Hộp quà sang trọng\n- Thiết kế theo yêu cầu\n- Giao hàng tận nơi\n- Có thể đặt số lượng lớn',
    'sự kiện doanh nghiệp': 'Phục vụ sự kiện doanh nghiệp:\n- Tea break\n- Tiệc buffet bánh ngọt\n- Logo công ty trên bánh\n- Báo giá theo yêu cầu',
  },

  // Tư vấn dinh dưỡng và sức khỏe
  nutrition: {
    'calories': 'Thông tin calories trung bình:\n- Bánh kem: 300-400 kcal/100g\n- Bánh mì: 250-300 kcal/100g\n- Cookies: 450-500 kcal/100g\n- Bánh ngọt: 350-450 kcal/100g',
    'dị ứng': 'Thông tin dị ứng:\n- Hầu hết sản phẩm có gluten, trứng, sữa\n- Có sẵn một số sản phẩm không gluten\n- Vui lòng thông báo nếu bạn có dị ứng',
    'nguyên liệu': 'Nguyên liệu chính:\n- Bột mì nhập khẩu\n- Bơ Anchor, Elle & Vire\n- Chocolate Callebaut\n- Trứng gà tươi\n- Sữa tươi không đường',
    'bảo quản': 'Hướng dẫn bảo quản:\n- Bánh kem: 2-3 ngày trong tủ lạnh\n- Bánh mì: 1-2 ngày ở nhiệt độ phòng\n- Cookies: 7-10 ngày trong hộp kín\n- Bánh ngọt: 3-5 ngày trong tủ lạnh',
  },

  // Khuyến mãi và ưu đãi
  promotions: {
    'khuyến mãi hiện tại': 'Khuyến mãi tháng này:\n- Mua 2 tặng 1 cho bánh mì mỗi sáng thứ 3\n- Giảm 10% cho đơn hàng trên 500,000đ\n- Tặng 1 cupcake cho sinh nhật khách hàng',
    'thẻ thành viên': 'Ưu đãi thẻ thành viên:\n- Đồng: Giảm 5% mọi đơn hàng\n- Bạc: Giảm 10% + quà sinh nhật\n- Vàng: Giảm 15% + giao hàng miễn phí',
    'combo': 'Combo tiết kiệm:\n- Combo A: 3 bánh mì + 1 ly cà phê = 89,000đ\n- Combo B: 1 bánh kem nhỏ + 4 cupcake = 299,000đ\n- Combo C: Set 12 cookies các vị = 189,000đ',
  },

  // Công thức và mẹo làm bánh
  recipes: {
    'mẹo làm bánh': 'Mẹo làm bánh cơ bản:\n- Nguyên liệu phải ở nhiệt độ phòng\n- Rây bột để bánh xốp hơn\n- Không mở lò trong 20 phút đầu\n- Dùng tăm kiểm tra độ chín',
    'công thức đơn giản': 'Bạn có thể tham khảo blog của chúng tôi để học các công thức:\n- Bánh bông lan cơ bản\n- Cookies chocolate chip\n- Bánh flan caramel\n- Và nhiều công thức khác',
  },

  // Câu hỏi thường gặp
  faq: {
    'vận chuyển xa': 'Chúng tôi có thể giao hàng đi xa không?\n- Có, chúng tôi giao toàn TP.HCM và các tỉnh lân cận\n- Phí vận chuyển sẽ được báo giá riêng\n- Đóng gói cẩn thận đảm bảo chất lượng',
    'đặt trước': 'Cần đặt trước bao lâu?\n- Bánh thông thường: 1 ngày\n- Bánh sinh nhật: 2-3 ngày\n- Bánh cưới: 1-2 tuần\n- Đơn hàng lớn: 3-5 ngày',
    'hủy đơn': 'Chính sách hủy đơn:\n- Hủy trước 24h: hoàn tiền 100%\n- Hủy trước 12h: hoàn tiền 50%\n- Hủy dưới 12h: không hoàn tiền',
  },

  // Từ khóa và câu trả lời
  keywords: {
    'giá': ['giá', 'bảng giá', 'chi phí', 'giá cả', 'bao nhiêu tiền'],
    'đặt hàng': ['đặt', 'order', 'mua', 'đặt hàng', 'làm sao để đặt'],
    'giao hàng': ['giao', 'ship', 'vận chuyển', 'giao hàng', 'delivery'],
    'thời gian': ['giờ', 'thời gian', 'mấy giờ', 'khi nào', 'bao lâu'],
    'liên hệ': ['liên hệ', 'số điện thoại', 'email', 'địa chỉ', 'hotline'],
    'sản phẩm': ['bánh', 'sản phẩm', 'đồ ngọt', 'món', 'menu'],
    'thanh toán': ['thanh toán', 'trả tiền', 'payment', 'tiền', 'chuyển khoản'],
    'khuyến mãi': ['khuyến mãi', 'giảm giá', 'ưu đãi', 'sale', 'promotion'],
    'dinh dưỡng': ['calories', 'calo', 'dinh dưỡng', 'healthy', 'lành mạnh'],
    'dị ứng': ['dị ứng', 'allergy', 'không ăn được', 'kiêng'],
    'công thức': ['công thức', 'recipe', 'làm sao', 'cách làm'],
    'bảo quản': ['bảo quản', 'giữ', 'để được bao lâu', 'hạn sử dụng'],
  },

  // Gợi ý sản phẩm theo dịp
  suggestions: {
    'sinh nhật': 'Gợi ý cho sinh nhật:\n- Bánh kem tươi các size\n- Set cupcake với nến số\n- Bánh mousse trái cây\n- Combo bánh + bong bóng trang trí',
    'lễ tình nhân': 'Gợi ý Valentine:\n- Bánh trái tim chocolate\n- Red velvet cupcakes\n- Chocolate truffles\n- Set quà tặng đặc biệt',
    'giáng sinh': 'Gợi ý Giáng sinh:\n- Bánh khúc cây Noel\n- Gingerbread cookies\n- Christmas cupcakes\n- Hộp quà bánh theo chủ đề',
    'họp mặt': 'Gợi ý cho họp mặt:\n- Set bánh ngọt mini\n- Cookies các loại\n- Bánh mì sandwich\n- Nước uống kèm theo',
  },

  // Câu chào và câu mặc định
  greetings: {
    welcome: 'Xin chào! Tôi là Luna Assistant. Tôi có thể giúp gì cho bạn?',
    goodbye: 'Cảm ơn bạn đã liên hệ với Luna Bakery. Chúc bạn một ngày tốt lành!',
    default: 'Xin lỗi, tôi không hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n- Thông tin sản phẩm\n- Cách đặt hàng\n- Giá cả và khuyến mãi\n- Dịch vụ giao hàng\n- Hoặc liên hệ trực tiếp với nhân viên qua hotline: 0123.456.789',
  }
};

module.exports = chatbotData; 