import React from 'react'
import { FiSearch } from 'react-icons/fi';
import { HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setFilters, fetchProductsByFilters } from '../../redux/slices/productsSlice';

const Searchbar = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle keyboard events
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClear();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Clear search term when opening
            setSearchTerm('');
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        
        // Dispatch filters for products
        dispatch(setFilters({search: searchTerm.trim()}));
        dispatch(fetchProductsByFilters({search : searchTerm.trim()}))
        
        // Navigate to products page with search
        navigate(`/collections/all?search=${encodeURIComponent(searchTerm.trim())}`);
        setIsOpen(false);
        setSearchTerm('');
    }

    const handleClear = () => {
        setSearchTerm('');
        setIsOpen(false);
    }

    return (
        <div
            className={`flex items-center justify-center w-full transition-all duration-300 ${
            isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50 shadow-lg" : "w-auto"
            }`}
        >
            {isOpen ? (
            <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full border-b-2 border-pink-300 py-2'> 
               <div className='relative w-1/2 max-w-md'>
                <input 
                    type="text"
                    placeholder='Tìm kiếm sản phẩm trong toàn bộ website...'
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className='bg-gray-50 px-4 py-3 pl-4 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white border border-gray-200 w-full placeholder:text-gray-500 text-gray-800' 
                />
               {/* Icon tìm kiếm */}
               <button 
                    type='submit' 
                    disabled={!searchTerm.trim()}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                        searchTerm.trim() 
                            ? 'text-pink-600 hover:text-pink-700 hover:bg-pink-50' 
                            : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <FiSearch className='w-5 h-5'/> 
                </button>
               </div>
               
               {/* close button */}
                <button 
                    type='button' 
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors' 
                    onClick={handleClear}
                >
                    <HiMiniXMark className='w-6 h-6'/>
                </button>
                
                {/* Search instruction */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-500 whitespace-nowrap">
                    Nhấn Enter để tìm kiếm • ESC để đóng
                </div>
            </form>
            ) : (
                <button 
                    onClick={handleSearchToggle}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Tìm kiếm sản phẩm"
                >
                    <FiSearch className='w-6 h-6 text-gray-700 hover:text-pink-600'/>
                </button> 
            )}
        </div>
    )
}

export default Searchbar