"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // إرسال رسالة الاتصال
    alert("تم إرسال رسالتك بنجاح!")
    router.push("/")
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <X />
        </Button>
        <h1 className="text-xl font-semibold">اتصل بنا</h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="bg-zinc-800 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-300 mb-4">
            نحن هنا للمساعدة! إذا كان لديك أي استفسارات أو اقتراحات، يرجى ملء النموذج أدناه وسنرد عليك في أقرب وقت ممكن.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                الاسم
              </label>
              <Input
                id="name"
                className="bg-zinc-700 border-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                className="bg-zinc-700 border-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                الرسالة
              </label>
              <Textarea
                id="message"
                className="bg-zinc-700 border-none min-h-[150px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
              <Send className="mr-2 h-4 w-4" /> إرسال
            </Button>
          </form>
        </Card>

        <Card className="bg-zinc-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">معلومات الاتصال</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>البريد الإلكتروني: support@wolf-ai.com</p>
            <p>ساعات العمل: الأحد - الخميس، 9 صباحاً - 5 مساءً</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
