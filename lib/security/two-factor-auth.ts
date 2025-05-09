import { encryptionService } from "./encryption-service"
import type { SecureStoragePlugin } from "@capacitor/core"
import { Capacitor } from "@capacitor/core"
import CryptoJS from "crypto-js"

export class TwoFactorAuth {
  private static instance: TwoFactorAuth
  private readonly tokenLength: number = 6
  private readonly tokenValidityPeriod: number = 30 // ثانية
  private secureStorage: SecureStoragePlugin | null = null

  // استخدام نمط Singleton
  public static getInstance(): TwoFactorAuth {
    if (!TwoFactorAuth.instance) {
      TwoFactorAuth.instance = new TwoFactorAuth()
    }
    return TwoFactorAuth.instance
  }

  // تهيئة الخدمة
  public async initialize(): Promise<void> {
    // استخدام التخزين الآمن إذا كان متاحًا، وإلا سيتم استخدام التشفير مع localStorage
    if (Capacitor.isNativePlatform()) {
      try {
        this.secureStorage = Capacitor.Plugins.SecureStoragePlugin as SecureStoragePlugin
      } catch (error) {
        console.warn("التخزين الآمن غير متاح، سيتم استخدام التشفير مع localStorage")
      }
    }
  }

  // إنشاء سر TOTP للمستخدم
  public async generateTOTPSecret(userId: string): Promise<string> {
    // إنشاء سر عشوائي للمستخدم
    const secret = this.generateRandomSecret(20)

    // تخزين السر بشكل آمن
    await this.storeSecret(userId, secret)

    return secret
  }

  // التحقق من رمز TOTP المقدم
  public async verifyTOTP(userId: string, token: string): Promise<boolean> {
    try {
      // استرداد سر المستخدم
      const secret = await this.retrieveSecret(userId)
      if (!secret) {
        throw new Error("لم يتم العثور على سر TOTP للمستخدم")
      }

      // حساب الرمز الحالي
      const currentToken = this.generateTOTP(secret)

      // التحقق من الرمز (مع السماح برمز فترة واحدة قبل أو بعد للتعويض عن مزامنة الوقت)
      const previousToken = this.generateTOTP(secret, -1)
      const nextToken = this.generateTOTP(secret, 1)

      return token === currentToken || token === previousToken || token === nextToken
    } catch (error) {
      console.error("خطأ في التحقق من رمز TOTP:", error)
      return false
    }
  }

  // إنشاء QR Code لإعداد تطبيقات المصادقة
  public generateQRCodeURL(userId: string, secret: string, appName = "WOLF App"): string {
    const encodedAppName = encodeURIComponent(appName)
    const encodedUserId = encodeURIComponent(userId)
    const encodedSecret = encodeURIComponent(secret)

    return `otpauth://totp/${encodedAppName}:${encodedUserId}?secret=${encodedSecret}&issuer=${encodedAppName}`
  }

  // تفعيل 2FA للمستخدم
  public async enable2FA(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const secret = await this.generateTOTPSecret(userId)
    const qrCodeUrl = this.generateQRCodeURL(userId, secret)

    // تسجيل أن المستخدم قد فعّل 2FA
    await this.storeUserPreference(userId, "2fa_enabled", true)

    return { secret, qrCodeUrl }
  }

  // تعطيل 2FA للمستخدم
  public async disable2FA(userId: string): Promise<void> {
    // حذف سر TOTP
    await this.removeSecret(userId)

    // تسجيل أن المستخدم قد عطّل 2FA
    await this.storeUserPreference(userId, "2fa_enabled", false)
  }

  // التحقق مما إذا كان المستخدم قد فعّل 2FA
  public async is2FAEnabled(userId: string): Promise<boolean> {
    return (await this.getUserPreference(userId, "2fa_enabled")) || false
  }

  // إنشاء رمز استرداد لحالات فقدان الوصول
  public async generateRecoveryCodes(userId: string, count = 10): Promise<string[]> {
    const codes: string[] = []

    for (let i = 0; i < count; i++) {
      // إنشاء رمز استرداد عشوائي
      const code = this.generateRandomString(10)
      codes.push(code)
    }

    // تخزين رموز الاسترداد بشكل آمن (بعد تشفيرها)
    await this.storeUserPreference(userId, "recovery_codes", JSON.stringify(codes))

    return codes
  }

  // التحقق من رمز الاسترداد
  public async verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
    const storedCodesStr = await this.getUserPreference(userId, "recovery_codes")
    if (!storedCodesStr) return false

