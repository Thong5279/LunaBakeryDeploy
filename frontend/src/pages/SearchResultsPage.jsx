import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiShoppingBag } from 'react-icons/fi';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({ products: [], ingredients: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query && query.length >= 2) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsResponse, ingredientsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/products?search=${encodeURIComponent(query)}&limit=20`),
        axios.get(`${API_URL}/api/ingredients?search=${encodeURIComponent(query)}&limit=20`)
      ]);

      setResults({
        products: productsResponse.data || [],
        ingredients: ingredientsResponse.data?.data || []
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const totalResults = results.products.length + results.ingredients.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tìm kiếm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FiSearch className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Kết quả tìm kiếm
            </h1>
          </div>
          {query && (
            <p className="text-gray-600">
              Tìm kiếm cho: <span className="font-semibold text-pink-600">"{query}"</span>
            </p>
          )}
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!query || query.length < 2 ? (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nhập từ khóa để tìm kiếm
            </h2>
            <p className="text-gray-500">
              Tìm kiếm sản phẩm bánh và nguyên liệu trên toàn bộ website
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy kết quả
            </h2>
            <p className="text-gray-500 mb-4">
              Không có sản phẩm nào phù hợp với từ khóa "{query}"
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Gợi ý:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Kiểm tra chính tả từ khóa</li>
                <li>Thử sử dụng từ khóa khác</li>
                <li>Sử dụng từ khóa tổng quát hơn</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold text-pink-600">{totalResults}</span> kết quả
                {results.products.length > 0 && (
                  <span> • <span className="font-medium">{results.products.length}</span> sản phẩm bánh</span>
                )}
                {results.ingredients.length > 0 && (
                  <span> • <span className="font-medium">{results.ingredients.length}</span> nguyên liệu</span>
                )}
              </p>
            </div>

            {/* Products Section */}
            {results.products.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FiShoppingBag className="w-5 h-5 text-pink-500" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sản phẩm bánh ({results.products.length})
                  </h2>
                  <Link 
                    to={`/collections/all?search=${encodeURIComponent(query)}`}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Xem tất cả →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.products.slice(0, 8).map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200"
                    >
                                             <div className="relative overflow-hidden bg-gray-50 h-48">
                         {product.images && product.images.length > 0 ? (
                           <img
                             src={product.images[0].url || product.images[0]}
                             alt={product.name}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             onError={(e) => {
                               e.target.style.display = 'none';
                               e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                             }}
                           />
                         ) : null}
                         <div className={`fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
                           <FiShoppingBag className="w-16 h-16 text-pink-300" />
                         </div>
                       </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
                            {product.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                          {product.name}
                        </h3>

                                                 <div className="flex items-center justify-between">
                           {product.discountPrice && product.discountPrice < product.price ? (
                             <div className="flex flex-col">
                               <span className="text-lg font-bold text-pink-600">
                                 {formatPrice(product.discountPrice)}
                               </span>
                               <span className="text-sm text-gray-500 line-through">
                                 {formatPrice(product.price)}
                               </span>
                             </div>
                           ) : (
                             <span className="text-lg font-bold text-gray-900">
                               {formatPrice(product.discountPrice || product.price)}
                             </span>
                           )}
                         </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients Section */}
            {results.ingredients.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FiPackage className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Nguyên liệu ({results.ingredients.length})
                  </h2>
                  <Link 
                    to={`/ingredients?search=${encodeURIComponent(query)}`}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Xem tất cả →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.ingredients.slice(0, 8).map((ingredient) => (
                    <div
                      key={ingredient._id}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
                    >
                                             <div className="relative overflow-hidden bg-gray-50 h-48">
                         {ingredient.images && ingredient.images.length > 0 ? (
                           <img
                             src={ingredient.images[0]}
                             alt={ingredient.name}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             onError={(e) => {
                               e.target.style.display = 'none';
                               e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                             }}
                           />
                         ) : null}
                         <div className={`fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 ${ingredient.images && ingredient.images.length > 0 ? 'hidden' : ''}`}>
                           <FiPackage className="w-16 h-16 text-green-300" />
                         </div>
                       </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            {ingredient.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                          {ingredient.name}
                        </h3>

                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Số lượng:</span> {ingredient.quantity} {ingredient.unit}
                          </div>
                        </div>

                                                 <div className="flex items-center justify-between">
                           {ingredient.discountPrice && ingredient.discountPrice < ingredient.price ? (
                             <div className="flex flex-col">
                               <span className="text-lg font-bold text-green-600">
                                 {formatPrice(ingredient.discountPrice)}
                               </span>
                               <span className="text-sm text-gray-500 line-through">
                                 {formatPrice(ingredient.price)}
                               </span>
                             </div>
                           ) : (
                             <span className="text-lg font-bold text-gray-900">
                               {formatPrice(ingredient.discountPrice || ingredient.price)}
                             </span>
                           )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage; 