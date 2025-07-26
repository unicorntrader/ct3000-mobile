import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Check screen width (768px is typical mobile breakpoint)
      const screenWidth = window.innerWidth <= 768;
      
      // Check for touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Mobile if any condition is true
      setIsMobile(mobileUserAgent || screenWidth || hasTouch);
    };

    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};