"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveGeminiApiKey, validateGeminiApiKey, getGeminiApiKey, removeGeminiApiKey } from "@/lib/gemini-config"

interface GeminiApiKeyDialogProps {
  onClose: () => void
}

export function GeminiApiKeyDialog({ onClose }: GeminiApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState<string>("")
  const [isTesting, setIsTesting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const savedKey = getGeminiApiKey()
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleTest = async () => {
    setIsTesting(true)
    setError("")
    setSuccess("")

    try {
      if (!apiKey.trim()) {
        setError("الرجاء إدخال مفتاح API")
        setIsTesting(false)
        return
      }

      // التحقق من صحة مفتاح API
      const isValid = await validateGeminiApiKey(apiKey)

      if (isValid) {
        // حفظ مفتاح API
        saveGeminiApiKey(apiKey)
        setSuccess("تم التحقق من مفتاح API بنجاح وحفظه")

        // إغلاق الحوار بعد ثانيتين
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError("مفتاح API غير صالح. يرجى التحقق من المفتاح والمحاولة مرة أخرى.")
      }
    } catch (error) {
      console.error("خطأ في اختبار مفتاح API:", error)
      setError("حدث خطأ أثناء التحقق من مفتاح API. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")
    } finally {
      setIsTesting(false)
    }
  }

  const handleRemoveKey = () => {
    removeGeminiApiKey()
    setApiKey("")
    setSuccess("تم حذف مفتاح API بنجاح")
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
          لاستخدام ميزات Google Gemini المتقدمة، يمكنك إدخال مفتاح API الخاص بك. يمكنك الحصول على مفتاح API من لوحة تحكم
          Google AI Studio.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              مفتاح API الخاص بك
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
              placeholder="أدخل مفتاح API الخاص بك هنا"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="flex justify-end gap-2">
            {apiKey && (
              <Button variant="destructive" onClick={handleRemoveKey}>
                حذف المفتاح
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={handleTest} disabled={isTesting}>
              {isTesting ? "جاري التحقق..." : "حفظ والتحقق"}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          <p>ملاحظة: يتم تخزين مفتاح API الخاص بك بشكل آمن على جهازك فقط ولا يتم مشاركته مع أي خوادم خارجية.</p>
          <p className="mt-1">
            للحصول على مفتاح API، قم بزيارة{" "}
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
