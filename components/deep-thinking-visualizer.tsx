"use client"

import { useState, useEffect } from "react"
import { BrainCircuit, RotateCcw, Lightbulb, ArrowRight, Check, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DeepThinkingVisualizerProps {
  steps: string[]
  isThinking: boolean
  query: string
}

export function DeepThinkingVisualizer({ steps, isThinking, query }: DeepThinkingVisualizerProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showInsights, setShowInsights] = useState(false)

  // محاكاة تقدم التفكير
  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 50)

      return () => clearInterval(interval)
    } else {
      setProgress(100)
    }
  }, [isThinking])

  // تحديث الخطوة النشطة بناءً على الخطوات المكتملة
  useEffect(() => {
    setActiveStep(Math.min(steps.length, steps.length))
  }, [steps])

  // توليد رؤى عشوائية للمحاكاة
  const insights = [
    "تحليل النمط: تم اكتشاف أنماط متكررة في البيانات المقدمة",
    "تحليل السياق: تم تحديد السياق الرئيسي للاستعلام",
    "تحليل المفاهيم: تم استخراج المفاهيم الأساسية وعلاقاتها",
    "تحليل الاحتمالات: تم تقييم الاحتمالات المختلفة للإجابة",
    "تحليل الثقة: مستوى الثقة في الإجابة النهائية مرتفع",
  ]

  return (
    <div className="space-y-6">
      {/* رأس التفكير العميق */}
      <div className="bg-zinc-800 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-purple-600 p-2 rounded-full">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">التفكير العميق</h2>
            <p className="text-sm text-gray-400">تحليل متعمق للسؤال: "{query}"</p>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>تقدم التفكير</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* حالة التفكير */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>
              الوقت المستغرق: {Math.floor(progress / 10)} ثوان{" "}
              {isThinking && <span className="text-yellow-400">(جاري التفكير...)</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>مستوى التعقيد: {query.length > 50 ? "مرتفع" : query.length > 20 ? "متوسط" : "منخفض"}</span>
          </div>
        </div>
      </div>

      {/* خطوات التفكير */}
      <div className="space-y-4">
        {steps.length === 0 && isThinking ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <div className="animate-spin mr-2">
              <RotateCcw className="h-5 w-5" />
            </div>
            <span>جاري بدء التفكير العميق...</span>
          </div>
        ) : (
          <>
            <div className="relative">
              {/* خط الزمن */}
              <div className="absolute top-0 bottom-0 right-[19px] w-1 bg-zinc-700"></div>

              {/* خطوات التفكير */}
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 mb-6 relative">
                  <div
                    className={`rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 z-10 ${
                      index < activeStep
                        ? "bg-green-600 text-white"
                        : index === activeStep
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-700 text-gray-400"
                    }`}
                  >
                    {index < activeStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="bg-zinc-800 p-4 rounded-lg flex-1 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-purple-400">
                        الخطوة {index + 1}: {getStepTitle(step)}
                      </h3>
                      <Badge status={index < activeStep ? "completed" : index === activeStep ? "active" : "pending"} />
                    </div>
                    <p className="text-sm">{step}</p>

                    {/* أمثلة توضيحية للخطوات (محاكاة) */}
                    {index < activeStep && index % 2 === 0 && (
                      <div className="mt-3 bg-zinc-900 p-3 rounded-lg text-xs">
                        <div className="flex items-center gap-2 mb-2 text-yellow-400">
                          <Lightbulb className="h-4 w-4" />
                          <span className="font-semibold">مثال توضيحي:</span>
                        </div>
                        <p>{getExampleForStep(index)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* خطوة قيد التقدم (إذا كان التفكير جارياً) */}
              {isThinking && steps.length > 0 && (
                <div className="flex items-start gap-3 mb-6 relative">
                  <div className="rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 bg-blue-600 text-white z-10 animate-pulse">
                    <span className="font-semibold">{steps.length + 1}</span>
                  </div>
                  <div className="bg-zinc-800 p-4 rounded-lg flex-1">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">
                        <RotateCcw className="h-4 w-4" />
                      </div>
                      <span>جاري التفكير في الخطوة التالية...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* الرؤى والاستنتاجات */}
            {!isThinking && steps.length > 0 && (
              <Card className="bg-zinc-800 border-zinc-700 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    <span>الرؤى والاستنتاجات</span>
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowInsights(!showInsights)} className="text-xs">
                    {showInsights ? "إخفاء" : "عرض"}
                  </Button>
                </div>

                {showInsights && (
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5" />
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// مكون شارة الحالة
function Badge({ status }: { status: "completed" | "active" | "pending" }) {
  return (
    <div
      className={`px-2 py-1 rounded-full text-xs ${
        status === "completed"
          ? "bg-green-900/30 text-green-400"
          : status === "active"
            ? "bg-purple-900/30 text-purple-400 animate-pulse"
            : "bg-zinc-700/30 text-gray-400"
      }`}
    >
      {status === "completed" ? "مكتملة" : status === "active" ? "قيد التنفيذ" : "في الانتظار"}
    </div>
  )
}

// استخراج عنوان الخطوة من النص
function getStepTitle(step: string): string {
  // استخراج أول 3-5 كلمات كعنوان
  const words = step.split(" ")
  return words.slice(0, Math.min(4, words.length)).join(" ") + "..."
}

// توليد أمثلة توضيحية للخطوات (محاكاة)
function getExampleForStep(stepIndex: number): string {
  const examples = [
    "عند تحليل السؤال 'ما هي أفضل لغة برمجة للمبتدئين؟'، نحتاج إلى فهم معايير 'الأفضل' ومستوى 'المبتدئين'.",
    "البحث في قاعدة المعرفة يظهر أن Python وJavaScript وScratch هي من أكثر اللغات الموصى بها للمبتدئين.",
    "المقارنة بين اللغات تظهر أن Python تتميز بسهولة القراءة، بينما JavaScript تتيح تطوير الويب، وScratch مناسبة للأطفال.",
    "بناءً على المعايير المحددة، يمكن ترتيب اللغات حسب سهولة التعلم: Scratch > Python > JavaScript.",
    "الاستنتاج النهائي: Python هي الأفضل للمبتدئين البالغين، بينما Scratch للأطفال، وJavaScript لمن يهتم بتطوير الويب.",
  ]

  return examples[stepIndex % examples.length]
}
