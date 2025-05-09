"use client"
import { Check, Info, AlertTriangle, BookOpen } from "lucide-react"

interface FormattedResponseProps {
  content: string
}

export function FormattedResponse({ content }: FormattedResponseProps) {
  // تحويل النص إلى محتوى منسق بشكل جذاب
  const formatContent = () => {
    // تنظيف النص من علامات النجمة المزدوجة
    const cleanedContent = content.replace(/\*\*(.*?)\*\*/g, "$1")

    // تقسيم المحتوى إلى فقرات
    const paragraphs = cleanedContent.split("\n\n").filter((p) => p.trim().length > 0)

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          // التعامل مع العناوين
          if (paragraph.match(/^#+\s/)) {
            const level = (paragraph.match(/^(#+)\s/) || ["", "#"])[1].length
            const title = paragraph.replace(/^#+\s/, "")

            if (level === 1) {
              return (
                <div key={index} className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-3 rounded-lg mb-4">
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
              )
            } else {
              return (
                <h3 key={index} className="text-lg font-semibold text-blue-400 mt-4 mb-2">
                  {title}
                </h3>
              )
            }
          }

          // التعامل مع القوائم المرقمة
          if (paragraph.match(/^\d+\.\s/)) {
            const items = paragraph.split(/\n/).filter((item) => item.match(/^\d+\.\s/))
            return (
              <div key={index} className="bg-zinc-900 rounded-lg p-3">
                <ol className="list-decimal list-inside space-y-2">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-200">
                      {item.replace(/^\d+\.\s/, "")}
                    </li>
                  ))}
                </ol>
              </div>
            )
          }

          // التعامل مع القوائم النقطية
          if (paragraph.match(/^[•-]\s/)) {
            const items = paragraph.split(/\n/).filter((item) => item.match(/^[•-]\s/))
            return (
              <div key={index} className="bg-zinc-900 rounded-lg p-3">
                <ul className="list-disc list-inside space-y-2">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-200">
                      {item.replace(/^[•-]\s/, "")}
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          // التعامل مع النصائح والملاحظات
          if (paragraph.toLowerCase().includes("ملاحظة:") || paragraph.toLowerCase().includes("نصيحة:")) {
            return (
              <div key={index} className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-200">{paragraph}</p>
              </div>
            )
          }

          // التعامل مع التحذيرات
          if (paragraph.toLowerCase().includes("تحذير:") || paragraph.toLowerCase().includes("هام:")) {
            return (
              <div
                key={index}
                className="bg-amber-900/30 border border-amber-800 rounded-lg p-3 flex items-start gap-2"
              >
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-200">{paragraph}</p>
              </div>
            )
          }

          // التعامل مع الخطوات
          if (paragraph.toLowerCase().includes("خطوات:") || paragraph.toLowerCase().includes("الخطوات:")) {
            return (
              <div key={index} className="bg-zinc-900 rounded-lg p-3 flex items-start gap-2">
                <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-200">{paragraph}</p>
              </div>
            )
          }

          // التعامل مع المراجع
          if (paragraph.toLowerCase().includes("مراجع:") || paragraph.toLowerCase().includes("مصادر:")) {
            return (
              <div key={index} className="bg-zinc-900 rounded-lg p-3 flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-200">{paragraph}</p>
              </div>
            )
          }

          // فقرة عادية
          return (
            <p key={index} className="text-gray-200 leading-relaxed">
              {paragraph}
            </p>
          )
        })}
      </div>
    )
  }

  return <div className="formatted-response text-sm">{formatContent()}</div>
}
