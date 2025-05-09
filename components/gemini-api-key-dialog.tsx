"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveGeminiConfigState } from "@/lib/gemini-config"

interface GeminiApiKeyDialogProps {
  onClose: () => void
}

export function GeminiApiKeyDialog({ onClose }: GeminiApiKeyDialogProps) {
  const [isTesting, setIsTesting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleTest = async () => {
    setIsTesting(true)
    setError("")
    setSuccess("")

    try {
      // اختبار الاتصال بـ API
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Hello",
          maxTokens: 10,
        }),
      })

      if (response.ok) {
        // حفظ حالة التكوين
        saveGeminiConfigState(true)
        setSuccess("تم التحقق من الاتصال بنجاح")

        // إغلاق الحوار بعد ثانيتين
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(`فشل الاتصال: ${errorData.error || "خطأ غير معروف"}`)
        saveGeminiConfigState(false)
      }
    } catch (error) {
      console.error("خطأ في اختبار الاتصال:", error)
      setError("حدث خطأ أثناء الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")
      saveGeminiConfigState(false)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">إعداد Google Gemini API</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-sm text-gray-300 mb-6">
          لاستخدام ميزات Google Gemini المتقدمة، يجب تكوين مفتاح API على الخادم. تم تكوين هذا المفتاح بواسطة مسؤول
          النظام.
        </p>

        <div className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={handleTest} disabled={isTesting}>
              {isTesting ? "جاري الاختبار..." : "اختبار الاتصال"}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          <p>ملاحظة: إذا واجهت مشاكل في الاتصال، يرجى التواصل مع مسؤول النظام للتحقق من تكوين مفتاح API.</p>
        </div>
      </div>
    </div>
  )
}
