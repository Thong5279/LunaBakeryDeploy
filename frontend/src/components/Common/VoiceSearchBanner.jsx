import React, { useState } from 'react';
import { FiMic, FiMicOff, FiVolume2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const VoiceSearchBanner = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState('');
    const [showBanner, setShowBanner] = useState(true);
    const [recognition, setRecognition] = useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        // Kiểm tra hỗ trợ Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            
            // Cấu hình recognition
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'vi-VN'; // Tiếng Việt
            
            // Xử lý kết quả
            recognitionInstance.onresult = (event) => {
                const result = event.results[0][0].transcript;
                setTranscript(result);
                setIsListening(false);
                
                // Tự động tìm kiếm sau khi nhận diện
                setTimeout(() => {
                    navigate(`/search?q=${encodeURIComponent(result.trim())}`);
                }, 1000);
            };
            
            // Xử lý lỗi
            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError('Không thể nhận diện giọng nói. Vui lòng thử lại.');
                setIsListening(false);
            };
            
            // Xử lý kết thúc
            recognitionInstance.onend = () => {
                setIsListening(false);
            };
            
            setRecognition(recognitionInstance);
        } else {
            setIsSupported(false);
            setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
        }
    }, [navigate]);

    const startListening = () => {
        if (!isSupported || !recognition) {
            setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
            return;
        }

        try {
            setError('');
            setTranscript('');
            setIsListening(true);
            recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            setError('Không thể bắt đầu nhận diện giọng nói.');
            setIsListening(false);
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
        setIsListening(false);
    };

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 relative">
            {/* Close button */}
            <button
                onClick={() => setShowBanner(false)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <FiX className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-pink-800 mb-1 sm:mb-2">
                        🎤 Tìm kiếm bằng giọng nói
                    </h3>
                    <p className="text-xs sm:text-sm text-pink-700 mb-2 sm:mb-3">
                        Nói tên sản phẩm hoặc nguyên liệu bạn muốn tìm kiếm
                    </p>
                    
                    {/* Hiển thị kết quả nhận diện */}
                    {transcript && !isListening && (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                            <div className="flex items-center gap-2">
                                <FiVolume2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                <span className="text-xs sm:text-sm font-medium text-green-800">
                                    "{transcript}"
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Hiển thị lỗi */}
                    {error && (
                        <div className="bg-red-100 border border-red-200 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                            <p className="text-xs sm:text-sm text-red-800">{error}</p>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex justify-center sm:ml-4">
                    <button
                        onClick={handleMicClick}
                        disabled={!isSupported}
                        className={`p-3 sm:p-4 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] ${
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
                            <FiMicOff className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                            <FiMic className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                    </button>
                    
                    {/* Hiển thị trạng thái nhận diện */}
                    {isListening && (
                        <div className="mt-2 text-center">
                            <div className="flex justify-center space-x-1 mb-1">
                                <div className="w-1 h-3 sm:h-4 bg-white rounded-full animate-pulse"></div>
                                <div className="w-1 h-3 sm:h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-3 sm:h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-1 h-3 sm:h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                            <p className="text-xs text-pink-600 font-medium">Đang nghe...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-pink-200">
                <p className="text-xs text-pink-600">
                    💡 <strong>Gợi ý:</strong> Thử nói "bánh chocolate", "nguyên liệu bột mì", "bánh sinh nhật"...
                </p>
            </div>
        </div>
    );
};

export default VoiceSearchBanner; 