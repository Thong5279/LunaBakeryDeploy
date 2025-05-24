import React from 'react'
import { FiSearch } from 'react-icons/fi';
import { HiMiniXMark } from 'react-icons/hi2';

const Searchbar = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
        // if (!isOpen) {
        //     setSearchTerm(''); // Reset search term when opening
        // }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        //Xử lý logic tìm kiếm ở đây, ví dụ: chuyển hướng đến trang kết quả tìm kiếm
        console.log("Searching for:", searchTerm);
        // Đặt lại thuật ngữ tìm kiếm sau khi gửi
        console.log("Search term submitted:", searchTerm);
        setIsOpen(false); // Đóng thanh tìm kiếm sau khi gửi
    }
  return (
     <div
        className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
        }`}
     >
        {isOpen ? (
        <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full'> 
           <div className='relative w-1/2'>
            <input type="text"
                placeholder='Tìm kiếm sản phẩm ...'
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className='bg-gray-100 px-4 pt-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700 ' />
           {/* Icon tìm kiếm */}
           <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
                <FiSearch className='w-6 h-6'/> 
              </button>
           </div>
           {/* close button */}
              <button type='button' className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800' onClick={handleSearchToggle}>
                 <HiMiniXMark className='w-6 h-6'/>
                </button>
        </form>
        ) : (
            <button onClick={handleSearchToggle}>
                <FiSearch className='w-6 h-6'/>
            </button> 
        )}
    </div>
  )
}

export default Searchbar