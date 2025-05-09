import { Device } from "@capacitor/device"
import { App } from "@capacitor/app"
import { encryptionService } from "./encryption-service"
import { Network } from "@capacitor/network"

export class LicenseVerificationService {
  private static instance: LicenseVerificationService
  private initialized = false
  private licenseCheckInterval: any = null
  private licenseInfo: any = null
  private readonly LICENSE_INFO_KEY = "license_info"
  private readonly LICENSE_SERVER_URL = "https://api.wolfapp.com/license/verify" // استبدل بعنوان URL الخاص بك
  private readonly OFFLINE_GRACE_PERIOD_DAYS = 7 // فترة السماح للتحقق دون اتصال بالإنترنت

  // استخدام نمط Singleton
  public static getInstance(): LicenseVerificationService {
    if (!LicenseVerificationService.instance) {
      LicenseVerificationService.instance = new LicenseVerificationService()
    }
    return LicenseVerificationService.instance
  }

  // تهيئة الخدمة
  public async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // محاولة استرداد معلومات الترخيص المخزنة
      this.licenseInfo = await this.getStoredLicenseInfo()

      // بدء فحص الترخيص الدوري
      this.startLicenseChecks()

      this.initialized = true
      console.log("تمت تهيئة خدمة التحقق من الترخيص بنجاح")
    } catch (error) {
      console.error("خطأ في تهيئة خدمة التحقق من الترخيص:", error)
    }
  }

  // التحقق من صلاحية الترخيص
  public async verifyLicense(licenseKey: string, forceOnline = false): Promise<{ isValid: boolean; message: string }> {
    try {
      // التحقق من اتصال الإنترنت
      const networkStatus = await Network.getStatus()

      if (networkStatus.connected && (forceOnline || !this.licenseInfo)) {
        // إذا كان هناك اتصال بالإنترنت، تحقق عبر الإنترنت
        return await this.performOnlineLicenseVerification(licenseKey)
      } else {
        // إذا لم يكن هناك اتصال بالإنترنت، تحقق دون اتصال
        return await this.performOfflineLicenseVerification(licenseKey)
      }
    } catch (error) {
      console.error("خطأ في التحقق من الترخيص:", error)
      return { isValid: false, message: "حدث خطأ أثناء التحقق من الترخيص" }
    }
  }

  // التحقق من الترخيص عبر الإنترنت
  private async performOnlineLicenseVerification(licenseKey: string): Promise<{ isValid: boolean; message: string }> {
    try {
      // جمع معلومات الجهاز للتحقق
      const deviceInfo = await this.collectDeviceInfo()

      // إرسال طلب التحقق إلى الخادم
      const response = await fetch(this.LICENSE_SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseKey,
          deviceInfo,
        }),
      })

      if (!response.ok) {
        throw new Error(`فشل طلب التحقق: ${response.status}`)
      }

      const result = await response.json()

      if (result.isValid) {
        // تخزين معلومات الترخيص للاستخدام دون اتصال لاحقًا
        await this.storeLicenseInfo(licenseKey, result.licenseInfo)
      }

      return {
        isValid: result.isValid,
        message: result.message || (result.isValid ? "ترخيص صالح" : "ترخيص غير صالح"),
      }
    } catch (error) {
      console.error("خطأ في التحقق من الترخيص عبر الإنترنت:", error)

      // إذا فشل التحقق عبر الإنترنت، حاول التحقق دون اتصال كخطة بديلة
      return await this.performOfflineLicenseVerification(licenseKey)
    }
  }

  // التحقق من الترخيص دون اتصال
  private async performOfflineLicenseVerification(licenseKey: string): Promise<{ isValid: boolean; message: string }> {
    try {
      // التحقق من وجود معلومات ترخيص مخزنة
      if (!this.licenseInfo) {
        return { isValid: false, message: "لم يتم العثور على معلومات ترخيص. يرجى التحقق من الترخيص عبر الإنترنت." }
      }

      // التحقق من مفتاح الترخيص
      if (this.licenseInfo.licenseKey !== licenseKey) {
        return { isValid: false, message: "مفتاح الترخيص غير متطابق" }
      }

      // التحقق من معرف الجهاز
      const deviceId = (await Device.getId()).uuid
      if (this.licenseInfo.deviceId !== deviceId) {
        return { isValid: false, message: "معرف الجهاز غير متطابق" }
      }

      // التحقق من تاريخ انتهاء الصلاحية
      const currentDate = new Date()
      const expiryDate = new Date(this.licenseInfo.expiryDate)
      if (currentDate > expiryDate) {
        return { isValid: false, message: "انتهت صلاحية الترخيص" }
      }

      // التحقق من تاريخ آخر تحقق عبر الإنترنت
      const lastOnlineCheck = new Date(this.licenseInfo.lastOnlineCheck)
      const graceDate = new Date(lastOnlineCheck)
      graceDate.setDate(graceDate.getDate() + this.OFFLINE_GRACE_PERIOD_DAYS)

      if (currentDate > graceDate) {
        return {
          isValid: true,
          message: "الترخيص صالح، لكن يلزم التحقق عبر الإنترنت قريبًا",
        }
      }

      return { isValid: true, message: "ترخيص صالح" }
    } catch (error) {
      console.error("خطأ في التحقق من الترخيص دون اتصال:", error)
      return { isValid: false, message: "حدث خطأ أثناء التحقق من الترخيص" }
    }
  }

  // بدء فحوصات الترخيص الدورية
  private startLicenseChecks(): void {
    if (this.licenseCheckInterval) {
      clearInterval(this.licenseCheckInterval)
    }

    // التحقق من الترخيص كل 24 ساعة
    this.licenseCheckInterval = setInterval(
      async () => {
        if (this.licenseInfo && this.licenseInfo.licenseKey) {
          try {
            const result = await this.verifyLicense(this.licenseInfo.licenseKey, true)
            if (!result.isValid) {
              this.handleInvalidLicense(result.message)
            }
          } catch (error) {
            console.error("خطأ في فحص الترخيص الدوري:", error)
          }
        }
      },
      24 * 60 * 60 * 1000,
    ) // فحص كل 24 ساعة
  }

  // جمع معلومات الجهاز
  private async collectDeviceInfo(): Promise<any> {
    try {
      const deviceInfo = await Device.getInfo()
      const deviceId = await Device.getId()
      const appInfo = await App.getInfo()

      return {
        deviceId: deviceId.uuid,
        platform: deviceInfo.platform,
        model: deviceInfo.model,
        osVersion: deviceInfo.osVersion,
        appVersion: appInfo.version,
        buildNumber: appInfo.build,
      }
    } catch (error) {
      console.error("خطأ في جمع معلومات الجهاز:", error)
      return {}
    }
  }

  // تخزين معلومات الترخيص
  private async storeLicenseInfo(licenseKey: string, licenseInfo: any): Promise<void> {
    try {
      // إضافة معلومات إضافية
      const deviceId = (await Device.getId()).uuid
      const enhancedInfo = {
        ...licenseInfo,
        licenseKey,
        deviceId,
        lastOnlineCheck: new Date().toISOString(),
      }

      // تخزين المعلومات بشكل آمن
      await encryptionService.secureStore(this.LICENSE_INFO_KEY, enhancedInfo)
      this.licenseInfo = enhancedInfo
    } catch (error) {
      console.error("خطأ في تخزين معلومات الترخيص:", error)
    }
  }

  // استرداد معلومات الترخيص المخزنة
  private async getStoredLicenseInfo(): Promise<any> {
    try {
      return await encryptionService.secureRetrieve(this.LICENSE_INFO_KEY)
    } catch (error) {
      console.error("خطأ في استرداد معلومات الترخيص:", error)
      return null
    }
  }

  // التعامل مع الترخيص غير الصالح
  private handleInvalidLicense(message: string): void {
    console.error(`ترخيص غير صالح: ${message}`)

    // يمكن هنا تنفيذ منطق معالجة الترخيص غير الصالح
    // مثل إظهار إشعار للمستخدم، أو تقييد وظائف التطبيق، أو إنهاء التطبيق

    alert(`انتهت صلاحية ترخيص التطبيق: ${message}. يرجى تجديد الترخيص للاستمرار في استخدام التطبيق.`)
  }

  // إيقاف الخدمة
  public stopService(): void {
    if (this.licenseCheckInterval) {
      clearInterval(this.licenseCheckInterval)
      this.licenseCheckInterval = null
    }

    this.initialized = false
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const licenseVerificationService = LicenseVerificationService.getInstance()
