"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function ContactPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال النموذج
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // إعادة تعيين النموذج بعد النجاح
      setTimeout(() => {
        setSuccess(false)
        setName("")
        setEmail("")
        setMessage("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      {/* الخلفية مع التدرجات */}
      <div className="absolute inset-0 bg-black opacity-90 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#00ffff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#ff00ff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffff0033,transparent_70%)]"></div>
      </div>

      {/* الرأس */}
      <header className="flex items-center p-4 relative z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold mr-4">اتصل بنا</h1>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col p-6 relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-8 flex justify-center">
            <Image src="/images/wolf-logo.png" alt="WOLF Logo" width={80} height={80} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* معلومات الاتصال */}
            <div className="bg-zinc-900/60 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">معلومات الاتصال</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600/20 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">البريد الإلكتروني</h3>
                    <a href="mailto:sa6aa6116@gmail.com" className="text-blue-400 hover:underline">
                      sa6aa6116@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-600/20 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">رقم الهاتف</h3>
                    <a href="tel:+96894165819" className="text-green-400 hover:underline">
                      +968 94165819
                    </a>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-3">ساعات العمل</h3>
                  <p className="text-gray-400">الأحد - الخميس: 9:00 صباحًا - 5:00 مساءً</p>
                  <p className="text-gray-400">الجمعة - السبت: مغلق</p>
                </div>
              </div>
            </div>

            {/* نموذج الاتصال */}
            <div className="bg-zinc-900/60 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">أرسل لنا رسالة</h2>

              {success ? (
                <div className="bg-green-900/50 border border-green-500 text-white p-4 rounded-md text-center">
                  <p className="font-medium">تم إرسال رسالتك بنجاح!</p>
                  <p className="text-sm mt-1">سنرد عليك في أقرب وقت ممكن.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      الاسم
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="أدخل اسمك"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      الرسالة
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                      placeholder="اكتب رسالتك هنا..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        إرسال الرسالة
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
