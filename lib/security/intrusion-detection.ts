import { encryptionService } from "./encryption-service"

export class IntrusionDetectionService {
  private static instance: IntrusionDetectionService
  private initialized = false
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map()
  private activityLog: Array<{ type: string; timestamp: number; details: any }> = []
  private suspiciousActivities: Array<{ type: string; timestamp: number; details: any }> = []
  private readonly ACTIVITY_LOG_KEY = "security_activity_log"
  private readonly SUSPICIOUS_ACTIVITIES_KEY = "suspicious_activities"

  // معلمات الكشف
  private readonly MAX_LOGIN_ATTEMPTS = 5 // الحد الأقصى لمحاولات تسجيل الدخول قبل الحظر
  private readonly LOGIN_ATTEMPT_RESET_TIME = 30 * 60 * 1000 // إعادة تعيين محاولات تسجيل الدخول بعد 30 دقيقة
  private readonly ACTIVITY_LOG_MAX_SIZE = 100 // عدد السجلات التي يتم الاحتفاظ بها

  // استخدام نمط Singleton
  public static getInstance(): IntrusionDetectionService {
    if (!IntrusionDetectionService.instance) {
      IntrusionDetectionService.instance = new IntrusionDetectionService()
    }
    return IntrusionDetectionService.instance
  }

  // تهيئة الخدمة
  public async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // استرداد سجل النشاط المخزن
      const storedActivityLog = await encryptionService.secureRetrieve(this.ACTIVITY_LOG_KEY)
      if (storedActivityLog && Array.isArray(storedActivityLog)) {
        this.activityLog = storedActivityLog
      }

      // استرداد الأنشطة المشبوهة المخزنة
      const storedSuspiciousActivities = await encryptionService.secureRetrieve(this.SUSPICIOUS_ACTIVITIES_KEY)
      if (storedSuspiciousActivities && Array.isArray(storedSuspiciousActivities)) {
        this.suspiciousActivities = storedSuspiciousActivities
      }

