"use client"

import { GeminiService } from "./gemini-service"
import { VisualStudioService } from "./visual-studio-service"

/**
 * معالج الذكاء الاصطناعي
 * يتعامل مع معالجة استعلامات المستخدم وتوليد الاستجابات
 * مع التكامل مع Google Gemini
 */

export class AIProcessor {
  private personality = "neutral"
  private useGemini = true
  private useDeepThinking = true
  private useWebResearch = true
  private useVisualStudio = true
  private geminiService: GeminiService
  private visualStudioService: VisualStudioService

  constructor() {
    // تحميل شخصية البوت المحفوظة إذا كانت متوفرة
    if (typeof window !== "undefined") {
      const savedPersonality = localStorage.getItem("botPersonality")
      if (savedPersonality) {
        this.personality = savedPersonality
      }

      // تحميل إعدادات التكامل
      const geminiEnabled = localStorage.getItem("geminiEnabled")
      if (geminiEnabled !== null) {
        this.useGemini = geminiEnabled === "true"
      }

      const deepThinkingEnabled = localStorage.getItem("deepThinkingEnabled")
      if (deepThinkingEnabled !== null) {
        this.useDeepThinking = deepThinkingEnabled === "true"
      }

      const webResearchEnabled = localStorage.getItem("webResearchEnabled")
      if (webResearchEnabled !== null) {
        this.useWebResearch = webResearchEnabled === "true"
      }

      const visualStudioEnabled = localStorage.getItem("visualStudioEnabled")
      if (visualStudioEnabled !== null) {
        this.useVisualStudio = visualStudioEnabled === "true"
      }
    }

    // تهيئة الخدمات
    this.geminiService = new GeminiService()
    this.visualStudioService = new VisualStudioService()
  }

  /**
   * معالجة استعلام المستخدم وتوليد استجابة
   */
  async processQuery(query: string): Promise<string> {
    // محاكاة وقت المعالجة
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // استخدام Google Gemini إذا كان مفعلاً
    if (this.useGemini) {
      try {
        console.log("استخدام Google Gemini لمعالجة الاستعلام")

        // إضافة توجيه النظام بناءً على شخصية البوت
        const systemPrompt =
          this.getSystemPromptForPersonality() +
          `
      
      هام: قدم إجاباتك بتنسيق واضح ومنظم. لا تستخدم علامات النجمة (**) للتنسيق.
      استخدم فقرات واضحة وعناوين مرقمة عند الحاجة. قدم إجابات مباشرة وعملية.
      تجنب الإطالة غير الضرورية وركز على تقديم حلول محددة وخطوات عملية.
      `

        // استخدام Gemini لتوليد الاستجابة
        const response = await this.geminiService.generateContent(query, systemPrompt)

        // تنظيف النص من علامات النجمة وتحسين التنسيق
        const cleanedResponse = this.cleanResponseFormatting(response)

        // تحليل نوع الاستعلام
        const queryType = this.analyzeQueryType(query)

        // إذا كان الاستعلام يتعلق بالبرمجة، قم بفتح Visual Studio
        if (queryType === "programming" && this.useVisualStudio) {
          // توليد الكود باستخدام Gemini
          const codeResult = await this.geminiService.generateCode(query)

          // فتح الكود في Visual Studio
          this.visualStudioService.openInVisualStudio(codeResult.code, codeResult.language)
        }

        return cleanedResponse
      } catch (error) {
        console.error("خطأ في استخدام Gemini:", error)
        // في حالة فشل Gemini، استخدم الطريقة الاحتياطية
      }
    }

    // تحليل نوع الاستعلام
    const queryType = this.analyzeQueryType(query)

    // توليد استجابة بناءً على نوع الاستعلام
    let response = ""
    switch (queryType) {
      case "programming":
        response = this.generateProgrammingResponse(query)

        // فتح Visual Studio إذا كان مفعلاً
        if (this.useVisualStudio) {
          console.log("فتح الكود في Visual Studio")
          const sampleCode = this.generateSampleCode(query)
          this.visualStudioService.openInVisualStudio(sampleCode, "javascript")
        }
        break
      case "data_analysis":
        response = this.generateDataAnalysisResponse(query)
        break
      case "content_creation":
        response = this.generateContentResponse(query)
        break
      case "design":
        response = this.generateDesignResponse(query)
        break
      default:
        response = this.generateGeneralResponse(query)
    }

    // تطبيق شخصية البوت على الاستجابة
    return this.applyPersonality(response)
  }

