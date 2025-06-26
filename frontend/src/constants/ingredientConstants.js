// Danh mục nguyên liệu
export const INGREDIENT_CATEGORIES = [
  'Bột các loại',
  'Đường và chất ngọt',
  'Sữa và kem',
  'Trứng và sản phẩm từ trứng',
  'Trái cây tươi và đông lạnh',
  'Chocolate và cacao',
  'Hương liệu và phẩm màu',
  'Dụng cụ nướng bánh',
  'Khuôn bánh và dụng cụ tạo hình',
  'Hộp đựng và bao bì',
  'Nguyên liệu trang trí',
  'Chất bảo quản và phụ gia'
];

// Đơn vị đo lường cho nguyên liệu
export const INGREDIENT_UNITS = [
  'kg',
  'g',
  'lít',
  'ml',
  'hộp',
  'túi',
  'chai',
  'chiếc',
  'bộ',
  'gói',
  'thùng',
  'tá'
];

// Trạng thái nguyên liệu
export const INGREDIENT_STATUS = [
  { value: 'active', label: 'Đang bán' },
  { value: 'inactive', label: 'Ngừng bán' }
];

// Tùy chọn sắp xếp
export const INGREDIENT_SORT_OPTIONS = [
  { value: 'name', label: 'Tên A-Z' },
  { value: 'price', label: 'Giá tăng dần' },
  { value: 'quantity', label: 'Số lượng tăng dần' },
  { value: 'newest', label: 'Mới nhất' }
];

// Bộ lọc kho
export const STOCK_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'out', label: 'Hết hàng' },
  { value: 'low', label: 'Sắp hết (≤10)' }
]; 