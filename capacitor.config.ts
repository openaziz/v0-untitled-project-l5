import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.wolf.app",
  appName: "WOLF",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  android: {
    buildOptions: {
      keystorePath: "wolf.keystore",
      keystorePassword: "wolfapp123",
      keystoreAlias: "wolf",
      keystoreAliasPassword: "wolfapp123",
    },
  },
}

export default config