  // إضافة دالة جديدة لتنظيف تنسيق الاستجابة
  private cleanResponseFormatting(text: string): string {
    // إزالة علامات النجمة المزدوجة وتحويلها إلى تنسيق مناسب
    let cleaned = text
      .replace(/\*\*(.*?)\*\*/g, "$1") // إزالة علامات النجمة المزدوجة
      .replace(/\n\s*\d+\.\s*/g, "\n\n$&") // إضافة مسافة قبل العناصر المرقمة
      .replace(/\n\s*•\s*/g, "\n\n$&") // إضافة مسافة قبل النقاط

    // تحسين تنسيق الفقرات
    cleaned = cleaned
      .split("\n")
      .map((line) => line.trim())
      .join("\n")

    return cleaned
  }

  /**
   * الحصول على توجيه النظام بناءً على شخصية البوت
   */
  private getSystemPromptForPersonality(): string {
    switch (this.personality) {
      case "technical":
        return "أنت مساعد ذكي متخصص في المجالات التقنية. استخدم مصطلحات تقنية دقيقة وقدم إجابات مفصلة ومدعومة بالأدلة."
      case "friendly":
        return "أنت مساعد ودود ومتعاطف. استخدم لغة دافئة وشخصية وشجع المستخدم."
      case "professional":
        return "أنت مساعد احترافي. استخدم لغة رسمية ومنظمة وقدم إجابات موجزة ودقيقة."
      case "creative":
        return "أنت مساعد إبداعي. استخدم لغة خيالية وملهمة وقدم أفكاراً غير تقليدية."
      case "sarcastic":
        return "أنت مساعد ذكي مع لمسة من الفكاهة والسخرية. كن مرحاً ولكن مفيداً."
      default:
        return "أنت مساعد ذكي. قدم إجابات دقيقة ومفيدة بأسلوب متوازن."
    }
  }

  /**
   * تنفيذ التفكير العميق
   */
  async performDeepThinking(query: string): Promise<string[]> {
    if (this.useGemini && this.useDeepThinking) {
      try {
        return await this.geminiService.deepThinking(query)
      } catch (error) {
        console.error("خطأ في التفكير العميق باستخدام Gemini:", error)
      }
    }

    // طريقة احتياطية للتفكير العميق
    return [
      "تحليل السؤال وفهم المتطلبات...",
      "البحث في قاعدة المعرفة عن معلومات ذات صلة...",
      "تحديد المفاهيم الرئيسية والعلاقات بينها...",
      "تطبيق المنطق الاستنتاجي للوصول إلى إجابة...",
      "صياغة الإجابة بطريقة واضحة ومفهومة...",
    ]
  }

  /**
   * تنفيذ البحث على الويب
   */
  async performWebSearch(query: string): Promise<WebSearchResult[]> {
    if (this.useGemini && this.useWebResearch) {
      try {
        return await this.geminiService.webSearch(query)
      } catch (error) {
        console.error("خطأ في البحث على الويب باستخدام Gemini:", error)
      }
    }

    // طريقة احتياطية للبحث على الويب
    return [
      {
        id: "1",
        title: "نتائج البحث الأولى حول " + query,
        url: "https://example.com/result1",
        snippet: "مقتطف من نتائج البحث يحتوي على معلومات ذات صلة بالاستعلام...",
      },
      {
        id: "2",
        title: "معلومات إضافية عن " + query,
        url: "https://example.com/result2",
        snippet: "مزيد من المعلومات التفصيلية حول الموضوع المطلوب...",
      },
      {
        id: "3",
        title: "أحدث البيانات المتعلقة بـ " + query,
        url: "https://example.com/result3",
        snippet: "بيانات محدثة ومعلومات جديدة تم نشرها مؤخراً...",
      },
    ]
  }

