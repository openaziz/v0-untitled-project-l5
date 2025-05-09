/**
 * مولد الخرائط الذهنية
 * يقوم بإنشاء خرائط ذهنية بناءً على الاستعلامات والاستجابات
 */

export class MindMapGenerator {
  /**
   * إنشاء خريطة ذهنية
   */
  async generateMindMap(query: string, response: string): Promise<void> {
    console.log("إنشاء خريطة ذهنية للاستعلام:", query)

    // في التطبيق الحقيقي، هنا سيتم تحليل الاستجابة واستخراج العناصر الرئيسية
    // ثم إنشاء خريطة ذهنية باستخدام مكتبة مثل vis.js أو d3.js

    // محاكاة إنشاء الخريطة الذهنية
    this.simulateGeneratingMindMap(query, response)
  }

  /**
   * محاكاة إنشاء خريطة ذهنية
   */
  private simulateGeneratingMindMap(query: string, response: string): void {
    // استخراج العناوين الرئيسية من الاستجابة
    const mainTopics = this.extractMainTopics(response)

    // استخراج العناوين الفرعية
    const subTopics = this.extractSubTopics(response)

    // في التطبيق الحقيقي، هنا سيتم إنشاء الخريطة الذهنية
    console.log("العناوين الرئيسية:", mainTopics)
    console.log("العناوين الفرعية:", subTopics)

    // إنشاء بيانات الخريطة الذهنية
    const mindMapData = {
      root: {
        text: query,
        children: mainTopics.map((topic, index) => ({
          text: topic,
          children: subTopics
            .filter((_, i) => i % mainTopics.length === index)
            .map((subTopic) => ({
              text: subTopic,
            })),
        })),
      },
    }

    // حفظ بيانات الخريطة الذهنية في التخزين المحلي
    if (typeof window !== "undefined") {
      localStorage.setItem("mindMapData", JSON.stringify(mindMapData))
    }
  }

  /**
   * استخراج العناوين الرئيسية من الاستجابة
   */
  private extractMainTopics(response: string): string[] {
    // البحث عن العناوين الرئيسية (## العنوان)
    const mainTopicsRegex = /##\s+([^\n]+)/g
    const mainTopics: string[] = []

    let match
    while ((match = mainTopicsRegex.exec(response)) !== null) {
      mainTopics.push(match[1])
    }

    return mainTopics.length > 0 ? mainTopics : ["الموضوع الرئيسي"]
  }

  /**
   * استخراج العناوين الفرعية من الاستجابة
   */
  private extractSubTopics(response: string): string[] {
    // البحث عن العناوين الفرعية (### العنوان)
    const subTopicsRegex = /###\s+([^\n]+)/g
    const subTopics: string[] = []

    let match
    while ((match = subTopicsRegex.exec(response)) !== null) {
      subTopics.push(match[1])
    }

    // إذا لم يتم العثور على عناوين فرعية، استخدم النقاط المرقمة
    if (subTopics.length === 0) {
      const numberedListRegex = /\d+\.\s+([^\n]+)/g

      while ((match = numberedListRegex.exec(response)) !== null) {
        subTopics.push(match[1])
      }
    }

    return subTopics.length > 0 ? subTopics : ["موضوع فرعي"]
  }
}
