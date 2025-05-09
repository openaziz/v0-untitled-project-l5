"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function EmailLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور")
      return
    }

    setIsLoading(true)

    // Simulación de inicio de sesión
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      {/* Fondo con gradientes */}
      <div className="absolute inset-0 bg-black opacity-90 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#00ffff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#ff00ff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffff0033,transparent_70%)]"></div>
      </div>

      {/* Header */}
      <header className="flex items-center p-4 relative z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/login")} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold mr-4">تسجيل الدخول</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Image src="/images/wolf-logo.png" alt="WOLF Logo" width={80} height={80} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-md text-sm">{error}</div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="أدخل بريدك الإلكتروني"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  كلمة المرور
                </label>
                <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
                  نسيت كلمة المرور؟
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="أدخل كلمة المرور"
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              ليس لديك حساب؟{" "}
              <button onClick={() => router.push("/signup")} className="text-blue-400 hover:text-blue-300">
                إنشاء حساب
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
