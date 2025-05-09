"use client"

import React from "react"

interface FormattedResponseProps {
  content: string
}

export function FormattedResponse({ content }: FormattedResponseProps) {
  // تحويل النص إلى فقرات وقوائم منسقة
  const formatContent = (text: string) => {
    // تقسيم النص إلى فقرات
    const paragraphs = text.split("\n\n")

    return paragraphs.map((paragraph, index) => {
      // التحقق مما إذا كان الفقرة عنوان
      if (paragraph.match(/^#+\s/)) {
        const level = paragraph.match(/^(#+)\s/)?.[1].length || 1
        const title = paragraph.replace(/^#+\s/, "")
        const HeadingTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements
        return React.createElement(HeadingTag, { key: index, className: "font-bold mt-3 mb-2" }, title)
      }

      // التحقق مما إذا كان الفقرة قائمة مرقمة
      if (paragraph.match(/^\d+\.\s/)) {
        return (
          <ol key={index} className="list-decimal list-inside my-2 pr-4">
            <li>{paragraph.replace(/^\d+\.\s/, "")}</li>
          </ol>
        )
      }

      // التحقق مما إذا كان الفقرة قائمة نقطية
      if (paragraph.match(/^[•-]\s/)) {
        return (
          <ul key={index} className="list-disc list-inside my-2 pr-4">
            <li>{paragraph.replace(/^[•-]\s/, "")}</li>
          </ul>
        )
      }

      // فقرة عادية
      return (
        <p key={index} className="my-2">
          {paragraph}
        </p>
      )
    })
  }

  return <div className="formatted-response text-sm">{formatContent(content)}</div>
}
