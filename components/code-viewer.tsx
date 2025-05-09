"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, Share2, FileCode, FileText, Code2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CodeViewerProps {
  code: string
  language: string
}

export function CodeViewer({ code, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (format: string) => {
    let fileContent = code
    let fileName = `code.${language}`
    let mimeType = "text/plain"

    // تحويل الكود إلى التنسيق المطلوب
    if (format === "html") {
      fileContent = convertToHTML(code, language)
      fileName = "code.html"
      mimeType = "text/html"
    } else if (format === "markdown") {
      fileContent = convertToMarkdown(code, language)
      fileName = "code.md"
      mimeType = "text/markdown"
    } else if (format === "pdf") {
      // محاكاة تصدير PDF (في التطبيق الحقيقي، يمكن استخدام مكتبة لإنشاء PDF)
      alert("تم بدء تصدير PDF. سيتم تنزيل الملف قريباً.")
      return
    }

    const blob = new Blob([fileContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const convertToHTML = (code: string, language: string): string => {
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Export</title>
  <style>
    body {
      font-family: 'Consolas', 'Courier New', monospace;
      background-color: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
      direction: ltr;
    }
    pre {
      background-color: #2d2d2d;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      font-family: 'Consolas', 'Courier New', monospace;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      direction: rtl;
    }
    .language-badge {
      background-color: #4d4d4d;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #858585;
      direction: rtl;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>تصدير الكود</h1>
    <div class="language-badge">${language.toUpperCase()}</div>
  </div>
  <pre><code>${escapedCode}</code></pre>
  <div class="footer">
    تم التصدير بواسطة WOLF AI - ${new Date().toLocaleDateString("ar-SA")}
  </div>
</body>
</html>`
  }

  const convertToMarkdown = (code: string, language: string): string => {
    return `# تصدير الكود

## اللغة: ${language.toUpperCase()}

\`\`\`${language}
${code}
\`\`\`

---

تم التصدير بواسطة WOLF AI - ${new Date().toLocaleDateString("ar-SA")}
`
  }

  const handleShare = () => {
    // محاكاة مشاركة الكود
    if (navigator.share) {
      navigator
        .share({
          title: `كود ${language.toUpperCase()}`,
          text: code,
        })
        .catch((err) => {
          console.error("خطأ في المشاركة:", err)
        })
    } else {
      alert("المشاركة غير متاحة في هذا المتصفح. تم نسخ الكود إلى الحافظة.")
      navigator.clipboard.writeText(code)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "code" | "preview")} className="w-auto">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code2 className="h-4 w-4" />
              <span>الكود</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>المعاينة</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "تم النسخ" : "نسخ"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                تصدير
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload("raw")}>
                <FileCode className="h-4 w-4 mr-2" />
                <span>ملف نصي (.{language})</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("html")}>
                <FileCode className="h-4 w-4 mr-2" />
                <span>HTML (.html)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("markdown")}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Markdown (.md)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                <FileText className="h-4 w-4 mr-2" />
                <span>PDF (.pdf)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            مشاركة
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-zinc-950 rounded-lg p-4 overflow-auto">
        {activeTab === "code" ? (
          <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">{code}</pre>
        ) : (
          <div className="bg-white text-black p-4 rounded-lg h-full overflow-auto">
            <CodePreview code={code} language={language} />
          </div>
        )}
      </div>
    </div>
  )
}

// مكون معاينة الكود
function CodePreview({ code, language }: { code: string; language: string }) {
  // محاكاة معاينة الكود
  if (language === "html" || language === "jsx" || language === "tsx") {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 mb-4">معاينة الكود (محاكاة)</p>
        <div className="border border-gray-300 rounded-lg p-4 min-h-[200px]">
          {code.includes("<button") ? (
            <button className="bg-blue-500 text-white px-4 py-2 rounded">زر المعاينة</button>
          ) : code.includes("<input") ? (
            <input type="text" className="border border-gray-300 rounded px-3 py-2 w-full" placeholder="حقل إدخال" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p>معاينة العناصر</p>
              <p className="text-sm text-gray-500 mt-2">يتم عرض معاينة تقريبية للكود</p>
            </div>
          )}
        </div>
      </div>
    )
  } else {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">المعاينة غير متاحة للغة {language.toUpperCase()}</p>
        <p className="text-sm mt-2">المعاينة متاحة فقط لكود HTML و JSX و TSX</p>
      </div>
    )
  }
}
