import React, { useState } from 'react';
import { FiMic, FiMicOff, FiVolume2, FiX, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useVoiceSearch from '../../hooks/useVoiceSearch';

const VoiceSearchModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const {
        isListening,
        transcript,
        isSupported,
        error,
        toggleListening,
        clearTranscript,
    } = useVoiceSearch();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        const term = searchTerm.trim() || transcript.trim();
        if (term) {
            navigate(`/search?q=${encodeURIComponent(term)}`);
            onClose();
            setSearchTerm('');
            clearTranscript();
        }
    };

    const handleVoiceResult = (result) => {
        setSearchTerm(result);
        // Tự động tìm kiếm sau khi nhận diện
        setTimeout(() => {
            navigate(`/search?q=${encodeURIComponent(result.trim())}`);
            onClose();
            setSearchTerm('');
            clearTranscript();
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-2">
                        🎤 Tìm kiếm bằng giọng nói
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Nói tên sản phẩm hoặc nguyên liệu bạn muốn tìm kiếm
                    </p>
                </div>

                {/* Voice Search Button */}
                <div className="text-center mb-4 sm:mb-6">
                    <button
                        onClick={toggleListening}
                        disabled={!isSupported}
                        className={`p-4 sm:p-6 rounded-full transition-all duration-300 min-h-[80px] min-w-[80px] flex items-center justify-center ${
                            isListening
                                ? 'bg-red-500 text-white animate-pulse shadow-lg scale-110'
                                : isSupported
                                ? 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-105 shadow-md'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        title={
                            isListening 
                                ? 'Dừng nhận diện giọng nói' 
                                : isSupported 
                                ? 'Bắt đầu tìm kiếm bằng giọng nói'
                                : 'Trình duyệt không hỗ trợ nhận diện giọng nói'
                        }
                    >
                        {isListening ? (
                            <FiMicOff className="w-6 h-6 sm:w-8 sm:h-8" />
                        ) : (
                            <FiMic className="w-6 h-6 sm:w-8 sm:h-8" />
                        )}
                    </button>
                    
                    {/* Status indicator */}
                    {isListening && (
                        <div className="mt-3 sm:mt-4">
                            <div className="flex justify-center space-x-1 mb-2">
                                <div className="w-1 sm:w-2 h-4 sm:h-6 bg-pink-500 rounded-full animate-pulse"></div>
                                <div className="w-1 sm:w-2 h-4 sm:h-6 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 sm:w-2 h-4 sm:h-6 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-1 sm:w-2 h-4 sm:h-6 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                            <p className="text-xs sm:text-sm text-pink-600 font-medium">Đang nghe...</p>
                        </div>
                    )}
                </div>

                {/* Transcript Display */}
                {transcript && !isListening && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FiVolume2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            <span className="text-xs sm:text-sm font-medium text-green-800">Kết quả nhận diện:</span>
                        </div>
                        <p className="text-sm sm:text-lg font-semibold text-green-900">"{transcript}"</p>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Manual Search Input */}
                <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Hoặc nhập từ khóa tìm kiếm:
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập tên sản phẩm..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm sm:text-base"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={!searchTerm.trim() && !transcript.trim()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-pink-600 hover:text-pink-700 disabled:text-gray-400 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                            <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={!searchTerm.trim() && !transcript.trim()}
                    className="w-full bg-pink-500 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[44px]"
                >
                    Tìm kiếm
                </button>

                {/* Tips */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 text-center">
                        💡 <strong>Gợi ý:</strong> Thử nói "bánh chocolate", "nguyên liệu bột mì", "bánh sinh nhật"...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VoiceSearchModal; 