  /**
   * توليد كود برمجي
   */
  async generateCodeForQuery(query: string, language = "javascript"): Promise<CodeGenerationResult> {
    if (this.useGemini) {
      try {
        return await this.geminiService.generateCode(query, language)
      } catch (error) {
        console.error("خطأ في توليد الكود باستخدام Gemini:", error)
      }
    }

    // طريقة احتياطية لتوليد الكود
    return {
      code: this.generateSampleCode(query),
      language,
      prompt: query,
    }
  }

  /**
   * تحليل نوع الاستعلام
   */
  private analyzeQueryType(query: string): string {
    const lowerQuery = query.toLowerCase()

    if (
      lowerQuery.includes("كود") ||
      lowerQuery.includes("برمج") ||
      lowerQuery.includes("تطوير") ||
      lowerQuery.includes("javascript") ||
      lowerQuery.includes("python") ||
      lowerQuery.includes("react")
    ) {
      return "programming"
    }

    if (
      lowerQuery.includes("بيانات") ||
      lowerQuery.includes("تحليل") ||
      lowerQuery.includes("إحصاء") ||
      lowerQuery.includes("رسم بياني") ||
      lowerQuery.includes("جدول")
    ) {
      return "data_analysis"
    }

    if (
      lowerQuery.includes("اكتب") ||
      lowerQuery.includes("مقال") ||
      lowerQuery.includes("محتوى") ||
      lowerQuery.includes("نص") ||
      lowerQuery.includes("تقرير")
    ) {
      return "content_creation"
    }

    if (
      lowerQuery.includes("تصميم") ||
      lowerQuery.includes("واجهة") ||
      lowerQuery.includes("ui") ||
      lowerQuery.includes("ux") ||
      lowerQuery.includes("صورة")
    ) {
      return "design"
    }

    return "general"
  }

  /**
   * توليد استجابة لاستعلامات البرمجة
   */
  private generateProgrammingResponse(query: string): string {
    // هنا يمكن إضافة منطق أكثر تعقيداً لتوليد استجابات برمجية
    return `
    بناءً على طلبك، إليك الحل البرمجي:
    
    لقد قمت بإنشاء كود يلبي متطلباتك. يمكنك الاطلاع على الكود في علامة التبويب "الكود" أو فتحه مباشرة في Visual Studio للتعديل عليه.
    
    الكود يتضمن:
    - هيكل أساسي للتطبيق المطلوب
    - وظائف التعامل مع البيانات
    - واجهة مستخدم بسيطة وسهلة الاستخدام
    
    هل ترغب في إجراء أي تعديلات على الكود أو توضيح أي جزء منه؟
    `
  }

  /**
   * توليد استجابة لاستعلامات تحليل البيانات
   */
  private generateDataAnalysisResponse(query: string): string {
    return `
    بعد تحليل البيانات المقدمة، توصلت إلى النتائج التالية:
    
    1. **الاتجاهات الرئيسية**:
       - زيادة بنسبة 23% في معدلات النمو خلال الربع الأخير
       - انخفاض تكاليف التشغيل بنسبة 12% مقارنة بالعام السابق
       - تحسن في مؤشرات الأداء الرئيسية بمعدل 8.5%
    
    2. **التوصيات**:
       - التركيز على تطوير القطاع A نظراً لمعدلات النمو العالية
       - إعادة هيكلة العمليات في القطاع B لتحسين الكفاءة
       - زيادة الاستثمار في مجالات الابتكار لتعزيز الميزة التنافسية
    
    هل ترغب في تحليل أعمق لأي من هذه النقاط؟
    `
  }

