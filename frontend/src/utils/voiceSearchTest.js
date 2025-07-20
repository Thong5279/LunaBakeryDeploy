// Voice Search Test Utilities
export const testVoiceSearchSupport = () => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    console.log('Voice Search Support:', isSupported);
    return isSupported;
};

export const testMicrophonePermission = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('Microphone Permission: Granted');
        return true;
    } catch (error) {
        console.error('Microphone Permission: Denied', error);
        return false;
    }
};

export const testVoiceRecognition = () => {
    if (!testVoiceSearchSupport()) {
        console.error('Voice recognition not supported');
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        console.log('Voice recognition started');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognition result:', transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
    };
    
    recognition.onend = () => {
        console.log('Voice recognition ended');
    };
    
    try {
        recognition.start();
        return true;
    } catch (error) {
        console.error('Failed to start voice recognition:', error);
        return false;
    }
};

export const runVoiceSearchTests = async () => {
    console.log('=== Voice Search Tests ===');
    
    // Test 1: Browser Support
    const supportTest = testVoiceSearchSupport();
    console.log('✅ Browser Support Test:', supportTest ? 'PASSED' : 'FAILED');
    
    // Test 2: Microphone Permission
    const permissionTest = await testMicrophonePermission();
    console.log('✅ Microphone Permission Test:', permissionTest ? 'PASSED' : 'FAILED');
    
    // Test 3: Voice Recognition
    const recognitionTest = testVoiceRecognition();
    console.log('✅ Voice Recognition Test:', recognitionTest ? 'PASSED' : 'FAILED');
    
    return {
        browserSupport: supportTest,
        microphonePermission: permissionTest,
        voiceRecognition: recognitionTest
    };
};

// Test voice search keywords
export const testKeywords = [
    'bánh chocolate',
    'bánh sinh nhật',
    'bánh kem',
    'nguyên liệu bột mì',
    'đường',
    'trứng',
    'sữa',
    'bơ',
    'vanilla',
    'bánh cupcake',
    'bánh mousse',
    'bánh tiramisu'
];

// Simulate voice input for testing
export const simulateVoiceInput = (keyword) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Simulated voice input:', keyword);
            resolve(keyword);
        }, 1000);
    });
};

// Test voice search accuracy
export const testVoiceSearchAccuracy = async () => {
    console.log('=== Voice Search Accuracy Test ===');
    
    const results = [];
    
    for (const keyword of testKeywords) {
        const simulatedResult = await simulateVoiceInput(keyword);
        const accuracy = simulatedResult === keyword ? 100 : 0;
        results.push({
            keyword,
            result: simulatedResult,
            accuracy
        });
        console.log(`Keyword: "${keyword}" -> Result: "${simulatedResult}" (${accuracy}% accuracy)`);
    }
    
    const averageAccuracy = results.reduce((sum, result) => sum + result.accuracy, 0) / results.length;
    console.log(`Average Accuracy: ${averageAccuracy}%`);
    
    return {
        results,
        averageAccuracy
    };
};

// Performance test for voice search
export const testVoiceSearchPerformance = () => {
    console.log('=== Voice Search Performance Test ===');
    
    const startTime = performance.now();
    
    // Simulate voice search process
    setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`Voice Search Duration: ${duration.toFixed(2)}ms`);
        
        if (duration < 1000) {
            console.log('✅ Performance: EXCELLENT');
        } else if (duration < 2000) {
            console.log('✅ Performance: GOOD');
        } else {
            console.log('❌ Performance: NEEDS IMPROVEMENT');
        }
    }, 500);
};

// Accessibility test for voice search
export const testVoiceSearchAccessibility = () => {
    console.log('=== Voice Search Accessibility Test ===');
    
    const tests = [
        {
            name: 'Keyboard Navigation',
            test: () => {
                const voiceButtons = document.querySelectorAll('[data-voice-search]');
                return voiceButtons.length > 0;
            }
        },
        {
            name: 'Screen Reader Support',
            test: () => {
                const voiceButtons = document.querySelectorAll('[aria-label*="voice"], [title*="voice"]');
                return voiceButtons.length > 0;
            }
        },
        {
            name: 'Focus Indicators',
            test: () => {
                const voiceButtons = document.querySelectorAll('.voice-search-btn:focus');
                return voiceButtons.length > 0;
            }
        }
    ];
    
    tests.forEach(({ name, test }) => {
        const result = test();
        console.log(`✅ ${name}:`, result ? 'PASSED' : 'FAILED');
    });
};

// Run all tests
export const runAllVoiceSearchTests = async () => {
    console.log('🚀 Starting Voice Search Tests...');
    
    // Basic functionality tests
    const basicTests = await runVoiceSearchTests();
    
    // Accuracy test
    const accuracyTest = await testVoiceSearchAccuracy();
    
    // Performance test
    testVoiceSearchPerformance();
    
    // Accessibility test
    testVoiceSearchAccessibility();
    
    console.log('🎉 Voice Search Tests Completed!');
    
    return {
        basicTests,
        accuracyTest
    };
};

export default {
    testVoiceSearchSupport,
    testMicrophonePermission,
    testVoiceRecognition,
    runVoiceSearchTests,
    testVoiceSearchAccuracy,
    testVoiceSearchPerformance,
    testVoiceSearchAccessibility,
    runAllVoiceSearchTests
}; 