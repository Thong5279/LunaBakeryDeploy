import React, { useState, useEffect, useRef } from 'react';
import { FiMic, FiMicOff, FiVolume2 } from 'react-icons/fi';

const VoiceSearch = ({ onVoiceResult, isListening, setIsListening }) => {
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Kiểm tra hỗ trợ Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            
            // Cấu hình recognition
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'vi-VN'; // Tiếng Việt
            
            // Xử lý kết quả
            recognitionRef.current.onresult = (event) => {
                const result = event.results[0][0].transcript;
                setTranscript(result);
                onVoiceResult(result);
                setIsListening(false);
            };
            
            // Xử lý lỗi
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError('Không thể nhận diện giọng nói. Vui lòng thử lại.');
                setIsListening(false);
            };
            
            // Xử lý kết thúc
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setIsSupported(false);
            setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
        }
    }, [onVoiceResult, setIsListening]);

    const startListening = () => {
        if (!isSupported) {
            setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
            return;
        }

        try {
            setError('');
            setTranscript('');
            setIsListening(true);
            recognitionRef.current.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            setError('Không thể bắt đầu nhận diện giọng nói.');
            setIsListening(false);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
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

    if (!isSupported) {
        return (
            <button
                className="p-2 text-gray-400 cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Trình duyệt không hỗ trợ nhận diện giọng nói"
                disabled
            >
                <FiMic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleMicClick}
                className={`p-2 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-lg'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                }`}
                title={isListening ? 'Dừng nhận diện giọng nói' : 'Tìm kiếm bằng giọng nói'}
            >
                {isListening ? (
                    <FiMicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                    <FiMic className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
            </button>
            
            {/* Hiển thị trạng thái nhận diện */}
            {isListening && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                    <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                            <div className="w-1 h-2 sm:h-3 bg-white rounded-full animate-pulse"></div>
                            <div className="w-1 h-2 sm:h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-2 sm:h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs">Đang nghe...</span>
                    </div>
                </div>
            )}
            
            {/* Hiển thị kết quả nhận diện */}
            {transcript && !isListening && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 max-w-[200px] sm:max-w-xs">
                    <div className="flex items-center gap-1">
                        <FiVolume2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">"{transcript}"</span>
                    </div>
                </div>
            )}
            
            {/* Hiển thị lỗi */}
            {error && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 max-w-[200px] sm:max-w-xs">
                    <span className="truncate">{error}</span>
                </div>
            )}
        </div>
    );
};

export default VoiceSearch; 