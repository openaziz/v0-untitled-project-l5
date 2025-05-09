"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { securityService } from "@/lib/security/security-service"

export function SecurityInitializer({ children }: { children: React.ReactNode }) {
  const [isSecurityInitialized, setIsSecurityInitialized] = useState(false)
  const [securityError, setSecurityError] = useState<string | null>(null)

  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await securityService.initialize()
        setIsSecurityInitialized(true)
      } catch (error) {
        console.error("فشل في تهيئة نظام الأمان:", error)
        setSecurityError("حدث خطأ أثناء تهيئة نظام الأمان. يرجى إعادة تشغيل التطبيق.")
      }
    }

    initializeSecurity()

    // تنظيف عند إزالة المكون
    return () => {
      securityService.stopServices()
    }
  }, [])

  // إظهار مؤشر التحميل أثناء تهيئة النظام الأمني
  if (!isSecurityInitialized && !securityError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white">جاري تهيئة نظام الأمان...</p>
      </div>
    )
  }

  // إظهار رسالة الخطأ إذا حدث خطأ
  if (securityError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="bg-red-500/20 p-4 rounded-lg mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-white text-center">{securityError}</p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          إعادة تحميل التطبيق
        </button>
      </div>
    )
  }

  // إظهار محتوى التطبيق بعد تهيئة النظام الأمني
  return <>{children}</>
}
