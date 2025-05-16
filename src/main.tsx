import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { setupAndroidBackButton, initializeNativeUI, setupKeyboard } from './services/capacitor';

// Initialize native UI when running in native environment
document.addEventListener('DOMContentLoaded', () => {
  initializeNativeUI();
  setupKeyboard();
});

setupAndroidBackButton();
createRoot(document.getElementById("root")!).render(<App />);
