// أنواع شخصيات البوت المتاحة
export type BotPersonality = "neutral" | "professional" | "friendly" | "technical" | "creative" | "sarcastic"

// واجهة لإعدادات البوت
export interface BotSettings {
  personality: BotPersonality
  language: string
  voiceEnabled: boolean
}
