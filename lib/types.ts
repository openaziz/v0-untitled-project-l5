// أنواع شخصيات البوت المتاحة
export type BotPersonality = "neutral" | "professional" | "friendly" | "technical" | "creative" | "sarcastic"

// واجهة لإعدادات البوت
export interface BotSettings {
  personality: BotPersonality
  language: string
  voiceEnabled: boolean
}

// واجهة خدمة التشفير
export interface EncryptionService {
  encrypt(data: string): string
  decrypt(encryptedData: string): string
}

// واجهة خدمة الأمان
export interface SecurityService {
  encryptionService?: EncryptionService
}

// تعريف النافذة العالمية
declare global {
  interface Window {
    securityService?: SecurityService
  }
}
