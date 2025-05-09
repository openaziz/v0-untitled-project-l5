/**
 * تكوين Google Gemini API
 */

export const GEMINI_API_ENDPOINT = "/api/gemini"

export interface GeminiConfig {
  model: string
  maxTokens: number
  temperature: number
}

// الإعدادات الافتراضية
export const defaultGeminiConfig: GeminiConfig = {
  model: "gemini-2.0-flash",
  maxTokens: 1024,
  temperature: 0.7,
}

// الحصول على حالة تكوين Gemini من التخزين المحلي
export function getGeminiConfigState(): { isConfigured: boolean } {
  if (typeof window !== "undefined") {
    const configState = localStorage.getItem("geminiConfigState")
    if (configState) {
      return JSON.parse(configState)
    }
  }
  return { isConfigured: false }
}

// حفظ حالة تكوين Gemini في التخزين المحلي
export function saveGeminiConfigState(isConfigured: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("geminiConfigState", JSON.stringify({ isConfigured }))
  }
}

// الحصول على مفتاح Gemini API من التخزين المحلي
export function getGeminiApiKey(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("geminiApiKey")
  }
  return null
}
