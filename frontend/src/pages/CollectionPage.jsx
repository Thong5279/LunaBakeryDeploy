import React, { useState, useEffect,useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleClickOutside = (e) => {
    // close sidebar if click outside of it
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
    };


  useEffect(() => {
        // add event listenner for click
        document.addEventListener('mousedown', handleClickOutside);
        //clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    })

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
        {
          _id: "5",
          name: "product 5",
          price: 50000,
          originalPrice: 60000,
          images: [{ url: "https://picsum.photos/500/500?random=9" }],
        },
        {
          _id: "6",
          name: "product 6",
          price: 60000,
          originalPrice: 70000,
          images: [{ url: "https://picsum.photos/500/500?random=10" }],
        },
        {
          _id: "7",
          name: "product 7",
          price: 70000,
          originalPrice: 80000,
          images: [{ url: "https://picsum.photos/500/500?random=11" }],
        },
        {
          _id: "8",
          name: "product 8",
          price: 80000,
          originalPrice: 90000,
          images: [{ url: "https://picsum.photos/500/500?random=12" }],
        },
        {
          _id: "9",
          name: "product 9",
          price: 90000,
          originalPrice: 100000,
          images: [{ url: "https://picsum.photos/500/500?random=13" }],
        },
        {
          _id: "10",
          name: "product 10",
          price: 100000,
          originalPrice: 110000,
          images: [{ url: "https://picsum.photos/500/500?random=14" }],
        },
        {
          _id: "11",
          name: "product 11",
          price: 110000,
          originalPrice: 120000,
          images: [{ url: "https://picsum.photos/500/500?random=15" }],
        },
        {
          _id: "12",
          name: "product 12",
          price: 120000,
          originalPrice: 130000,
          images: [{ url: "https://picsum.photos/500/500?random=16" }],
        },
      ];
      setProducts(fetchedProducts); // cập nhật state tại đây
    }, 1000); // thời gian delay (1 giây)
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
        {/* Mobile filter button */}
        <button onClick={toggleSidebar} className='lg:hidden border p-2 flex justify-center items-center'>
            <FaFilter className='mr-2'/> Lọc sản phẩm 
        </button>

        {/* filter sidebar */}
     <div ref={sidebarRef} 
     className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64
      bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:w-1/4 lg:shadow-none`}
      >
        <FilterSidebar/>
     </div>
     <div className="flex-grow p-4">
        <h2 className='text-2xl uppercase mb-4'>Toàn bộ sản phẩm</h2>

        {/* sort Options */}
        <SortOptions/>

        {/* product grid */}
        <ProductGrid products={products} />
     </div>
    </div>
  );
};

export default CollectionPage;
