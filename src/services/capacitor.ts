// In src/services/capacitor.ts

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

// Call this in your main.tsx
