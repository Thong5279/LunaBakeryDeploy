import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CATEGORIES, PRODUCT_FLAVORS, PRODUCT_SIZES } from "../../constants/productConstants";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useState({});
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "", // Tìm kiếm
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

  // Sử dụng constants từ file riêng
  const categories = PRODUCT_CATEGORIES;
  const flavors = PRODUCT_FLAVORS;
  const sizes = PRODUCT_SIZES;

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    setFilters({
      search: params.search || "", // Tìm kiếm
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

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    const newFilters = { ...filters, search: searchValue };
    setFilters(newFilters);
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

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "",
      flavor: "",
      size: [],
      maxPrice: 1000000,
      minPrice: 0,
    });
    setPriceRange([0, 1000000]);
    navigate(window.location.pathname); // Clear URL params
  };

  const hasActiveFilters = filters.search || filters.category || filters.flavor || filters.size.length > 0 || filters.maxPrice < 1000000 || filters.minPrice > 0;

  return (
    <div className="p-4 h-full h-full overflow-y-auto">
      {/* Header with clear button */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100">
        <h3 className="text-xl font-medium text-pink-500">Lọc sản phẩm</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            Xóa lọc
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-2">
            Tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm"
          />
        </div>

        {/* category filter */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-2">
            Loại Bánh
          </label>
          <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === ""}
                value=""
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 font-medium">Tất cả loại bánh</span>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  value={category}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* flavor filter */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-2">Vị bánh</label>
          <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="flavor"
                checked={filters.flavor === ""}
                value=""
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 font-medium">Tất cả vị bánh</span>
            </div>
            {flavors.map((flavor) => (
              <div key={flavor} className="flex items-center">
                <input
                  type="radio"
                  name="flavor"
                  value={flavor}
                  checked={filters.flavor === flavor}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm">{flavor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* size filter */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-2">
            Size bánh
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center">
                <input
                  type="checkbox"
                  name="size"
                  value={size}
                  checked={filters.size.includes(size)}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm">{size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price filter */}
        <div>
          <label className="block text-[#f472b6] font-medium mb-2">
            Khoảng giá
          </label>
          <div className="px-2">
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
              <span>0 ₫</span>
              <span className="font-medium">{new Intl.NumberFormat("vi-VN").format(priceRange[1])} ₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
