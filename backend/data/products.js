const { PRODUCT_CATEGORIES, PRODUCT_FLAVORS, PRODUCT_SIZES } = require('../constants/productConstants');

const products = [
  // Bánh kem
  {
    "name": "Bánh Kem Dâu Tươi",
    "description": "Bánh kem mềm mịn với lớp kem tươi thơm ngon và dâu tây tươi ngọt, thích hợp cho sinh nhật và các dịp đặc biệt.",
    "price": 350000,
    "discountPrice": 320000,
    "countInStock": 15,
    "sku": "BK-001",
    "category": "Bánh kem",
    "sizes": ["18cm", "20cm", "22cm"],
    "flavors": ["Dâu"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=1",
        "altText": "Bánh kem dâu tươi"
      }
    ],
    "rating": 4.8,
    "numReviews": 25,
    "isFeatured": true,
    "isPublished": true
  },
  {
    "name": "Bánh Kem Socola Đen",
    "description": "Bánh kem socola đậm đà với lớp ganache mềm mịn, dành cho những người yêu thích vị đắng ngọt của socola.",
    "price": 380000,
    "discountPrice": 350000,
    "countInStock": 12,
    "sku": "BK-002",
    "category": "Bánh kem",
    "sizes": ["18cm", "20cm", "22cm"],
    "flavors": ["Socola"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=2",
        "altText": "Bánh kem socola đen"
      }
    ],
    "rating": 4.9,
    "numReviews": 32,
    "isFeatured": true,
    "isPublished": true
  },
  
  // Bánh lạnh
  {
    "name": "Bánh Tiramisu Matcha",
    "description": "Bánh tiramisu với hương vị matcha đặc trưng, mát lạnh và thơm ngon, hoàn hảo cho mùa hè.",
    "price": 450000,
    "discountPrice": 420000,
    "countInStock": 8,
    "sku": "BL-001",
    "category": "Bánh lạnh",
    "sizes": ["Vừa", "Lớn"],
    "flavors": ["Matcha"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=3",
        "altText": "Bánh tiramisu matcha"
      }
    ],
    "rating": 4.7,
    "numReviews": 18,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Macaron
  {
    "name": "Macaron Mix 12 Chiếc",
    "description": "Hộp 12 chiếc macaron với 6 vị khác nhau: dâu, socola, matcha, chanh, vải, và hạt dẻ cười.",
    "price": 180000,
    "discountPrice": 160000,
    "countInStock": 20,
    "sku": "MC-001",
    "category": "Macaron",
    "sizes": ["Hộp 12 chiếc"],
    "flavors": ["Dâu", "Socola", "Matcha", "Chanh", "Vải", "Hạt dẻ cười"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=4",
        "altText": "Hộp macaron mix"
      }
    ],
    "rating": 4.6,
    "numReviews": 45,
    "isFeatured": true,
    "isPublished": true
  },
  
  // Croissant
  {
    "name": "Croissant Bơ Pháp",
    "description": "Bánh croissant giòn tan với lớp vỏ bên ngoài giòn rụm và phần bên trong mềm mịn, hương vị bơ đậm đà.",
    "price": 35000,
    "discountPrice": 30000,
    "countInStock": 50,
    "sku": "CR-001",
    "category": "Croissant",
    "sizes": ["Nhỏ"],
    "flavors": ["Bơ"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=5",
        "altText": "Croissant bơ Pháp"
      }
    ],
    "rating": 4.5,
    "numReviews": 67,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Donut
  {
    "name": "Donut Glaze Truyền Thống",
    "description": "Bánh donut mềm mịn phủ glaze ngọt ngào, món ăn vặt hoàn hảo cho mọi lúc trong ngày.",
    "price": 25000,
    "discountPrice": 22000,
    "countInStock": 30,
    "sku": "DN-001",
    "category": "Donut",
    "sizes": ["Nhỏ"],
    "flavors": ["Trái cây"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=6",
        "altText": "Donut glaze"
      }
    ],
    "rating": 4.3,
    "numReviews": 89,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Mochi kem
  {
    "name": "Mochi Kem Xoài",
    "description": "Bánh mochi mềm mịn bao bọc kem xoài tươi mát, món tráng miệng lý tưởng cho ngày nóng.",
    "price": 45000,
    "discountPrice": 40000,
    "countInStock": 25,
    "sku": "MK-001",
    "category": "Mochi kem",
    "sizes": ["Nhỏ"],
    "flavors": ["Xoài"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=7",
        "altText": "Mochi kem xoài"
      }
    ],
    "rating": 4.7,
    "numReviews": 34,
    "isFeatured": true,
    "isPublished": true
  },
  
  // Cheese cake
  {
    "name": "Cheese Cake Chanh Dây",
    "description": "Bánh phô mai mềm mịn với hương vị chanh dây chua ngọt tự nhiên, không nướng và rất mát lạnh.",
    "price": 420000,
    "discountPrice": 380000,
    "countInStock": 10,
    "sku": "CC-001",
    "category": "Cheese cake",
    "sizes": ["18cm", "20cm"],
    "flavors": ["Chanh dây"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=8",
        "altText": "Cheese cake chanh dây"
      }
    ],
    "rating": 4.8,
    "numReviews": 22,
    "isFeatured": true,
    "isPublished": true
  },
  
  // Bánh su
  {
    "name": "Bánh Su Kem Vanilla",
    "description": "Bánh su giòn bên ngoài, mềm bên trong, nhân kem vanilla thơm ngon và béo ngậy.",
    "price": 15000,
    "discountPrice": 12000,
    "countInStock": 40,
    "sku": "BS-001",
    "category": "Bánh su",
    "sizes": ["Nhỏ"],
    "flavors": ["Trái cây"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=9",
        "altText": "Bánh su kem vanilla"
      }
    ],
    "rating": 4.4,
    "numReviews": 56,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Bánh tart
  {
    "name": "Tart Trái Cây Tươi",
    "description": "Bánh tart giòn tan với nhân custard mềm mịn và trái cây tươi đa dạng trang trí bên trên.",
    "price": 65000,
    "discountPrice": 58000,
    "countInStock": 18,
    "sku": "BT-001",
    "category": "Bánh tart",
    "sizes": ["Nhỏ", "Vừa"],
    "flavors": ["Trái cây", "Dâu", "Kiwi"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=10",
        "altText": "Tart trái cây tươi"
      }
    ],
    "rating": 4.6,
    "numReviews": 41,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Cookie
  {
    "name": "Cookie Socola Chip",
    "description": "Bánh quy giòn tan với những mảnh socola chip thơm ngon, món ăn vặt được yêu thích.",
    "price": 35000,
    "discountPrice": 30000,
    "countInStock": 60,
    "sku": "CK-001",
    "category": "Cookie",
    "sizes": ["Hộp 6 chiếc"],
    "flavors": ["Socola"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=11",
        "altText": "Cookie socola chip"
      }
    ],
    "rating": 4.5,
    "numReviews": 78,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Éclair
  {
    "name": "Éclair Socola",
    "description": "Bánh éclair dài với lớp vỏ choux mềm mịn, nhân kem vanilla và phủ socola bên trên.",
    "price": 28000,
    "discountPrice": 25000,
    "countInStock": 35,
    "sku": "EC-001",
    "category": "Éclair",
    "sizes": ["Nhỏ"],
    "flavors": ["Socola"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=12",
        "altText": "Éclair socola"
      }
    ],
    "rating": 4.7,
    "numReviews": 29,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Canelé
  {
    "name": "Canelé Bordeaux",
    "description": "Bánh canelé truyền thống từ Bordeaux với lớp vỏ cứng caramen và bên trong mềm mịn thơm rum.",
    "price": 45000,
    "discountPrice": 40000,
    "countInStock": 20,
    "sku": "CA-001",
    "category": "Canelé",
    "sizes": ["Nhỏ"],
    "flavors": ["Trái cây"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=13",
        "altText": "Canelé Bordeaux"
      }
    ],
    "rating": 4.8,
    "numReviews": 15,
    "isFeatured": true,
    "isPublished": true
  },
  
  // Bánh kem cuộn
  {
    "name": "Bánh Kem Cuộn Dâu",
    "description": "Bánh bông lan mềm cuộn với kem tươi và dâu tây, nhẹ nhàng và không quá ngọt.",
    "price": 220000,
    "discountPrice": 200000,
    "countInStock": 12,
    "sku": "BKC-001",
    "category": "Bánh kem cuộn",
    "sizes": ["Vừa"],
    "flavors": ["Dâu"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=14",
        "altText": "Bánh kem cuộn dâu"
      }
    ],
    "rating": 4.6,
    "numReviews": 38,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Bánh crepe
  {
    "name": "Crepe Sầu Riêng",
    "description": "Bánh crepe mỏng với nhân sầu riêng thơm ngon đặc trưng, dành cho những người yêu thích sầu riêng.",
    "price": 85000,
    "discountPrice": 75000,
    "countInStock": 15,
    "sku": "BCR-001",
    "category": "Bánh crepe",
    "sizes": ["Vừa"],
    "flavors": ["Sầu riêng"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=15",
        "altText": "Crepe sầu riêng"
      }
    ],
    "rating": 4.9,
    "numReviews": 27,
    "isFeatured": true,
    "isPublished": true
  },
  
  // Bánh trung thu
  {
    "name": "Bánh Trung Thu Thập Cẩm",
    "description": "Bánh trung thu truyền thống với nhân thập cẩm, gồm hạt sen, lạp xưởng, và trứng muối.",
    "price": 120000,
    "discountPrice": 100000,
    "countInStock": 50,
    "sku": "BTT-001",
    "category": "Bánh trung thu",
    "sizes": ["Vừa"],
    "flavors": ["Trái cây"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=16",
        "altText": "Bánh trung thu thập cẩm"
      }
    ],
    "rating": 4.5,
    "numReviews": 63,
    "isFeatured": false,
    "isPublished": true
  },
  
  // Bánh ngọt
  {
    "name": "Bánh Flan Caramen",
    "description": "Bánh flan mềm mịn với lớp caramen đắng ngọt vừa phải, món tráng miệng kinh điển.",
    "price": 35000,
    "discountPrice": 30000,
    "countInStock": 25,
    "sku": "BN-001",
    "category": "Bánh ngọt",
    "sizes": ["Nhỏ"],
    "flavors": ["Trái cây"],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=17",
        "altText": "Bánh flan caramen"
      }
    ],
    "rating": 4.4,
    "numReviews": 52,
    "isFeatured": false,
    "isPublished": true
  }
];

module.exports = products;