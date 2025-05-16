
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { setupAndroidBackButton, initializeNativeUI, setupKeyboard, isNativePlatform, isIOS, isAndroid } from './services/capacitor';

// Initialize native UI when running in native environment
document.addEventListener('DOMContentLoaded', async () => {
  if (isNativePlatform) {
    // Add platform classes to document root for platform-specific CSS
    document.documentElement.classList.add('native-platform');
    if (isIOS) {
      document.documentElement.classList.add('ios-platform');
    } else if (isAndroid) {
      document.documentElement.classList.add('android-platform');
    }
    
    // Initialize native features
    await initializeNativeUI();
    setupKeyboard();
    setupAndroidBackButton();
  } else {
    document.documentElement.classList.add('web-platform');
  }
  
  // Listen for theme changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleThemeChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Set initial dark mode class
  if (darkModeMediaQuery.matches) {
    document.documentElement.classList.add('dark');
  }
  
  darkModeMediaQuery.addEventListener('change', handleThemeChange);
});

setupAndroidBackButton();
createRoot(document.getElementById("root")!).render(<App />);