    try {
      const storedCodes = JSON.parse(storedCodesStr as string)

      // التحقق مما إذا كان الرمز موجودًا في القائمة
      const index = storedCodes.indexOf(code)
      if (index === -1) return false

      // حذف الرمز المستخدم من القائمة
      storedCodes.splice(index, 1)
      await this.storeUserPreference(userId, "recovery_codes", JSON.stringify(storedCodes))

      return true
    } catch (error) {
      console.error("خطأ في التحقق من رمز الاسترداد:", error)
      return false
    }
  }

  // حساب رمز TOTP استنادًا إلى سر ووحدة زمنية
  private generateTOTP(secret: string, timeOffset = 0): string {
    // الحصول على وحدة الوقت الحالية (عادة 30 ثانية)
    const timeStep = this.tokenValidityPeriod
    let timeCounter = Math.floor(Date.now() / 1000 / timeStep) + timeOffset

    // تحويل وحدة الوقت إلى عدد ثنائي من 8 بايت
    const timeBytes = new Uint8Array(8)
    for (let i = 7; i >= 0; i--) {
      timeBytes[i] = timeCounter & 0xff
      timeCounter = timeCounter >>> 8
    }

    // إنشاء مفتاح HMAC من السر
    const secretBytes = this.base32ToBytes(secret)
    const hmacResult = CryptoJS.HmacSHA1(
      CryptoJS.lib.WordArray.create(timeBytes as any, timeBytes.length),
      CryptoJS.lib.WordArray.create(secretBytes as any, secretBytes.length),
    )

    // استخراج الرمز من نتيجة HMAC
    const hmacHex = hmacResult.toString(CryptoJS.enc.Hex)
    const offset = Number.parseInt(hmacHex.substring(hmacHex.length - 1), 16)
    const truncatedHash = hmacHex.substring(offset * 2, offset * 2 + 8)
    const token = Number.parseInt(truncatedHash, 16) & 0x7fffffff

    // إنشاء رمز من الأرقام المطلوبة
    const paddedToken = (token % Math.pow(10, this.tokenLength)).toString().padStart(this.tokenLength, "0")

    return paddedToken
  }

  // إنشاء سر عشوائي
  private generateRandomSecret(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567" // Base32 characters
    let result = ""
    const randomBytes = new Uint8Array(length)
    crypto.getRandomValues(randomBytes)

    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomBytes[i] % chars.length)
    }

    return result
  }

  // إنشاء سلسلة عشوائية
  private generateRandomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    const randomBytes = new Uint8Array(length)
    crypto.getRandomValues(randomBytes)

    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomBytes[i] % chars.length)
    }

    return result
  }

  // تحويل Base32 إلى مصفوفة بايت
  private base32ToBytes(base32: string): Uint8Array {
    const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    let bits = 0
    let value = 0
    let index = 0

    const result = new Uint8Array(Math.ceil((base32.length * 5) / 8))

    for (let i = 0; i < base32.length; i++) {
      const charValue = base32Chars.indexOf(base32.charAt(i).toUpperCase())
      if (charValue === -1) continue

      value = (value << 5) | charValue
      bits += 5

      if (bits >= 8) {
        result[index++] = (value >>> (bits - 8)) & 0xff
        bits -= 8
      }
    }

    return result
  }

  // تخزين سر المستخدم بشكل آمن
  private async storeSecret(userId: string, secret: string): Promise<void> {
    const key = `totp_secret_${userId}`

    if (this.secureStorage) {
      await this.secureStorage.set({ key, value: secret })
    } else {
      // استخدام خدمة التشفير لتخزين السر
      await encryptionService.secureStore(key, secret)
    }
  }

  // استرداد سر المستخدم
  private async retrieveSecret(userId: string): Promise<string | null> {
    const key = `totp_secret_${userId}`

    try {
      if (this.secureStorage) {
        const result = await this.secureStorage.get({ key })
        return result.value
      } else {
        // استخدام خدمة التشفير لاسترداد السر
        return await encryptionService.secureRetrieve(key)
      }
    } catch (error) {
      console.error(`خطأ في استرداد سر TOTP للمستخدم ${userId}:`, error)
      return null
    }
  }

  // حذف سر المستخدم
  private async removeSecret(userId: string): Promise<void> {
    const key = `totp_secret_${userId}`

    if (this.secureStorage) {
      await this.secureStorage.remove({ key })
    } else {
      localStorage.removeItem(`secure_${key}`)
    }
  }

  // تخزين تفضيلات المستخدم
  private async storeUserPreference(userId: string, prefKey: string, value: any): Promise<void> {
    const key = `user_pref_${userId}_${prefKey}`
    await encryptionService.secureStore(key, value)
  }

  // استرداد تفضيلات المستخدم
  private async getUserPreference(userId: string, prefKey: string): Promise<any> {
    const key = `user_pref_${userId}_${prefKey}`
    return await encryptionService.secureRetrieve(key)
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const twoFactorAuth = TwoFactorAuth.getInstance()
