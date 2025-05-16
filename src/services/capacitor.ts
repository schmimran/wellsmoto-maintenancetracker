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
      }
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
  if (isNativePlatform) {
    await Storage.set({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value)
    });
  } else {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
};

export const getData = async (key: string) => {
  if (isNativePlatform) {
    const { value } = await Storage.get({ key });
    return value;
  } else {
    return localStorage.getItem(key);
  }
};

// Keyboard management
export const setupKeyboard = () => {
  if (isNativePlatform) {
    Keyboard.setAccessoryBarVisible({ isVisible: false });
    
    // Auto-hide keyboard when touching outside input
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('input') && !target.closest('textarea')) {
        Keyboard.hide();
      }
    });
  }
};

export const exitApp = () => {
  if (isNativePlatform) {
    App.exitApp();
  }
};
