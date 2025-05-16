
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

// Platform detection
export const isNativePlatform = Capacitor.isNativePlatform();
export const isIOS = Capacitor.getPlatform() === 'ios';
export const isAndroid = Capacitor.getPlatform() === 'android';
export const isWeb = !isNativePlatform;

// Add Android-specific back button handling
export const setupAndroidBackButton = () => {
  if (isAndroid) {
    App.addListener('backButton', (data) => {
      // Handle Android back button here
      if (window.location.pathname === '/garage') {
        // Ask before exiting if on the main page
        // Show confirmation dialog
        if (confirm('Do you want to exit the app?')) {
          App.exitApp();
        }
      } else {
        // Navigate back in the app
        window.history.back();
      }
    });
  }
};

// App lifecycle events
export const addAppStateChangeListener = (callback: (isActive: boolean) => void) => {
  if (isNativePlatform) {
    App.addListener('appStateChange', ({ isActive }) => {
      callback(isActive);
    });
  }
};

// Initialize native UI
export const initializeNativeUI = async () => {
  if (isNativePlatform) {
    try {
      await SplashScreen.hide();
      
      if (isIOS) {
        await StatusBar.setStyle({ style: Style.Dark });
        // Set status bar color based on theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          StatusBar.setBackgroundColor({ color: '#1e1e1e' });
        } else {
          StatusBar.setBackgroundColor({ color: '#f5f5f7' });
        }
      } else if (isAndroid) {
        // Set overlay true for Android to ensure content renders under status bar
        await StatusBar.setOverlaysWebView({ overlay: true });
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          StatusBar.setBackgroundColor({ color: '#1e1e1e' });
          StatusBar.setStyle({ style: Style.Dark });
        } else {
          StatusBar.setBackgroundColor({ color: '#f5f5f7' });
          StatusBar.setStyle({ style: Style.Light });
        }
      }
      
      // Ensure status bar is visible
      await StatusBar.show();
      
    } catch (error) {
      console.error('Error initializing native UI:', error);
    }
  }
};

// Camera functionality
export const takePicture = async () => {
  if (!isNativePlatform) return null;
  
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
    return image;
  } catch (error) {
    console.error('Error taking picture:', error);
    return null;
  }
};

// Storage wrappers
export const storeData = async (key: string, value: any) => {
  try {
    await Preferences.set({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value)
    });
  } catch (error) {
    console.error('Error storing data:', error);
    // Fallback to localStorage if Preferences fails
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
};

export const getData = async (key: string) => {
  try {
    const { value } = await Preferences.get({ key });
    return value;
  } catch (error) {
    console.error('Error getting data:', error);
    // Fallback to localStorage if Preferences fails
    return localStorage.getItem(key);
  }
};

// Keyboard management
export const setupKeyboard = () => {
  if (isNativePlatform) {
    try {
      Keyboard.setAccessoryBarVisible({ isVisible: false });
      
      // Set up keyboard listeners
      Keyboard.addListener('keyboardWillShow', (info) => {
        // Add a CSS class to the body when keyboard is visible
        document.body.classList.add('keyboard-visible');
        document.body.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
      });
      
      Keyboard.addListener('keyboardWillHide', () => {
        // Remove the CSS class when keyboard is hidden
        document.body.classList.remove('keyboard-visible');
        document.body.style.removeProperty('--keyboard-height');
      });
      
      // Auto-hide keyboard when touching outside input
      document.addEventListener('touchstart', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('input') && !target.closest('textarea')) {
          Keyboard.hide();
        }
      });
    } catch (error) {
      console.error('Error setting up keyboard:', error);
    }
  }
};

export const exitApp = () => {
  if (isNativePlatform) {
    App.exitApp();
  }
};
