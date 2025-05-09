"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashScreen() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // زيادة شريط التقدم تدريجيًا
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 5
      })
    }, 100)

    // التنقل إلى الصفحة الرئيسية بعد انتهاء شاشة البداية
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        router.push("/login")
      }, 500) // انتظر انتهاء تأثير التلاشي
    }, 2500)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-black transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-40 h-40 mb-8 animate-pulse">
        <Image
          src="/images/wolf-logo.png"
          alt="WOLF Logo"
          layout="fill"
          objectFit="contain"
          className="animate-[pulse_2s_ease-in-out_infinite]"
        />
      </div>

      {/* تأثير الهالة */}
      <div className="absolute w-60 h-60 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-300"></div>

      <h1 className="text-3xl font-bold text-white mb-8 z-10">WOLF</h1>

      {/* شريط التقدم */}
      <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-gray-400 text-sm">تحميل التطبيق...</p>
    </div>
  )
}
