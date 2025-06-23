import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useState({});
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "", // Loại bánh: "bánh kem", "bánh mì", ...
    flavor: "", // Hương vị: "Socola", "Dâu", ...
    size: "", // Kích thước: "10cm", "1kg", ...
    maxPrice: 1000000, // Giá tối đa, đơn vị VND
    minPrice: 0, // Giá tối thiểu, đơn vị VND
    // rating: 0,                 Tối thiểu sao (1-5)
    // shape: '',                 Hình dáng: "tròn", "vuông", ...
    // diet: '',                  Chế độ ăn: "chay", "gluten-free", ...
    // deliveryTime: '',          "Trong ngày", "2 giờ", ...
    // occasion: '',              Dịp: "Sinh nhật", "Valentine", ...
    // bestSeller: false,         Lọc bánh bán chạy
  });

  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const categories = [
    "Bánh ngọt",
    "Bánh Kem",
    "Bánh sinh nhật",
    "Bánh trung thu",
    "Bánh quy",
    "Bánh tart",
    "Bánh mousse",
    "Bánh cupcake",
    "Bánh su kem",
    "panacosta",
    "Bánh bông lan",
    "bánh cưới",
    
  ];
  const flavors = [
    "Socola",
    "Dâu",
    "Matcha",
    "Vanilla",
    "Trà xanh",
    "bánh oreo",
    "trái cây hỗn hợp",
    "Hạt dẻ cười",
    "Phô mai",
    "Cam",
    "Chanh dây",
  ];
  const sizes = [
    "10cm",
    "12cm",
    "14cm",
    "16cm",
    "18cm",
    "20cm",
    "22cm",
  ];

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    setFilters({
      category: params.category || "", // Loại bánh: "bánh kem", "bánh mì", ...
      flavor: params.flavor || "", // Hương vị: "Socola", "Dâu", ...
      size: params.size ? params.size.split(",") : [], // Kích thước: "10cm", "1kg", ...
      minPrice: params.minPrice ? parseInt(params.minPrice) : 0, // Giá tối thiểu, đơn vị VND
      maxPrice: params.maxPrice ? parseInt(params.maxPrice) : 1000000, // Giá tối đa, đơn vị VND
    });
    setPriceRange([
      params.minPrice ? parseInt(params.minPrice) : 0,
      params.maxPrice ? parseInt(params.maxPrice) : 1000000,
    ]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };
    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = (newFilters[name] || []).filter(
          (item) => item !== value
        );
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    // console.log(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`); // Cập nhật URL với các tham số mới
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = {
      ...filters,
      minPrice: 0,
      maxPrice: newPrice,
    };
    setFilters(filters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-pink-500 mb-4">Lọc sản phẩm</h3>
      {/* category filter */}
      <div className="mb-4">
        <label className="block text-[#f472b6] font-medium mb-2">
          Loại Bánh
        </label>
        <div className="flex items-center mb-1"></div>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              checked={filters.category === category}
              value={category}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* flavor filter */}

      <div className="mb-4">
        <label className="block text-[#f472b6] font-medium mb-2">Vị bánh</label>
        <div className="flex items-center mb-1"></div>
        {flavors.map((flavors) => (
          <div key={flavors} className="flex items-center mb-1">
            <input
              type="radio"
              name="flavor"
              value={flavors}
              checked={filters.flavor === flavors}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">{flavors}</span>
          </div>
        ))}
      </div>
      {/* size filter */}
      <div className="mb-4">
        <label className="block text-[#f472b6] font-medium mb-2">
          Size bánh
        </label>
        <div className="flex items-center mb-1"></div>
        {sizes.map((sizes) => (
          <div key={sizes} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={sizes}
              checked={filters.size.includes(sizes)}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">{sizes}</span>
          </div>
        ))}
      </div>
      {/* Price filter */}
      <div className="mb-8">
        <label className="block text-[#f472b6] font-medium mb-2">
          Khoảng giá
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={1000000}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0 VND</span>
          <span>{priceRange[1]} VND</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
