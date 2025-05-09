import { encryptionService } from "./encryption-service"
import { twoFactorAuth } from "./two-factor-auth"
import { antiTamperService } from "./anti-tamper"
import { licenseVerificationService } from "./license-verification"
import { intrusionDetectionService } from "./intrusion-detection"
import { App } from "@capacitor/app"

export class SecurityService {
  private static instance: SecurityService
  private initialized = false

  // استخدام نمط Singleton
  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  // تهيئة جميع الخدمات الأمنية
  public async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      console.log("بدء تهيئة خدمات الأمان...")

      // تهيئة خدمة التشفير أولاً
      await encryptionService.initialize()
      console.log("تمت تهيئة خدمة التشفير")

      // تهيئة خدمة التحقق بخطوتين
      await twoFactorAuth.initialize()
      console.log("تمت تهيئة خدمة التحقق بخطوتين")

      // تهيئة خدمة مكافحة العبث
      await antiTamperService.initialize()
      console.log("تمت تهيئة خدمة مكافحة العبث")

      // تهيئة خدمة التحقق من الترخيص
      await licenseVerificationService.initialize()
      console.log("تمت تهيئة خدمة التحقق من الترخيص")

      // تهيئة خدمة كشف التسلل
      await intrusionDetectionService.initialize()
      console.log("تمت تهيئة خدمة كشف التسلل")

      // إجراء فحص أمني أولي
      const isSecure = await this.performSecurityCheck()
      if (!isSecure) {
        // التعامل مع حالة الإخفاق في الفحص الأمني
        console.error("فشل الفحص الأمني الأولي")
        this.handleSecurityFailure()
        return
      }

      // إعداد الاستماع لأحداث التطبيق
      this.setupAppEventListeners()

