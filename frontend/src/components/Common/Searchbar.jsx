import React, { useState, useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi';
import { HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setFilters, fetchProductsByFilters } from '../../redux/slices/productsSlice';
import axios from 'axios';
import VoiceSearch from './VoiceSearch';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const Searchbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [isListening, setIsListening] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Debounce function
    const useDebounce = (value, delay) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            
            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);
        
        return debouncedValue;
    };

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
                setIsLoading(true);
                try {
                    const response = await axios.get(
                        `${API_URL}/api/products/search-suggestions?q=${encodeURIComponent(debouncedSearchTerm)}`
                    );
                    setSuggestions(response.data || []);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        if (isOpen) {
            fetchSuggestions();
        }
    }, [debouncedSearchTerm, isOpen]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                handleClear();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
                    handleSuggestionClick(suggestions[activeSuggestion]);
                } else {
                    handleSearch(e);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, suggestions, activeSuggestion]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchInputRef.current && 
                !searchInputRef.current.contains(e.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchTerm('');
            setSuggestions([]);
            setShowSuggestions(false);
            setActiveSuggestion(-1);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        
        // Navigate to global search results page
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        handleClear();
    }

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'product') {
            navigate(suggestion.url);
        } else if (suggestion.type === 'ingredient') {
            navigate(suggestion.url);
        }
        handleClear();
    }

    const handleClear = () => {
        setSearchTerm('');
        setIsOpen(false);
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        setIsListening(false);
    }

    const handleVoiceResult = (result) => {
        setSearchTerm(result);
        // Tự động tìm kiếm sau khi nhận diện giọng nói
        setTimeout(() => {
            navigate(`/search?q=${encodeURIComponent(result.trim())}`);
            handleClear();
        }, 1000);
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
    };

    return (
        <div
            className={`flex items-center justify-center w-full transition-all duration-300 ${
            isOpen ? "absolute top-0 left-0 w-full bg-white h-auto z-50 shadow-lg" : "w-auto"
            }`}
        >
            {isOpen ? (
            <div className="w-full">
                <form onSubmit={handleSearch} className='relative flex items-center justify-center w-full border-b-2 border-pink-300 py-4'> 
                   <div className='relative w-1/2 max-w-md' ref={searchInputRef}>
                    <input 
                        type="text"
                        placeholder='Tìm kiếm sản phẩm, nguyên liệu...'
                        value={searchTerm} 
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setActiveSuggestion(-1);
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        autoFocus
                        className='bg-gray-50 px-4 py-3 pl-4 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white border border-gray-200 w-full placeholder:text-gray-500 text-gray-800' 
                    />
                   {/* Voice Search Button */}
                   <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <VoiceSearch 
                            onVoiceResult={handleVoiceResult}
                            isListening={isListening}
                            setIsListening={setIsListening}
                        />
                        
                        {/* Loading or Search icon */}
                        <button 
                            type='submit' 
                            disabled={!searchTerm.trim() || isLoading}
                            className={`p-1 rounded-full transition-colors ${
                                searchTerm.trim() && !isLoading
                                    ? 'text-pink-600 hover:text-pink-700 hover:bg-pink-50' 
                                    : 'text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                            ) : (
                                <FiSearch className='w-5 h-5'/> 
                            )}
                        </button>
                   </div>
                   </div>
                   
                   {/* close button */}
                    <button 
                        type='button' 
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors' 
                        onClick={handleClear}
                    >
                        <HiMiniXMark className='w-6 h-6'/>
                    </button>
                </form>

                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                    <div 
                        ref={suggestionsRef}
                        className="absolute left-1/2 transform -translate-x-1/2 w-1/2 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-60"
                    >
                        <div className="p-3 border-b border-gray-100">
                            <p className="text-sm text-gray-600 font-medium">Gợi ý tìm kiếm</p>
                        </div>
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={`${suggestion.type}-${suggestion.id}`}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                                    index === activeSuggestion ? 'bg-pink-50' : ''
                                }`}
                            >
                                {/* Image */}
                                <div className="w-12 h-12 flex-shrink-0 mr-3">
                                    {suggestion.image ? (
                                        <img 
                                            src={suggestion.image} 
                                            alt={suggestion.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                            <FiSearch className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {suggestion.name}
                                        </h4>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                            suggestion.type === 'product' 
                                                ? 'bg-pink-100 text-pink-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {suggestion.type === 'product' ? '🧁 Bánh' : '🥄 Nguyên liệu'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 truncate">{suggestion.category}</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatPrice(suggestion.price)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* View all results */}
                        <div className="p-3 bg-gray-50">
                            <button
                                onClick={() => handleSearch({ preventDefault: () => {} })}
                                className="w-full text-sm text-pink-600 hover:text-pink-700 font-medium text-center py-1"
                            >
                                Xem tất cả kết quả cho "{searchTerm}"
                            </button>
                        </div>
                    </div>
                )}

                {/* Search instruction */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-500 whitespace-nowrap">
                    ↑↓ để điều hướng • Enter để chọn • ESC để đóng
                </div>
            </div>
            ) : (
                <button 
                    onClick={handleSearchToggle}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Tìm kiếm sản phẩm và nguyên liệu"
                >
                    <FiSearch className='w-6 h-6 text-gray-700 hover:text-pink-600'/>
                </button> 
            )}
        </div>
    )
}

export default Searchbar