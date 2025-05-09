import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.wolf.app",
  appName: "WOLF",
  webDir: "out",
  server: {
    androidScheme: "https",
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: "wolf.keystore",
      keystorePassword: "wolfapp123",
      keystoreAlias: "wolf",
      keystoreAliasPassword: "wolfapp123",
    },
    minSdkVersion: 21,
    maxSdkVersion: 33,
    targetSdkVersion: 33,
    compileSdkVersion: 33,
    gradleArgs: ["-Dorg.gradle.daemon=false", "-Dorg.gradle.jvmargs=-Xmx1536m"],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
}

export default config
