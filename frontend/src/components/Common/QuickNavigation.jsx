import React, { useState, useEffect } from 'react';
import { FaHome, FaCookieBite, FaStar, FaFire, FaGift, FaArrowUp, FaBolt } from 'react-icons/fa';

const QuickNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: 'hero', name: 'Trang Chủ', icon: FaHome },
    { id: 'flash-sale', name: 'Flash Sale', icon: FaBolt },
    { id: 'categories', name: 'Danh Mục', icon: FaCookieBite },
    { id: 'new-arrivals', name: 'Mới Nhất', icon: FaGift },
    { id: 'featured', name: 'Đặc Biệt', icon: FaStar },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      setShowScrollTop(window.scrollY > 300);

      // Determine active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Account for sticky nav height
      const yPosition = element.offsetTop + yOffset;
      window.scrollTo({ top: yPosition, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Quick Navigation - Desktop */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 last:mb-0 transition-all duration-300 group relative ${
                  activeSection === section.id
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                }`}
                title={section.name}
              >
                <IconComponent className="text-lg" />
                
                {/* Tooltip */}
                <div className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {section.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 z-40 flex items-center justify-center"
          title="Về đầu trang"
        >
          <FaArrowUp className="text-lg" />
        </button>
      )}

      {/* Mobile Quick Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 lg:hidden">
        <div className="flex justify-around py-3 px-2">
          {sections.slice(0, 5).map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors min-h-[44px] justify-center ${
                  activeSection === section.id
                    ? 'text-pink-500 bg-pink-50'
                    : 'text-gray-400 hover:text-pink-500'
                }`}
              >
                <IconComponent className="text-lg sm:text-xl mb-1" />
                <span className="text-xs font-medium">{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default QuickNavigation; 