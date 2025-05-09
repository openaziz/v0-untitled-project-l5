"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { notificationService } from "@/lib/notification-service"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    google: false,
    github: false,
    phone: false,
    apple: false,
  })

  const handleLogin = async (provider: string) => {
    // تعيين حالة التحميل للمزود المحدد
    setIsLoading((prev) => ({ ...prev, [provider]: true }))

    try {
      // هنا ستكون منطق تسجيل الدخول الفعلي
      console.log(`تسجيل الدخول باستخدام ${provider}`)

      // محاكاة تأخير الشبكة
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // تهيئة خدمة الإشعارات بعد تسجيل الدخول
      await notificationService.initialize()

      // محاكاة تسجيل دخول ناجح
      router.push("/")
    } catch (error) {
      console.error(`خطأ في تسجيل الدخول باستخدام ${provider}:`, error)
      // هنا يمكنك عرض رسالة خطأ للمستخدم
    } finally {
      // إعادة تعيين حالة التحميل
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* خلفية مع تدرجات */}
      <div className="absolute inset-0 bg-black opacity-90 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#00ffff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#ff00ff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffff0033,transparent_70%)]"></div>
      </div>

      {/* الشعار */}
      <div className="relative z-10 mb-5">
        <Image
          src="/images/wolf-logo.png"
          alt="WOLF Logo"
          width={120}
          height={120}
          className="animate-[pulse_4s_ease-in-out_infinite]"
        />
      </div>

      {/* العنوان */}
      <h1 className="text-2xl mb-10 text-center relative z-10">
        مرحبًا بك في <strong>WOLF</strong>
      </h1>

      {/* أزرار تسجيل الدخول */}
      <div className="flex flex-col gap-4 w-[90%] max-w-[360px] relative z-10">
        {/* زر Google */}
        <button
          onClick={() => handleLogin("google")}
          disabled={Object.values(isLoading).some(Boolean)}
          className="py-3.5 px-4 text-base rounded-lg flex items-center justify-center gap-2.5 bg-gradient-to-r from-white to-gray-200 text-black transition-transform hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading.google ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" alt="Google" />
          )}
          متابعة باستخدام Google
        </button>

        {/* زر GitHub */}
        <button
          onClick={() => handleLogin("github")}
          disabled={Object.values(isLoading).some(Boolean)}
          className="py-3.5 px-4 text-base rounded-lg flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#333] to-[#111] text-white transition-transform hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading.github ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" width="20" alt="GitHub" />
          )}
          متابعة باستخدام GitHub
        </button>

        {/* زر رقم الهاتف */}
        <button
          onClick={() => handleLogin("phone")}
          disabled={Object.values(isLoading).some(Boolean)}
          className="py-3.5 px-4 text-base rounded-lg flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white transition-transform hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading.phone ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          )}
          متابعة باستخدام رقم الهاتف
        </button>

        {/* زر Apple */}
        <button
          onClick={() => handleLogin("apple")}
          disabled={Object.values(isLoading).some(Boolean)}
          className="py-3.5 px-4 text-base rounded-lg flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#f1f1f1] to-[#cccccc] text-black transition-transform hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading.apple ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <img src="https://www.svgrepo.com/show/452210/apple.svg" width="20" alt="Apple" />
          )}
          متابعة باستخدام Apple
        </button>
      </div>

      {/* التذييل */}
      <footer className="absolute bottom-2.5 text-sm text-gray-400 flex gap-4 z-10">
        <Link href="/terms" className="hover:text-white transition-colors">
          شروط الخدمة
        </Link>
        <Link href="/privacy" className="hover:text-white transition-colors">
          سياسة الخصوصية
        </Link>
      </footer>
    </div>
  )
}