  /**
   * توليد استجابة لاستعلامات إنشاء المحتوى
   */
  private generateContentResponse(query: string): string {
    return `
    # تأثير الذكاء الاصطناعي على مستقبل العمل
    
    في عصر التحول الرقمي السريع، يبرز الذكاء الاصطناعي كقوة محورية تعيد تشكيل مشهد العمل العالمي. هذا المقال يستكشف التأثيرات المتعددة الأبعاد للذكاء الاصطناعي على مستقبل العمل، متناولاً الفرص والتحديات التي تنتظرنا.
    
    ## التحولات الوظيفية
    
    يؤدي انتشار تقنيات الذكاء الاصطناعي إلى تحولات جذرية في سوق العمل. بينما تختفي بعض الوظائف التقليدية، تظهر فرص جديدة تتطلب مهارات مختلفة. الوظائف الروتينية والقابلة للأتمتة هي الأكثر عرضة للاستبدال، في حين تزداد أهمية المهارات الإبداعية والتحليلية والاجتماعية.
    
    ## إعادة تعريف الإنتاجية
    
    يمكن للذكاء الاصطناعي تعزيز الإنتاجية بشكل كبير من خلال أتمتة المهام الروتينية وتسريع عمليات اتخاذ القرار. هذا يتيح للعاملين التركيز على الجوانب الأكثر قيمة وإبداعاً في عملهم، مما يؤدي إلى تحسين جودة المخرجات وزيادة الرضا الوظيفي.
    
    ## التحديات والفرص
    
    رغم الفوائد المحتملة، يواجه المجتمع تحديات كبيرة في التكيف مع هذه التغييرات. يتطلب الأمر استثمارات ضخمة في إعادة تأهيل القوى العاملة وتطوير أنظمة تعليمية تركز على المهارات المستقبلية. كما تبرز أسئلة أخلاقية حول العدالة في توزيع فوائد هذه التقنيات.
    
    هل ترغب في توسيع أي جزء من هذا المحتوى أو تعديله ليناسب احتياجاتك بشكل أفضل؟
    `
  }

  /**
   * توليد استجابة لاستعلامات التصميم
   */
  private generateDesignResponse(query: string): string {
    return `
    بناءً على طلبك، إليك اقتراح تصميم لواجهة تطبيق تتبع اللياقة البدنية:
    
    ## العناصر الرئيسية للواجهة:
    
    1. **الشاشة الرئيسية**:
       - لوحة معلومات تعرض ملخص النشاط اليومي (الخطوات، السعرات الحرارية، الوقت النشط)
       - مخطط دائري يوضح التقدم نحو الأهداف اليومية
       - أزرار سريعة لبدء تمارين مختلفة
    
    2. **شاشة التمارين**:
       - قائمة بالتمارين المخصصة مع صور توضيحية
       - خيارات لتتبع الوقت والتكرارات والأوزان
       - عرض للسجل التاريخي مع رسوم بيانية للتقدم
    
    3. **شاشة التغذية**:
       - تتبع السعرات الحرارية والعناصر الغذائية
       - قاعدة بيانات للأطعمة الشائعة مع إمكانية إضافة عناصر مخصصة
       - تحليل لنمط الاستهلاك الغذائي
    
    ## نظام الألوان المقترح:
    - اللون الرئيسي: أزرق فاتح (#4A90E2) - يرمز للنشاط والحيوية
    - اللون الثانوي: أخضر فاتح (#50E3C2) - يرمز للصحة والتوازن
    - خلفية: رمادي فاتح جداً (#F8F8F8) - لتحسين القراءة وتقليل إجهاد العين
    
    هل ترغب في الحصول على تفاصيل أكثر عن أي جزء من التصميم؟
    `
  }

  /**
   * توليد استجابة عامة
   */
  private generateGeneralResponse(query: string): string {
    return `
    شكراً على سؤالك. بناءً على استفسارك، يمكنني تقديم المعلومات التالية:
    
    الموضوع الذي سألت عنه يتضمن عدة جوانب مهمة يجب مراعاتها. أولاً، من المهم فهم السياق العام والعوامل المؤثرة. ثانياً، هناك عدة مقاربات يمكن اتباعها، كل منها له مزاياه وتحدياته.
    
    بشكل عام، أنصح بالبدء بتحديد أهدافك بوضوح، ثم جمع المعلومات اللازمة، وأخيراً وضع خطة عمل تفصيلية.
    
    هل هناك جانب معين ترغب في التعمق فيه أكثر؟
    `
  }

