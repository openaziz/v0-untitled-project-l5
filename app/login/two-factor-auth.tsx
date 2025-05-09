"use client"

import { useState, useEffect } from "react"
import { securityService } from "@/lib/security/security-service"

interface TwoFactorAuthProps {
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

export function TwoFactorAuth({ userId, onSuccess, onCancel }: TwoFactorAuthProps) {
  const [otp, setOtp] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingTime, setRemainingTime] = useState<number>(30)
  const [showRecovery, setShowRecovery] = useState<boolean>(false)
  const [recoveryCode, setRecoveryCode] = useState<string>("")

  // إعداد العداد التنازلي
  useEffect(() => {
    if (remainingTime <= 0) {
      setRemainingTime(30)
    }

    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 30))
    }, 1000)

    return () => clearInterval(timer)
  }, [remainingTime])

  // التحقق من رمز TOTP
  const handleVerify = async () => {
    if (otp.length < 6) {
      setError("الرجاء إدخال رمز مكون من 6 أرقام")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const isValid = await securityService.verifyTOTP(userId, otp)

      if (isValid) {
        // تسجيل نشاح التحقق بخطوتين
        securityService.logActivity("2fa_success", { userId })
        onSuccess()
      } else {
        // تسجيل فشل التحقق بخطوتين
        securityService.logActivity("2fa_failure", { userId })
        setError("رمز غير صحيح. الرجاء المحاولة مرة أخرى.")
      }
    } catch (err) {
      console.error("خطأ في التحقق من رمز TOTP:", err)
      setError("حدث خطأ أثناء التحقق من الرمز. الرجاء المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  // التحقق من رمز الاسترداد
  const handleRecoveryVerify = async () => {
    if (recoveryCode.length < 8) {
      setError("الرجاء إدخال رمز استرداد صالح")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const isValid = await securityService.verifyRecoveryCode(userId, recoveryCode)

      if (isValid) {
        // تسجيل نجاح استخدام رمز الاسترداد
        securityService.logActivity("recovery_code_success", { userId })
        onSuccess()
      } else {
        // تسجيل فشل استخدام رمز الاسترداد
        securityService.logActivity("recovery_code_failure", { userId })
        setError("رمز استرداد غير صالح")
      }
    } catch (err) {
      console.error("خطأ في التحقق من رمز الاسترداد:", err)
      setError("حدث خطأ أثناء التحقق من رمز الاسترداد")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">التحقق بخطوتين</h2>

        {!showRecovery ? (
          <>
            <p className="text-sm text-gray-300 mb-6">
              الرجاء إدخال رمز التحقق المكون من 6 أرقام من تطبيق المصادقة الخاص بك.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                  رمز التحقق
                </label>
                <input
                  type="text"
                  id="otp"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <div className="mt-1 text-sm text-gray-400 flex justify-between">
                  <span>يتم تحديث الرمز في</span>
                  <span className="text-blue-400">{remainingTime} ثانية</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "جاري التحقق..." : "تأكيد"}
                </button>

                <div className="flex justify-between">
                  <button onClick={() => setShowRecovery(true)} className="text-sm text-blue-400 hover:text-blue-300">
                    استخدام رمز الاسترداد
                  </button>

                  <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-300">
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-300 mb-6">
              إذا لم تتمكن من الوصول إلى تطبيق المصادقة الخاص بك، يمكنك استخدام رمز الاسترداد.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="recoveryCode" className="block text-sm font-medium text-gray-300 mb-1">
                  رمز الاسترداد
                </label>
                <input
                  type="text"
                  id="recoveryCode"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل رمز الاسترداد"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleRecoveryVerify}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "جاري التحقق..." : "استخدام رمز الاسترداد"}
                </button>

                <div className="flex justify-between">
                  <button onClick={() => setShowRecovery(false)} className="text-sm text-blue-400 hover:text-blue-300">
                    العودة إلى رمز التحقق
                  </button>

                  <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-300">
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
