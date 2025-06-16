const products = [
  {
    "name": "Bánh Bánh Kem Đặc Biệt 1",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 240182,
    "discountPrice": 223286,
    "countInStock": 20,
    "sku": "BÁN-101",
    "category": "Bánh Kem",
    "sizes": [
      "Gói 1kg"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery1_1/500/500",
        "altText": "Ảnh sản phẩm 1 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery1_2/500/500",
        "altText": "Ảnh sản phẩm 1 - góc 2"
      }
    ],
    "rating": 4.5,
    "numReviews": 45
  },
  {
    "name": "Bánh Bánh Lạnh Đặc Biệt 2",
    "description": "Sản phẩm bánh lạnh thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 374630,
    "discountPrice": 194482,
    "countInStock": 20,
    "sku": "BÁN-102",
    "category": "Bánh Lạnh",
    "sizes": [],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery2_1/500/500",
        "altText": "Ảnh sản phẩm 2 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery2_2/500/500",
        "altText": "Ảnh sản phẩm 2 - góc 2"
      }
    ],
    "rating": 4.5,
    "numReviews": 38
  },
  {
    "name": "Bánh Bánh Truyền Thống Đặc Biệt 3",
    "description": "Sản phẩm bánh truyền thống thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 349461,
    "discountPrice": 346568,
    "countInStock": 16,
    "sku": "BÁN-103",
    "category": "Bánh Truyền Thống",
    "sizes": [],
    "flavors": [
      "Chocolate"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery3_1/500/500",
        "altText": "Ảnh sản phẩm 3 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery3_2/500/500",
        "altText": "Ảnh sản phẩm 3 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 49
  },
  {
    "name": "Bánh Bánh Lạnh Đặc Biệt 4",
    "description": "Sản phẩm bánh lạnh thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 250550,
    "discountPrice": 139271,
    "countInStock": 27,
    "sku": "BÁN-104",
    "category": "Bánh Lạnh",
    "sizes": [
      "Hộp nhỏ",
      "Hộp lớn"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery4_1/500/500",
        "altText": "Ảnh sản phẩm 4 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery4_2/500/500",
        "altText": "Ảnh sản phẩm 4 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 41
  },
  {
    "name": "Bánh Bánh Lạnh Đặc Biệt 5",
    "description": "Sản phẩm bánh lạnh thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 153589,
    "discountPrice": 228201,
    "countInStock": 21,
    "sku": "BÁN-105",
    "category": "Bánh Lạnh",
    "sizes": [
      "22cm",
      "26cm"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery5_1/500/500",
        "altText": "Ảnh sản phẩm 5 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery5_2/500/500",
        "altText": "Ảnh sản phẩm 5 - góc 2"
      }
    ],
    "rating": 4.2,
    "numReviews": 26
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 6",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 256086,
    "discountPrice": 202222,
    "countInStock": 20,
    "sku": "BÁN-106",
    "category": "Bánh Kem",
    "sizes": [
      "16cm",
      "18cm",
      "22cm"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery6_1/500/500",
        "altText": "Ảnh sản phẩm 6 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery6_2/500/500",
        "altText": "Ảnh sản phẩm 6 - góc 2"
      }
    ],
    "rating": 4.2,
    "numReviews": 39
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 7",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 277582,
    "discountPrice": 255444,
    "countInStock": 6,
    "sku": "BÁN-107",
    "category": "Bánh Kem",
    "sizes": [
      "16cm",
      "18cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery7_1/500/500",
        "altText": "Ảnh sản phẩm 7 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery7_2/500/500",
        "altText": "Ảnh sản phẩm 7 - góc 2"
      }
    ],
    "rating": 5.0,
    "numReviews": 42
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 8",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 335753,
    "discountPrice": 187410,
    "countInStock": 15,
    "sku": "NGU-108",
    "category": "Nguyên Liệu",
    "sizes": [
      "Gói 1kg"
    ],
    "flavors": [
      "Dâu",
      "Vanilla"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery8_1/500/500",
        "altText": "Ảnh sản phẩm 8 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery8_2/500/500",
        "altText": "Ảnh sản phẩm 8 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 50
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 9",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 192518,
    "discountPrice": 297974,
    "countInStock": 20,
    "sku": "NGU-109",
    "category": "Nguyên Liệu",
    "sizes": [],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery9_1/500/500",
        "altText": "Ảnh sản phẩm 9 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery9_2/500/500",
        "altText": "Ảnh sản phẩm 9 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 33
  },
  {
    "name": "Bánh Bánh Lạnh Đặc Biệt 10",
    "description": "Sản phẩm bánh lạnh thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 321467,
    "discountPrice": 338908,
    "countInStock": 23,
    "sku": "BÁN-110",
    "category": "Bánh Lạnh",
    "sizes": [
      "22cm",
      "26cm"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery10_1/500/500",
        "altText": "Ảnh sản phẩm 10 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery10_2/500/500",
        "altText": "Ảnh sản phẩm 10 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 29
  },
  {
    "name": "Bánh Bánh Truyền Thống Đặc Biệt 11",
    "description": "Sản phẩm bánh truyền thống thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 210553,
    "discountPrice": 339374,
    "countInStock": 25,
    "sku": "BÁN-111",
    "category": "Bánh Truyền Thống",
    "sizes": [],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery11_1/500/500",
        "altText": "Ảnh sản phẩm 11 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery11_2/500/500",
        "altText": "Ảnh sản phẩm 11 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 46
  },
  {
    "name": "Bánh Bánh Lạnh Đặc Biệt 12",
    "description": "Sản phẩm bánh lạnh thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 367154,
    "discountPrice": 283660,
    "countInStock": 6,
    "sku": "BÁN-112",
    "category": "Bánh Lạnh",
    "sizes": [
      "Gói 1kg"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery12_1/500/500",
        "altText": "Ảnh sản phẩm 12 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery12_2/500/500",
        "altText": "Ảnh sản phẩm 12 - góc 2"
      }
    ],
    "rating": 4.4,
    "numReviews": 41
  },
  {
    "name": "Bánh Bánh Truyền Thống Đặc Biệt 13",
    "description": "Sản phẩm bánh truyền thống thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 368010,
    "discountPrice": 311005,
    "countInStock": 17,
    "sku": "BÁN-113",
    "category": "Bánh Truyền Thống",
    "sizes": [
      "22cm",
      "26cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery13_1/500/500",
        "altText": "Ảnh sản phẩm 13 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery13_2/500/500",
        "altText": "Ảnh sản phẩm 13 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 48
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 14",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 216606,
    "discountPrice": 108638,
    "countInStock": 8,
    "sku": "NGU-114",
    "category": "Nguyên Liệu",
    "sizes": [
      "16cm",
      "18cm",
      "22cm"
    ],
    "flavors": [
      "Dâu",
      "Vanilla"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery14_1/500/500",
        "altText": "Ảnh sản phẩm 14 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery14_2/500/500",
        "altText": "Ảnh sản phẩm 14 - góc 2"
      }
    ],
    "rating": 4.6,
    "numReviews": 46
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 15",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 255087,
    "discountPrice": 207641,
    "countInStock": 11,
    "sku": "BÁN-115",
    "category": "Bánh Kem",
    "sizes": [],
    "flavors": [
      "Dâu",
      "Vanilla"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery15_1/500/500",
        "altText": "Ảnh sản phẩm 15 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery15_2/500/500",
        "altText": "Ảnh sản phẩm 15 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 7
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 16",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 154759,
    "discountPrice": 332981,
    "countInStock": 16,
    "sku": "NGU-116",
    "category": "Nguyên Liệu",
    "sizes": [
      "Gói 1kg"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery16_1/500/500",
        "altText": "Ảnh sản phẩm 16 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery16_2/500/500",
        "altText": "Ảnh sản phẩm 16 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 17
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 17",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 183036,
    "discountPrice": 167127,
    "countInStock": 19,
    "sku": "NGU-117",
    "category": "Nguyên Liệu",
    "sizes": [
      "16cm",
      "18cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery17_1/500/500",
        "altText": "Ảnh sản phẩm 17 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery17_2/500/500",
        "altText": "Ảnh sản phẩm 17 - góc 2"
      }
    ],
    "rating": 4.5,
    "numReviews": 25
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 18",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 181309,
    "discountPrice": 119253,
    "countInStock": 6,
    "sku": "NGU-118",
    "category": "Nguyên Liệu",
    "sizes": [
      "Gói 1kg"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery18_1/500/500",
        "altText": "Ảnh sản phẩm 18 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery18_2/500/500",
        "altText": "Ảnh sản phẩm 18 - góc 2"
      }
    ],
    "rating": 4.5,
    "numReviews": 36
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 19",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 382012,
    "discountPrice": 318704,
    "countInStock": 15,
    "sku": "NGU-119",
    "category": "Nguyên Liệu",
    "sizes": [
      "Hộp nhỏ",
      "Hộp lớn"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery19_1/500/500",
        "altText": "Ảnh sản phẩm 19 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery19_2/500/500",
        "altText": "Ảnh sản phẩm 19 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 11
  },
  {
    "name": "Bánh Bánh Truyền Thống Đặc Biệt 20",
    "description": "Sản phẩm bánh truyền thống thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 124197,
    "discountPrice": 152332,
    "countInStock": 23,
    "sku": "BÁN-120",
    "category": "Bánh Truyền Thống",
    "sizes": [
      "22cm",
      "26cm"
    ],
    "flavors": [
      "Chocolate"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery20_1/500/500",
        "altText": "Ảnh sản phẩm 20 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery20_2/500/500",
        "altText": "Ảnh sản phẩm 20 - góc 2"
      }
    ],
    "rating": 4.4,
    "numReviews": 48
  },
  {
    "name": "Bánh Bánh Lạnh Đặc Biệt 21",
    "description": "Sản phẩm bánh lạnh thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 180815,
    "discountPrice": 315729,
    "countInStock": 19,
    "sku": "BÁN-121",
    "category": "Bánh Lạnh",
    "sizes": [
      "16cm",
      "18cm",
      "22cm"
    ],
    "flavors": [
      "Matcha"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery21_1/500/500",
        "altText": "Ảnh sản phẩm 21 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery21_2/500/500",
        "altText": "Ảnh sản phẩm 21 - góc 2"
      }
    ],
    "rating": 4.5,
    "numReviews": 20
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 22",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 122901,
    "discountPrice": 188247,
    "countInStock": 18,
    "sku": "BÁN-122",
    "category": "Bánh Kem",
    "sizes": [
      "22cm",
      "26cm"
    ],
    "flavors": [
      "Dâu",
      "Vanilla"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery22_1/500/500",
        "altText": "Ảnh sản phẩm 22 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery22_2/500/500",
        "altText": "Ảnh sản phẩm 22 - góc 2"
      }
    ],
    "rating": 4.2,
    "numReviews": 4
  },
  {
    "name": "Bánh Bánh Truyền Thống Đặc Biệt 23",
    "description": "Sản phẩm bánh truyền thống thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 227722,
    "discountPrice": 287666,
    "countInStock": 30,
    "sku": "BÁN-123",
    "category": "Bánh Truyền Thống",
    "sizes": [
      "22cm",
      "26cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery23_1/500/500",
        "altText": "Ảnh sản phẩm 23 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery23_2/500/500",
        "altText": "Ảnh sản phẩm 23 - góc 2"
      }
    ],
    "rating": 4.7,
    "numReviews": 18
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 24",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 226705,
    "discountPrice": 306809,
    "countInStock": 9,
    "sku": "BÁN-124",
    "category": "Bánh Kem",
    "sizes": [
      "22cm",
      "26cm"
    ],
    "flavors": [
      "Cà phê",
      "Hạnh nhân"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery24_1/500/500",
        "altText": "Ảnh sản phẩm 24 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery24_2/500/500",
        "altText": "Ảnh sản phẩm 24 - góc 2"
      }
    ],
    "rating": 4.7,
    "numReviews": 41
  },
  {
    "name": "Bánh Nguyên Liệu Đặc Biệt 25",
    "description": "Sản phẩm nguyên liệu thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 399022,
    "discountPrice": 210640,
    "countInStock": 21,
    "sku": "NGU-125",
    "category": "Nguyên Liệu",
    "sizes": [
      "Hộp nhỏ",
      "Hộp lớn"
    ],
    "flavors": [
      "Chocolate"
    ],
    "images": [
      {
        "url": "https://picsum.photos/seed/bakery25_1/500/500",
        "altText": "Ảnh sản phẩm 25 - góc 1"
      },
      {
        "url": "https://picsum.photos/seed/bakery25_2/500/500",
        "altText": "Ảnh sản phẩm 25 - góc 2"
      }
    ],
    "rating": 4.7,
    "numReviews": 34
  }
];

module.exports = products;