  /**
   * توليد كود عينة
   */
  private generateSampleCode(query: string): string {
    if (query.includes("React") || query.includes("قائمة مهام")) {
      return `// تطبيق قائمة مهام بسيط بلغة React
import React, { useState } from 'react';

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="todo-app">
      <h1>قائمة المهام</h1>
      <div className="add-task">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="أضف مهمة جديدة..."
        />
        <button onClick={handleAddTask}>إضافة</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleComplete(task.id)}>{task.text}</span>
            <button onClick={() => handleDeleteTask(task.id)}>حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`
    } else {
      return `// مثال على كود JavaScript
function processData(data) {
  // تحليل البيانات
  const processedData = data.map(item => {
    return { ...item, processed: true };
  });
  
  // تطبيق المنطق الأساسي
  const result = processedData.filter(item => item.value > 0);
  
  return result;
}

// مثال على الاستخدام
const data = [{ value: 5 }, { value: -2 }, { value: 10 }];
const result = processData(data);
console.log(result);`
    }
  }

  /**
   * تطبيق شخصية البوت على الاستجابة
   */
  private applyPersonality(response: string): string {
    switch (this.personality) {
      case "technical":
        return this.makeResponseTechnical(response)
      case "friendly":
        return this.makeResponseFriendly(response)
      case "professional":
        return this.makeResponseProfessional(response)
      case "creative":
        return this.makeResponseCreative(response)
      case "sarcastic":
        return this.makeResponseSarcastic(response)
      default:
        return response // neutral
    }
  }

  /**
   * تحويل الاستجابة إلى نمط تقني
   */
  private makeResponseTechnical(response: string): string {
    // إضافة مصطلحات تقنية ومراجع
    return (
      response
        .replace(/يمكن/g, "من الناحية التقنية، يمكن")
        .replace(/مهم/g, "حاسم من الناحية التقنية")
        .replace(/جيد/g, "فعال بنسبة عالية") +
      "\n\nملاحظة تقنية: تأكد من مراعاة متطلبات الأداء والتوافقية عند تنفيذ هذا الحل."
    )
  }

  /**
   * تحويل الاستجابة إلى نمط ودود
   */
  private makeResponseFriendly(response: string): string {
    // إضافة عبارات ودية وتشجيعية
    return (
      "مرحباً صديقي! 😊\n\n" +
      response.replace(/يمكن/g, "يمكنك بكل سهولة").replace(/مهم/g, "رائع ومهم") +
      "\n\nأتمنى أن يكون هذا مفيداً! لا تتردد في طلب المزيد من المساعدة إذا احتجت لذلك. 👍"
    )
  }

  /**
   * تحويل الاستجابة إلى نمط احترافي
   */
  private makeResponseProfessional(response: string): string {
    // إضافة لغة رسمية ومنظمة
    return (
      "وفقاً للمعايير المهنية المعتمدة:\n\n" +
      response.replace(/يمكن/g, "يُوصى بـ").replace(/جيد/g, "ملائم للمعايير المهنية") +
      "\n\nنأمل أن تلبي هذه المعلومات احتياجاتكم المهنية. نرحب بأي استفسارات إضافية."
    )
  }

  /**
   * تحويل الاستجابة إلى نمط إبداعي
   */
  private makeResponseCreative(response: string): string {
    // إضافة لغة خيالية وإبداعية
    return (
      "✨ دعنا نطلق العنان للإبداع! ✨\n\n" +
      response.replace(/يمكن/g, "تخيل أنك تستطيع").replace(/فكرة/g, "شرارة إبداعية") +
      "\n\n🌈 هذه مجرد بداية لرحلة من الاكتشاف والإبداع! ما الذي يلهمك في هذه الأفكار؟"
    )
  }

  /**
   * تحويل الاستجابة إلى نمط ساخر
   */
  private makeResponseSarcastic(response: string): string {
    // إضافة لمسات من السخرية والفكاهة
    return (
      "حسناً، إليك الحقيقة المثيرة... 🙄\n\n" +
      response
        .replace(/مهم/g, "مهم نوعاً ما، على ما أعتقد")
        .replace(/يجب/g, "من المفترض أنه يجب")
        .replace(/رائع/g, "مذهل بشكل لا يصدق... على الأقل هذا ما يقولونه") +
      "\n\nآمل أن هذا كان مفيداً بما فيه الكفاية... أو على الأقل أفضل من البحث في جوجل. 😏"
    )
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
