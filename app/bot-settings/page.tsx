"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { BotPersonality } from "@/lib/types"

export default function BotSettingsPage() {
  const router = useRouter()
  const [personality, setPersonality] = useState<BotPersonality>("neutral")

  const handleSave = () => {
    // حفظ إعدادات البوت
    localStorage.setItem("botPersonality", personality)
    router.push("/")
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <X />
        </Button>
        <h1 className="text-xl font-semibold">تخصيص البوت</h1>
        <Button variant="ghost" size="icon" onClick={handleSave}>
          <Check />
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="bg-zinc-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">شخصية البوت</h2>
          <p className="text-sm text-gray-300 mb-4">
            اختر شخصية البوت التي تفضلها. سيتكيف البوت مع اختيارك ويقدم إجابات تناسب الشخصية المحددة.
          </p>

          <RadioGroup value={personality} onValueChange={(value) => setPersonality(value as BotPersonality)}>
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <RadioGroupItem value="neutral" id="neutral" />
              <Label htmlFor="neutral" className="mr-2">
                محايد (الوضع الافتراضي)
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional" className="mr-2">
                احترافي
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <RadioGroupItem value="friendly" id="friendly" />
              <Label htmlFor="friendly" className="mr-2">
                ودود
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <RadioGroupItem value="technical" id="technical" />
              <Label htmlFor="technical" className="mr-2">
                تقني (مناسب للمبرمجين)
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <RadioGroupItem value="creative" id="creative" />
              <Label htmlFor="creative" className="mr-2">
                إبداعي
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="sarcastic" id="sarcastic" />
              <Label htmlFor="sarcastic" className="mr-2">
                ساخر
              </Label>
            </div>
          </RadioGroup>
        </Card>

        <Card className="bg-zinc-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">طريقة طرح السؤال للبوت</h2>
          <div className="space-y-4 text-sm text-gray-300">
            <p>للحصول على أفضل النتائج من البوت، اتبع هذه النصائح عند طرح الأسئلة:</p>

            <div>
              <h3 className="font-semibold text-white mb-1">كن محدداً وواضحاً</h3>
              <p>كلما كان سؤالك محدداً، كانت إجابة البوت أكثر دقة ومفيدة.</p>
              <p className="mt-1 text-green-400">مثال جيد: "اكتب خطة تسويقية لمتجر ملابس عبر الإنترنت يستهدف الشباب"</p>
              <p className="mt-1 text-red-400">مثال سيء: "اكتب خطة"</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-1">حدد السياق والغرض</h3>
              <p>أخبر البوت عن السياق والغرض من طلبك للحصول على نتائج أفضل.</p>
              <p className="mt-1 text-green-400">
                مثال جيد: "أنا مبرمج مبتدئ، اشرح لي مفهوم الواجهات في البرمجة بطريقة مبسطة"
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-1">استخدم المتابعة</h3>
              <p>يمكنك متابعة الحوار مع البوت لتحسين النتائج أو طلب تعديلات.</p>
              <p className="mt-1 text-green-400">مثال: "هل يمكنك تبسيط الشرح أكثر؟" أو "أضف أمثلة عملية للتوضيح"</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
