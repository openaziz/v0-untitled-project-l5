import { type GeminiConfig, defaultGeminiConfig, GEMINI_API_ENDPOINT } from "./gemini-config"

/**
 * خدمة Google Gemini API
 */
export class GeminiService {
  private config: GeminiConfig

  constructor(config?: Partial<GeminiConfig>) {
    this.config = {
      ...defaultGeminiConfig,
      ...config,
    }
  }

  /**
   * إرسال طلب إلى Gemini API
   */
  async generateContent(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      // إضافة توجيهات التنسيق إلى النظام
      const formattingInstructions = `
    قدم إجابات مباشرة ومختصرة وعملية.
    استخدم فقرات قصيرة وواضحة.
    استخدم عناوين مرقمة للخطوات والنقاط المهمة.
    تجنب استخدام علامات النجمة (**) للتنسيق.
    ركز على الحلول العملية والخطوات المحددة.
    `

      const enhancedSystemPrompt = systemPrompt
        ? `${systemPrompt}\n\n${formattingInstructions}`
        : formattingInstructions

      // الحصول على مفتاح API المخصص من التخزين المحلي
      const customApiKey = typeof window !== "undefined" ? localStorage.getItem("geminiApiKey") : null

      const response = await fetch(GEMINI_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemPrompt: enhancedSystemPrompt,
          model: this.config.model,
          maxTokens: this.config.maxTokens,
          temperature: this.config.temperature,
          customApiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`خطأ في Gemini API: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text || "لم يتم العثور على استجابة."
    } catch (error) {
      console.error("خطأ في استدعاء Gemini API:", error)
      throw error
    }
  }

  /**
   * البحث على الويب باستخدام Gemini
   */
  async webSearch(query: string): Promise<WebSearchResult[]> {
    // استخدام Gemini للبحث على الويب
    try {
      const searchPrompt = `قم بالبحث عن المعلومات التالية وتقديم النتائج بتنسيق JSON: ${query}`
      const response = await this.generateContent(searchPrompt)

      // محاولة تحليل الاستجابة كـ JSON
      try {
        // استخراج JSON من النص إذا كان موجوداً
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/\{[\s\S]*\}/)

        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0]
          const results = JSON.parse(jsonStr)

          // تحويل النتائج إلى تنسيق موحد
          if (Array.isArray(results)) {
            return results.map((item, index) => ({
              id: item.id || `result-${index + 1}`,
              title: item.title || `نتيجة البحث ${index + 1}`,
              url: item.url || "#",
              snippet: item.snippet || item.description || item.content || "لا يوجد وصف متاح.",
            }))
          }
        }
      } catch (parseError) {
        console.error("خطأ في تحليل نتائج البحث:", parseError)
      }

      // إذا فشل التحليل، إرجاع نتيجة افتراضية
      return [
        {
          id: "fallback-1",
          title: `نتائج البحث عن: ${query}`,
          url: "#",
          snippet: "تعذر تحليل نتائج البحث بشكل صحيح. يرجى المحاولة مرة أخرى.",
        },
      ]
    } catch (error) {
      console.error("خطأ في البحث على الويب:", error)
      throw error
    }
  }

  /**
   * التفكير العميق باستخدام Gemini
   */
  async deepThinking(query: string): Promise<string[]> {
    try {
      const thinkingPrompt = `
      قم بتحليل السؤال التالي خطوة بخطوة بتفكير عميق. قدم إجابتك على شكل خطوات منفصلة بعلامة ###.
      
      السؤال: ${query}
      
      خطوات التفكير:
      `

      const response = await this.generateContent(thinkingPrompt)

      // تقسيم الاستجابة إلى خطوات
      const steps = response.split(/###|\d+\.\s/).filter((step) => step.trim().length > 0)

      return steps.map((step) => step.trim())
    } catch (error) {
      console.error("خطأ في التفكير العميق:", error)
      return ["تحليل السؤال وفهم المتطلبات...", "حدث خطأ أثناء معالجة التفكير العميق. يرجى المحاولة مرة أخرى."]
    }
  }

  /**
   * توليد كود برمجي باستخدام Gemini
   */
  async generateCode(prompt: string, language = "javascript"): Promise<CodeGenerationResult> {
    try {
      const codePrompt = `
      قم بإنشاء كود ${language} للمهمة التالية. قدم الكود فقط بدون شرح إضافي.
      
      المهمة: ${prompt}
      `

      const response = await this.generateContent(codePrompt)

      // استخراج الكود من الاستجابة
      const codeMatch = response.match(/```(?:\w+)?\s*([\s\S]*?)\s*```/) || response.match(/(?:^|\n)(?!```)([\s\S]+)/)

      const code = codeMatch ? (codeMatch[1] || codeMatch[0]).trim() : response

      return {
        code,
        language,
        prompt,
      }
    } catch (error) {
      console.error("خطأ في توليد الكود:", error)
      throw error
    }
  }
}

export interface WebSearchResult {
  id: string
  title: string
  url: string
  snippet: string
}

export interface CodeGenerationResult {
  code: string
  language: string
  prompt: string
}
