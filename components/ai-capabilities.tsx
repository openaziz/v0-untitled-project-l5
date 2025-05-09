"use client"

import { X, Code, Database, FileText, ImageIcon, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AICapabilitiesProps {
  onClose: () => void
}

export function AICapabilities({ onClose }: AICapabilitiesProps) {
  const capabilities = [
    {
      icon: <Database className="h-6 w-6 text-blue-400" />,
      title: "جمع المعلومات والتحقق من الحقائق",
      description: "البحث عبر مصادر متعددة، تلخيص المعلومات، وتقديمها بتنسيقات منظمة.",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      title: "معالجة البيانات وتحليلها",
      description: "التعامل مع مجموعات بيانات، إجراء تحليلات إحصائية، وإنشاء تصورات بيانية.",
    },
    {
      icon: <FileText className="h-6 w-6 text-green-400" />,
      title: "كتابة المحتوى المتقدم",
      description: "صياغة نصوص مفصلة ومتماسكة حول مواضيع معقدة، مع الالتزام بمتطلبات الأسلوب والجودة.",
    },
    {
      icon: <Code className="h-6 w-6 text-yellow-400" />,
      title: "تطوير البرمجيات والأدوات",
      description: "كتابة التعليمات البرمجية لتطوير تطبيقات وظيفية وأدوات مساعدة.",
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-pink-400" />,
      title: "إنشاء وتعديل الصور",
      description: "توليد صور جديدة أو تعديل صور موجودة بناءً على توجيهاتك.",
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-400" />,
      title: "أتمتة العمليات",
      description: "المساعدة في تبسيط وتلقائية الإجراءات الروتينية وتحسين سير العمل.",
    },
  ]

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 z-10 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">قدرات WOLF</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capabilities.map((capability, index) => (
          <Card key={index} className="bg-zinc-800 border-none p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{capability.icon}</div>
              <div>
                <h3 className="font-semibold mb-1">{capability.title}</h3>
                <p className="text-sm text-gray-300">{capability.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 bg-zinc-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">كيفية الاستفادة القصوى من WOLF</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>• كن محدداً في طلباتك للحصول على نتائج أفضل</li>
          <li>• قدم سياقاً كافياً لمساعدة WOLF على فهم احتياجاتك</li>
          <li>• استخدم المتابعة لتحسين النتائج أو طلب تعديلات</li>
          <li>• يمكنك تخصيص شخصية WOLF لتناسب نوع المهمة</li>
        </ul>
      </div>
    </div>
  )
}
