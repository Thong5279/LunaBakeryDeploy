import { useState, useEffect, useRef } from 'react';

const useVoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);
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
    }, []);

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

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const clearTranscript = () => {
        setTranscript('');
        setError('');
    };

    return {
        isListening,
        transcript,
        isSupported,
        error,
        startListening,
        stopListening,
        toggleListening,
        clearTranscript,
    };
};

export default useVoiceSearch; 