      this.initialized = true
      console.log("تمت تهيئة جميع خدمات الأمان بنجاح")
    } catch (error) {
      console.error("خطأ في تهيئة خدمات الأمان:", error)
      // محاولة استعادة من الخطأ
      this.handleInitializationError(error)
    }
  }

  // إجراء فحص أمني شامل
  public async performSecurityCheck(): Promise<boolean> {
    try {
      console.log("إجراء فحص أمني شامل...")

      // فحص تكامل التطبيق (مكافحة العبث)
      const antiTamperResult = await antiTamperService.performSecurityChecks()
      if (!antiTamperResult) {
        console.error("فشل فحص مكافحة العبث")
        return false
      }

      // فحص ترخيص التطبيق
      if (this.initialized) {
        // يتم استخدام مفتاح الترخيص المخزن إذا كان موجودًا
        const licenseResult = await licenseVerificationService.verifyLicense("stored_license", false)
        if (!licenseResult.isValid) {
          console.error(`فشل فحص الترخيص: ${licenseResult.message}`)
          return false
        }
      }

      return true
    } catch (error) {
      console.error("خطأ في إجراء الفحص الأمني:", error)
      return false
    }
  }

  // تشفير البيانات
  public encrypt(data: string | object, salt?: string): string {
    return encryptionService.encrypt(data, salt)
  }

  // فك تشفير البيانات
  public decrypt(encryptedData: string, salt?: string): string {
    return encryptionService.decrypt(encryptedData, salt)
  }

  // تشفير البيانات الحساسة
  public encryptSensitive(data: string, userKey: string): string {
    return encryptionService.encryptSensitive(data, userKey)
  }

  // فك تشفير البيانات الحساسة
  public decryptSensitive(encryptedData: string, userKey: string): string {
    return encryptionService.decryptSensitive(encryptedData, userKey)
  }

  // تفعيل التحقق بخطوتين
  public async enable2FA(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    return await twoFactorAuth.enable2FA(userId)
  }

  // التحقق من رمز TOTP
  public async verifyTOTP(userId: string, token: string): Promise<boolean> {
    return await twoFactorAuth.verifyTOTP(userId, token)
  }

  // التحقق من رمز الاسترداد
  public async verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
    return await twoFactorAuth.verifyRecoveryCode(userId, code)
  }

  // التحقق من ترخيص التطبيق
  public async verifyLicense(licenseKey: string, forceOnline = false): Promise<{ isValid: boolean; message: string }> {
    return await licenseVerificationService.verifyLicense(licenseKey, forceOnline)
  }

  // تسجيل محاولة تسجيل دخول
  public recordLoginAttempt(userId: string, success: boolean, details: any = {}): boolean {
    return intrusionDetectionService.recordLoginAttempt(userId, success, details)
  }

  // الكشف عن هجمات حقن البيانات
  public detectInjectionAttack(input: string): boolean {
    return intrusionDetectionService.detectInjectionAttack(input)
  }

  // الكشف عن هجمات القوة الغاشمة
  public detectBruteForceAttack(requestCount: number, timeWindow: number, endpoint: string): boolean {
    return intrusionDetectionService.detectBruteForceAttack(requestCount, timeWindow, endpoint)
  }

  // تسجيل نشاط أمني
  public logActivity(type: string, details: any = {}): void {
    intrusionDetectionService.logActivity(type, details)
  }

  // تسجيل نشاط مشبوه
  public recordSuspiciousActivity(type: string, details: any = {}): void {
    intrusionDetectionService.recordSuspiciousActivity(type, details)
  }

  // إعداد الاستماع لأحداث التطبيق
  private setupAppEventListeners(): void {
    try {
      // الاستماع لحدث الخروج من التطبيق
      App.addListener("appStateChange", ({ isActive }) => {
        if (!isActive) {
          // تسجيل خروج المستخدم من التطبيق
          this.logActivity("app_background", {})
        } else {
          // إعادة دخول المستخدم إلى التطبيق
          this.logActivity("app_foreground", {})

          // إجراء فحص أمني عند عودة التطبيق إلى المقدمة
          this.performSecurityCheck().then((isSecure) => {
            if (!isSecure) {
              this.handleSecurityFailure()
            }
          })
        }
      })

      console.log("تم إعداد الاستماع لأحداث التطبيق")
    } catch (error) {
      console.error("خطأ في إعداد الاستماع لأحداث التطبيق:", error)
    }
  }

  // التعامل مع فشل الفحص الأمني
  private handleSecurityFailure(): void {
    console.error("تم اكتشاف انتهاك أمني. اتخاذ إجراءات...")

    // يمكن تنفيذ إجراءات مختلفة هنا، مثل:
    // 1. تسجيل الخروج من المستخدم
    // 2. حذف البيانات الحساسة
    // 3. إنهاء التطبيق

    // تسجيل الحدث
    this.logActivity("security_failure", {})

    // عرض رسالة للمستخدم
    alert("تم اكتشاف مشكلة أمنية. سيتم إغلاق التطبيق للحفاظ على أمان بياناتك.")

    // إنهاء التطبيق بعد فترة قصيرة
    setTimeout(() => {
      App.exitApp()
    }, 2000)
  }

  // التعامل مع خطأ في التهيئة
  private handleInitializationError(error: any): void {
    console.error("خطأ في تهيئة خدمات الأمان:", error)

    // يمكن تنفيذ منطق للتعافي من الأخطاء هنا

    // محاولة تهيئة الخدمات الأساسية فقط
    encryptionService.initialize().then(() => {
      console.log("تمت تهيئة خدمة التشفير (وضع الطوارئ)")
    })

    // تعيين وضع الأمان المنخفض
    this.initialized = false
  }

  // إيقاف جميع الخدمات الأمنية
  public stopServices(): void {
    if (this.securityChecksInterval) {
      clearInterval(this.securityChecksInterval)
      this.securityChecksInterval = null
    }

    try {
      antiTamperService.stopService()
      licenseVerificationService.stopService()
    } catch (error) {
      console.error("خطأ في إيقاف الخدمات الأمنية:", error)
    }

    this.initialized = false
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const securityService = SecurityService.getInstance()
