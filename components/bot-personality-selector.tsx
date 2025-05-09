"use client"

import { useState } from "react"
import { X, Check, User, Code, Lightbulb, Briefcase, Wand2, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface BotPersonalitySelectorProps {
  onClose: () => void
}

type Personality = "neutral" | "technical" | "creative" | "professional" | "friendly" | "sarcastic"

export function BotPersonalitySelector({ onClose }: BotPersonalitySelectorProps) {
  const [personality, setPersonality] = useState<Personality>("neutral")

  const personalities = [
    {
      id: "neutral",
      icon: <User className="h-5 w-5" />,
      name: "محايد",
      description: "أسلوب متوازن ومباشر (الوضع الافتراضي)",
    },
    {
      id: "technical",
      icon: <Code className="h-5 w-5" />,
      name: "تقني",
      description: "أسلوب دقيق مع تفاصيل تقنية (مناسب للمبرمجين)",
    },
    {
      id: "creative",
      icon: <Lightbulb className="h-5 w-5" />,
      name: "إبداعي",
      description: "أسلوب مبتكر وخيالي مع أفكار غير تقليدية",
    },
    {
      id: "professional",
      icon: <Briefcase className="h-5 w-5" />,
      name: "احترافي",
      description: "أسلوب رسمي ومنظم مناسب للأعمال",
    },
    {
      id: "friendly",
      icon: <Wand2 className="h-5 w-5" />,
      name: "ودود",
      description: "أسلوب دافئ وشخصي ومشجع",
    },
    {
      id: "sarcastic",
      icon: <Smile className="h-5 w-5" />,
      name: "ساخر",
      description: "أسلوب مرح مع لمسة من الفكاهة والسخرية",
    },
  ]

  const handleSave = () => {
    // حفظ الشخصية المختارة
    localStorage.setItem("botPersonality", personality)
    onClose()
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 z-10 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">تخصيص شخصية WOLF</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" /> حفظ
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card className="bg-zinc-800 border-none p-4 mb-6">
        <p className="text-sm text-gray-300 mb-4">
          اختر شخصية WOLF التي تفضلها. سيتكيف البوت مع اختيارك ويقدم إجابات تناسب الشخصية المحددة.
        </p>

        <RadioGroup value={personality} onValueChange={(value) => setPersonality(value as Personality)}>
          <div className="space-y-4">
            {personalities.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value={item.id} id={item.id} />
                <div className="flex items-center mr-2">
                  <div className="bg-zinc-700 p-2 rounded-full mr-2">{item.icon}</div>
                  <div>
                    <Label htmlFor={item.id} className="font-medium">
                      {item.name}
                    </Label>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </Card>

      <Card className="bg-zinc-800 border-none p-4">
        <h3 className="font-semibold mb-3">أمثلة على استجابات الشخصيات المختلفة</h3>

        <div className="space-y-3 text-sm">
          <div className="bg-zinc-700 p-3 rounded-lg">
            <p className="font-semibold mb-1">سؤال: "كيف يمكنني تعلم البرمجة؟"</p>
            <div className="space-y-2 text-xs">
              <p>
                <span className="text-blue-400">محايد:</span> "يمكنك تعلم البرمجة من خلال الدورات عبر الإنترنت والكتب
                والممارسة المستمرة."
              </p>
              <p>
                <span className="text-green-400">تقني:</span> "لتعلم البرمجة، ابدأ بلغة Python لسهولة بنائها، ثم تعلم
                مفاهيم OOP والخوارزميات وهياكل البيانات..."
              </p>
              <p>
                <span className="text-purple-400">ساخر:</span> "أوه، تعلم البرمجة؟ نعم، لأن ما يحتاجه العالم هو مبرمج
                آخر يبحث عن الفاصلة المفقودة لساعات!"
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
