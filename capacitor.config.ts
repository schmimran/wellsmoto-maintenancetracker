import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wellsmoto.maintenancetracker',
  appName: 'WellsMoto Tracker',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    backgroundColor: '#ffffff'
  },
  android: {
    buildOptions: {
      // Specify the Java version to use
      minSdkVersion: 22,
      targetSdkVersion: 33,
      // Other build options
      gradleArgs: ['-PcdvMinSdkVersion=22']
    }
  }
};

export default config;
