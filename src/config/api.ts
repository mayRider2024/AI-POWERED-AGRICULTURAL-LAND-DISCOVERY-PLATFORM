import { Capacitor } from '@capacitor/core';

export const BACKEND_URL_KEY = 'll_backend_url';

/**
 * Returns the effective API Base URL with prioritized resolution:
 * 1. User/dev override from localStorage ('ll_backend_url')
 * 2. Vite environment variable import.meta.env.VITE_API_URL
 * 3. Default fallback:
 *    - On Android native: If running in emulator, 10.0.2.2:8001
 *    - On Web / local Mac: http://127.0.0.1:8001
 */
export function getApiBaseUrl(): string {
  // Check localStorage runtime override first
  try {
    const customUrl = localStorage.getItem(BACKEND_URL_KEY);
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }
  } catch {
    // Ignore storage errors
  }

  // Check Vite build-time environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Fallback
  if (Capacitor.getPlatform() === 'android') {
    return 'http://10.0.2.2:8001';
  }

  return 'http://127.0.0.1:8001';
}

export function setApiBaseUrl(url: string): void {
  try {
    const clean = url.trim().replace(/\/+$/, '');
    if (clean) {
      localStorage.setItem(BACKEND_URL_KEY, clean);
    } else {
      localStorage.removeItem(BACKEND_URL_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}
