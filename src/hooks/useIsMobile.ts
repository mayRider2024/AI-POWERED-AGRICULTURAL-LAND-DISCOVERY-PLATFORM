import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Hook to determine whether the current device/viewport should use the mobile layout.
 *
 * Checks:
 * 1. Native platform detection: On Android / iOS Capacitor platforms, always treat portrait
 *    phones as mobile (and in fact all phones unless large tablet in landscape).
 * 2. Viewport width: window.innerWidth < 768px (standard Tailwind md boundary).
 * 3. Media query match: (max-width: 767.98px) or (orientation: portrait and max-device-width: 1024px).
 * 4. User agent detection: /Android|iPhone|iPod/i
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    const platform = Capacitor.getPlatform();
    const isNativeMobile = platform === 'android' || platform === 'ios';

    // On native Android/iOS phones, if screen width in portrait is standard phone (< 768px CSS or max dimension indicates phone),
    // or simply if on native mobile platform and not in a very wide landscape monitor:
    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const height = window.innerHeight || document.documentElement.clientHeight || 0;
    const isPortrait = height >= width;

    if (isNativeMobile && (isPortrait || width < 768)) {
      return true;
    }

    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    if (isMobileUA && (isPortrait || width < 768)) {
      return true;
    }

    return width < 768;
  });

  useEffect(() => {
    const checkMobile = () => {
      const platform = Capacitor.getPlatform();
      const isNativeMobile = platform === 'android' || platform === 'ios';
      const width = window.innerWidth || document.documentElement.clientWidth || 0;
      const height = window.innerHeight || document.documentElement.clientHeight || 0;
      const isPortrait = height >= width;

      if (isNativeMobile && (isPortrait || width < 768)) {
        setIsMobile(true);
        return;
      }

      const ua = navigator.userAgent || '';
      const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      if (isMobileUA && (isPortrait || width < 768)) {
        setIsMobile(true);
        return;
      }

      setIsMobile(width < 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return isMobile;
}
