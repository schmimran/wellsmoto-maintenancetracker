sudo gem install cocoapods


npm install
npm run build


npm install @capacitor/core @capacitor/cli

npx cap init WellsMotoTracker com.wellsmoto.maintenancetracker --web-dir=dist


npm install @capacitor/ios


npx cap add ios

# Install Capacitor Android
npm install @capacitor/android


# Add Android platform
npx cap add android



cd ios/App

pod install

cd ../..


# Install core plugins
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard @capacitor/device

# For image uploads (vehicle photos)
npm install @capacitor/camera

npm install @capacitor/preferences

# For push notifications (if needed)
npm install @capacitor/push-notifications

npm run build

npx cap sync ios

# Sync with Android
npx cap sync android
