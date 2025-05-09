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
    const encryptedKey = localStorage.getItem("geminiApiKey")
    if (!encryptedKey) return null

    // فك تشفير المفتاح إذا كانت خدمة التشفير متاحة
    try {
      return window.securityService?.encryptionService?.decrypt(encryptedKey) || encryptedKey
    } catch (error) {
      console.error("خطأ في فك تشفير مفتاح API:", error)
      return encryptedKey
    }
  }
  return null
}

// حفظ مفتاح Gemini API في التخزين المحلي
export function saveGeminiApiKey(apiKey: string): void {
  if (typeof window !== "undefined") {
    // استخدام خدمة التشفير إذا كانت متاحة
    try {
      const encryptedKey = window.securityService?.encryptionService?.encrypt(apiKey) || apiKey
      localStorage.setItem("geminiApiKey", encryptedKey)
      saveGeminiConfigState(true)
    } catch (error) {
      console.error("خطأ في تشفير مفتاح API:", error)
      localStorage.setItem("geminiApiKey", apiKey)
      saveGeminiConfigState(true)
    }
  }
}

// حذف مفتاح Gemini API من التخزين المحلي
export function removeGeminiApiKey(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("geminiApiKey")
    saveGeminiConfigState(false)
  }
}

// التحقق من صحة مفتاح API
export async function validateGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.ok
  } catch (error) {
    console.error("خطأ في التحقق من مفتاح API:", error)
    return false
  }
}