      this.initialized = true
      console.log("تمت تهيئة خدمة كشف التسلل بنجاح")
    } catch (error) {
      console.error("خطأ في تهيئة خدمة كشف التسلل:", error)
    }
  }

  // تسجيل محاولة تسجيل دخول
  public recordLoginAttempt(userId: string, success: boolean, details: any = {}): boolean {
    const now = Date.now()
    let userAttempts = this.loginAttempts.get(userId)

    // إعادة تعيين محاولات تسجيل الدخول إذا انقضت المدة
    if (userAttempts && now - userAttempts.lastAttempt > this.LOGIN_ATTEMPT_RESET_TIME) {
      userAttempts = { count: 0, lastAttempt: now }
    }

    // إنشاء سجل جديد إذا لم يكن موجودًا
    if (!userAttempts) {
      userAttempts = { count: 0, lastAttempt: now }
    }

    // تحديث السجل
    if (!success) {
      userAttempts.count++
    } else {
      // إعادة تعيين المحاولات عند نجاح تسجيل الدخول
      userAttempts.count = 0
    }

    userAttempts.lastAttempt = now
    this.loginAttempts.set(userId, userAttempts)

    // تسجيل النشاط
    this.logActivity(success ? "login_success" : "login_failure", {
      userId,
      attempts: userAttempts.count,
      ...details,
    })

    // التحقق من تجاوز الحد الأقصى للمحاولات
    if (!success && userAttempts.count >= this.MAX_LOGIN_ATTEMPTS) {
      this.recordSuspiciousActivity("excessive_login_attempts", {
        userId,
        attempts: userAttempts.count,
        ...details,
      })
      return false // مطلوب حظر المستخدم
    }

    return true // مسموح بمزيد من المحاولات
  }

  // تسجيل نشاط أمني
  public logActivity(type: string, details: any = {}): void {
    const activityEntry = {
      type,
      timestamp: Date.now(),
      details,
    }

    this.activityLog.push(activityEntry)

    // تقليص سجل النشاط إذا تجاوز الحد الأقصى
    if (this.activityLog.length > this.ACTIVITY_LOG_MAX_SIZE) {
      this.activityLog = this.activityLog.slice(-this.ACTIVITY_LOG_MAX_SIZE)
    }

    // حفظ سجل النشاط
    this.saveActivityLog()
  }

  // تسجيل نشاط مشبوه
  public recordSuspiciousActivity(type: string, details: any = {}): void {
    const activityEntry = {
      type,
      timestamp: Date.now(),
      details,
    }

    this.suspiciousActivities.push(activityEntry)
    this.saveSuspiciousActivities()

    console.warn(`تم اكتشاف نشاط مشبوه: ${type}`, details)

    // يمكن هنا تنفيذ منطق إضافي مثل إرسال إشعار للمسؤول
    this.handleSuspiciousActivity(type, details)
  }

  // الكشف عن هجمات حقن البيانات
  public detectInjectionAttack(input: string): boolean {
    // أنماط شائعة لهجمات الحقن
    const sqlInjectionPatterns = [
      /(%27)|(')|(--)|(%23)|(#)/i, // أنماط حقن SQL الأساسية
      /((%3D)|(=))[^\n]*((%27)|(')|(--)|(%3B)|(;))/i, // أنماط حقن SQL متقدمة
      /\w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))/i, // أنماط "OR"
      /((%27)|('))union/i, // أنماط UNION
    ]

    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/i, // وسم script
      /src[\r\n]*=[\r\n]*\\?('|")(.*?)\1/i, // معلمة src
      /style[\r\n]*=[\r\n]*\\?('|")(.*?)\1/i, // معلمة style مع جافاسكريبت
      /onload[\r\n]*=[\r\n]*\\?('|")(.*?)\1/i, // معلمة onload
    ]

    const commandInjectionPatterns = [
      /[;&|`]([a-zA-Z0-9_/.-]+)/i, // نمط حقن أوامر النظام
    ]

    // فحص جميع الأنماط
    for (const pattern of [...sqlInjectionPatterns, ...xssPatterns, ...commandInjectionPatterns]) {
      if (pattern.test(input)) {
        this.recordSuspiciousActivity("injection_attempt", { input, pattern: pattern.toString() })
        return true // تم اكتشاف محاولة حقن
      }
    }

    return false // لم يتم اكتشاف محاولة حقن
  }

  // الكشف عن هجمات القوة الغاشمة
  public detectBruteForceAttack(requestCount: number, timeWindow: number, endpoint: string): boolean {
    const requestsPerSecond = requestCount / (timeWindow / 1000)
    const threshold = 10 // عتبة عدد الطلبات في الثانية

    if (requestsPerSecond > threshold) {
      this.recordSuspiciousActivity("brute_force_attempt", {
        endpoint,
        requestCount,
        timeWindow,
        requestsPerSecond,
      })
      return true // تم اكتشاف هجوم قوة غاشمة
    }

    return false // لم يتم اكتشاف هجوم قوة غاشمة
  }

  // التعامل مع النشاط المشبوه
  private handleSuspiciousActivity(type: string, details: any): void {
    // في التطبيق الحقيقي، يمكن تنفيذ إجراءات مختلفة هنا
    // مثل:
    // 1. تسجيل الخروج للمستخدم
    // 2. حظر وصول المستخدم مؤقتًا
    // 3. إرسال إشعار للمسؤول
    // 4. طلب مصادقة إضافية

    switch (type) {
      case "excessive_login_attempts":
        // تنفيذ حظر المستخدم
        console.error(`تم حظر المستخدم ${details.userId} بسبب محاولات تسجيل دخول مفرطة`)
        break

      case "injection_attempt":
        // تسجيل محاولة الحقن ورفض الطلب
        console.error(`تم اكتشاف محاولة حقن: ${details.input}`)
        break

      case "brute_force_attempt":
        // تنفيذ حظر عنوان IP مؤقتًا
        console.error(`تم اكتشاف هجوم قوة غاشمة على النقطة النهائية ${details.endpoint}`)
        break

      default:
        console.warn(`نشاط مشبوه من النوع ${type}`, details)
    }
  }

  // حفظ سجل النشاط
  private async saveActivityLog(): Promise<void> {
    try {
      await encryptionService.secureStore(this.ACTIVITY_LOG_KEY, this.activityLog)
    } catch (error) {
      console.error("خطأ في حفظ سجل النشاط:", error)
    }
  }

  // حفظ الأنشطة المشبوهة
  private async saveSuspiciousActivities(): Promise<void> {
    try {
      await encryptionService.secureStore(this.SUSPICIOUS_ACTIVITIES_KEY, this.suspiciousActivities)
    } catch (error) {
      console.error("خطأ في حفظ الأنشطة المشبوهة:", error)
    }
  }

  // الحصول على سجل النشاط (للمسؤولين فقط)
  public getActivityLog(): Array<{ type: string; timestamp: number; details: any }> {
    return [...this.activityLog]
  }

  // الحصول على الأنشطة المشبوهة (للمسؤولين فقط)
  public getSuspiciousActivities(): Array<{ type: string; timestamp: number; details: any }> {
    return [...this.suspiciousActivities]
  }

  // إعادة تعيين محاولات تسجيل الدخول لمستخدم معين
  public resetLoginAttempts(userId: string): void {
    this.loginAttempts.delete(userId)
  }

  // مسح سجل الأنشطة المشبوهة (للمسؤولين فقط)
  public async clearSuspiciousActivities(): Promise<void> {
    this.suspiciousActivities = []
    await this.saveSuspiciousActivities()
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const intrusionDetectionService = IntrusionDetectionService.getInstance()
