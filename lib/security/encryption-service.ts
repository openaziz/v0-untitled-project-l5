import { Device } from "@capacitor/device"
import CryptoJS from "crypto-js"

export class EncryptionService {
  private static instance: EncryptionService
  private deviceId: string | null = null
  private readonly fallbackKey = "WOLF_SECURE_ENCRYPTION_KEY_DO_NOT_MODIFY"
  private initialized = false

  // استخدام نمط Singleton للتأكد من وجود نسخة واحدة فقط
  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService()
    }
    return EncryptionService.instance
  }

  // تهيئة خدمة التشفير
  public async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // الحصول على معرف الجهاز الفريد لاستخدامه كجزء من مفتاح التشفير
      const info = await Device.getInfo()
      const id = await Device.getId()

      // دمج معرف الجهاز مع معلومات النظام لإنشاء مفتاح فريد
      this.deviceId = `${id.uuid}_${info.platform}_${info.model}`
      console.log("تمت تهيئة خدمة التشفير بنجاح")
    } catch (error) {
      console.error("خطأ في تهيئة خدمة التشفير:", error)
      // استخدام المفتاح الاحتياطي في حالة الفشل
      this.deviceId = null
    }

    this.initialized = true
  }

  // الحصول على مفتاح التشفير
  private getEncryptionKey(salt?: string): string {
    // إنشاء مفتاح مركب من معرف الجهاز والملح المقدم
    const baseSalt = salt || "WOLF_DEFAULT_SALT"
    const deviceKey = this.deviceId || this.fallbackKey

    // استخدام PBKDF2 لاشتقاق مفتاح آمن
    return CryptoJS.PBKDF2(deviceKey, baseSalt, {
      keySize: 256 / 32,
      iterations: 1000,
    }).toString()
  }

  // تشفير البيانات
  public encrypt(data: string | object, salt?: string): string {
    if (!this.initialized) {
      throw new Error("خدمة التشفير غير مهيأة. يرجى استدعاء initialize() أولاً.")
    }

    try {
      // تحويل البيانات إلى سلسلة نصية إذا كانت كائنًا
      const dataString = typeof data === "object" ? JSON.stringify(data) : data

      // الحصول على مفتاح التشفير
      const key = this.getEncryptionKey(salt)

      // تشفير البيانات باستخدام AES
      const encrypted = CryptoJS.AES.encrypt(dataString, key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      })

      return encrypted.toString()
    } catch (error) {
      console.error("خطأ في تشفير البيانات:", error)
      throw new Error("فشل تشفير البيانات")
    }
  }

  // فك تشفير البيانات
  public decrypt(encryptedData: string, salt?: string): string {
    if (!this.initialized) {
      throw new Error("خدمة التشفير غير مهيأة. يرجى استدعاء initialize() أولاً.")
    }

    try {
      // الحصول على مفتاح التشفير
      const key = this.getEncryptionKey(salt)

      // فك تشفير البيانات باستخدام AES
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key)

      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error("خطأ في فك تشفير البيانات:", error)
      throw new Error("فشل فك تشفير البيانات")
    }
  }

  // تشفير البيانات الحساسة مع تشفير إضافي
  public encryptSensitive(data: string, userKey: string): string {
    // استخدام مفتاح المستخدم كملح إضافي للتشفير المزدوج
    const firstPass = this.encrypt(data)
    return this.encrypt(firstPass, userKey)
  }

  // فك تشفير البيانات الحساسة
  public decryptSensitive(encryptedData: string, userKey: string): string {
    // فك التشفير المزدوج باستخدام مفتاح المستخدم
    const firstPass = this.decrypt(encryptedData, userKey)
    return this.decrypt(firstPass)
  }

  // تشفير البيانات للتخزين المحلي الآمن
  public async secureStore(key: string, data: any): Promise<void> {
    const encryptedData = this.encrypt(data)
    localStorage.setItem(`secure_${key}`, encryptedData)
  }

  // استرداد البيانات المشفرة من التخزين المحلي
  public async secureRetrieve(key: string): Promise<any> {
    const encryptedData = localStorage.getItem(`secure_${key}`)
    if (!encryptedData) return null

    try {
      const decryptedData = this.decrypt(encryptedData)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.error(`خطأ في استرداد البيانات المشفرة للمفتاح ${key}:`, error)
      return null
    }
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const encryptionService = EncryptionService.getInstance()
