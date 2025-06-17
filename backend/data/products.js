const products = [
  {
    "name": "Bánh Bánh Kem Đặc Biệt 1",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 360529,
    "discountPrice": 350097,
    "countInStock": 11,
    "sku": "BÁN-101",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=2",
        "altText": "Ảnh sản phẩm 1 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=3",
        "altText": "Ảnh sản phẩm 1 - góc 2"
      }
    ],
    "rating": 4.3,
    "numReviews": 28
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 2",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 298365,
    "discountPrice": 285807,
    "countInStock": 19,
    "sku": "BÁN-102",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=4",
        "altText": "Ảnh sản phẩm 2 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=5",
        "altText": "Ảnh sản phẩm 2 - góc 2"
      }
    ],
    "rating": 4.9,
    "numReviews": 37
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 3",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 326904,
    "discountPrice": 310652,
    "countInStock": 7,
    "sku": "BÁN-103",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=6",
        "altText": "Ảnh sản phẩm 3 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=7",
        "altText": "Ảnh sản phẩm 3 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 21
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 4",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 362792,
    "discountPrice": 352289,
    "countInStock": 17,
    "sku": "BÁN-104",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=8",
        "altText": "Ảnh sản phẩm 4 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=9",
        "altText": "Ảnh sản phẩm 4 - góc 2"
      }
    ],
    "rating": 4.9,
    "numReviews": 11
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 5",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 330068,
    "discountPrice": 328840,
    "countInStock": 21,
    "sku": "BÁN-105",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=10",
        "altText": "Ảnh sản phẩm 5 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=11",
        "altText": "Ảnh sản phẩm 5 - góc 2"
      }
    ],
    "rating": 4.6,
    "numReviews": 10
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 6",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 225336,
    "discountPrice": 216668,
    "countInStock": 23,
    "sku": "BÁN-106",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=12",
        "altText": "Ảnh sản phẩm 6 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=13",
        "altText": "Ảnh sản phẩm 6 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 31
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 7",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 200350,
    "discountPrice": 181994,
    "countInStock": 19,
    "sku": "BÁN-107",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=14",
        "altText": "Ảnh sản phẩm 7 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=15",
        "altText": "Ảnh sản phẩm 7 - góc 2"
      }
    ],
    "rating": 4.7,
    "numReviews": 50
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 8",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 388690,
    "discountPrice": 385215,
    "countInStock": 29,
    "sku": "BÁN-108",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=16",
        "altText": "Ảnh sản phẩm 8 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=17",
        "altText": "Ảnh sản phẩm 8 - góc 2"
      }
    ],
    "rating": 4.5,
    "numReviews": 38
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 9",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 233368,
    "discountPrice": 231339,
    "countInStock": 6,
    "sku": "BÁN-109",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=18",
        "altText": "Ảnh sản phẩm 9 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=19",
        "altText": "Ảnh sản phẩm 9 - góc 2"
      }
    ],
    "rating": 4.6,
    "numReviews": 17
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 10",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 351168,
    "discountPrice": 335668,
    "countInStock": 29,
    "sku": "BÁN-110",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=20",
        "altText": "Ảnh sản phẩm 10 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=21",
        "altText": "Ảnh sản phẩm 10 - góc 2"
      }
    ],
    "rating": 5.0,
    "numReviews": 29
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 11",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 210861,
    "discountPrice": 196173,
    "countInStock": 8,
    "sku": "BÁN-111",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=22",
        "altText": "Ảnh sản phẩm 11 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=23",
        "altText": "Ảnh sản phẩm 11 - góc 2"
      }
    ],
    "rating": 4.2,
    "numReviews": 50
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 12",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 358834,
    "discountPrice": 356704,
    "countInStock": 12,
    "sku": "BÁN-112",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=24",
        "altText": "Ảnh sản phẩm 12 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=25",
        "altText": "Ảnh sản phẩm 12 - góc 2"
      }
    ],
    "rating": 5.0,
    "numReviews": 16
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 13",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 278994,
    "discountPrice": 276904,
    "countInStock": 15,
    "sku": "BÁN-113",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=26",
        "altText": "Ảnh sản phẩm 13 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=27",
        "altText": "Ảnh sản phẩm 13 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 34
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 14",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 254141,
    "discountPrice": 252917,
    "countInStock": 13,
    "sku": "BÁN-114",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=28",
        "altText": "Ảnh sản phẩm 14 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=29",
        "altText": "Ảnh sản phẩm 14 - góc 2"
      }
    ],
    "rating": 4.9,
    "numReviews": 15
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 15",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 285240,
    "discountPrice": 274102,
    "countInStock": 19,
    "sku": "BÁN-115",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=30",
        "altText": "Ảnh sản phẩm 15 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=31",
        "altText": "Ảnh sản phẩm 15 - góc 2"
      }
    ],
    "rating": 4.2,
    "numReviews": 5
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 16",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 320954,
    "discountPrice": 302992,
    "countInStock": 19,
    "sku": "BÁN-116",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=32",
        "altText": "Ảnh sản phẩm 16 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=33",
        "altText": "Ảnh sản phẩm 16 - góc 2"
      }
    ],
    "rating": 4.9,
    "numReviews": 37
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 17",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 244273,
    "discountPrice": 240982,
    "countInStock": 18,
    "sku": "BÁN-117",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=34",
        "altText": "Ảnh sản phẩm 17 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=35",
        "altText": "Ảnh sản phẩm 17 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 7
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 18",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 362507,
    "discountPrice": 345979,
    "countInStock": 29,
    "sku": "BÁN-118",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=36",
        "altText": "Ảnh sản phẩm 18 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=37",
        "altText": "Ảnh sản phẩm 18 - góc 2"
      }
    ],
    "rating": 4.5,
    "numReviews": 39
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 19",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 297595,
    "discountPrice": 294941,
    "countInStock": 8,
    "sku": "BÁN-119",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=38",
        "altText": "Ảnh sản phẩm 19 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=39",
        "altText": "Ảnh sản phẩm 19 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 31
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 20",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 205433,
    "discountPrice": 187847,
    "countInStock": 7,
    "sku": "BÁN-120",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=40",
        "altText": "Ảnh sản phẩm 20 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=41",
        "altText": "Ảnh sản phẩm 20 - góc 2"
      }
    ],
    "rating": 4.1,
    "numReviews": 9
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 21",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 227064,
    "discountPrice": 222477,
    "countInStock": 12,
    "sku": "BÁN-121",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=42",
        "altText": "Ảnh sản phẩm 21 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=43",
        "altText": "Ảnh sản phẩm 21 - góc 2"
      }
    ],
    "rating": 5.0,
    "numReviews": 10
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 22",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 292471,
    "discountPrice": 283494,
    "countInStock": 23,
    "sku": "BÁN-122",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=44",
        "altText": "Ảnh sản phẩm 22 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=45",
        "altText": "Ảnh sản phẩm 22 - góc 2"
      }
    ],
    "rating": 4.4,
    "numReviews": 17
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 23",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 218420,
    "discountPrice": 203456,
    "countInStock": 30,
    "sku": "BÁN-123",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=46",
        "altText": "Ảnh sản phẩm 23 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=47",
        "altText": "Ảnh sản phẩm 23 - góc 2"
      }
    ],
    "rating": 4.0,
    "numReviews": 32
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 24",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 350583,
    "discountPrice": 342505,
    "countInStock": 21,
    "sku": "BÁN-124",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=48",
        "altText": "Ảnh sản phẩm 24 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=49",
        "altText": "Ảnh sản phẩm 24 - góc 2"
      }
    ],
    "rating": 4.9,
    "numReviews": 14
  },
  {
    "name": "Bánh Bánh Kem Đặc Biệt 25",
    "description": "Sản phẩm bánh kem thơm ngon, chất lượng cao, thích hợp cho mọi dịp.",
    "price": 262981,
    "discountPrice": 254416,
    "countInStock": 27,
    "sku": "BÁN-125",
    "category": "Bánh Kem",
    "sizes": [
      "18cm",
      "20cm",
      "22cm"
    ],
    "flavors": [
      "Phô mai"
    ],
    "images": [
      {
        "url": "https://picsum.photos/500/500?random=50",
        "altText": "Ảnh sản phẩm 25 - góc 1"
      },
      {
        "url": "https://picsum.photos/500/500?random=51",
        "altText": "Ảnh sản phẩm 25 - góc 2"
      }
    ],
    "rating": 4.8,
    "numReviews": 11
  }
];

module.exports = products;