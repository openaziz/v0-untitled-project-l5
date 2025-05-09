"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, Share2, FileCode, FileText, Code2, ExternalLink } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EnhancedCodeViewerProps {
  code: string
  language: string
  onOpenInVisualStudio?: (code: string, language: string) => void
}

export function EnhancedCodeViewer({ code, language, onOpenInVisualStudio }: EnhancedCodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")
  const [theme, setTheme] = useState<"dark" | "light" | "github" | "monokai">("dark")
  const [fontSize, setFontSize] = useState("14")
  const [lineNumbers, setLineNumbers] = useState(true)
  const [wordWrap, setWordWrap] = useState(true)
  const [formattedCode, setFormattedCode] = useState(code)
  const [htmlPreview, setHtmlPreview] = useState<string>("")
  const [canPreview, setCanPreview] = useState(false)

  useEffect(() => {
    // محاكاة تنسيق الكود
    setFormattedCode(formatCode(code, language))

    // التحقق مما إذا كان يمكن معاينة الكود
    const previewableLanguages = ["html", "jsx", "tsx"]
    setCanPreview(previewableLanguages.includes(language.toLowerCase()))

    // إعداد معاينة HTML
    if (previewableLanguages.includes(language.toLowerCase())) {
      let processedHtml = code

      // معالجة JSX/TSX إلى HTML (محاكاة بسيطة)
      if (language === "jsx" || language === "tsx") {
        processedHtml = processJsxToHtml(code)
      }

      // تنظيف الكود وإزالة العلامات الخطرة
      const sanitizedHtml = processedHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/on\w+="[^"]*"/g, "")

      setHtmlPreview(sanitizedHtml)
    }
  }, [code, language])

  const formatCode = (code: string, language: string): string => {
    // في التطبيق الحقيقي، هنا سيتم استخدام مكتبة لتنسيق الكود مثل prettier
    // هذه محاكاة بسيطة للتنسيق
    if (language === "javascript" || language === "typescript" || language === "jsx" || language === "tsx") {
      return code
        .replace(/\{/g, "{\n  ")
        .replace(/\}/g, "\n}")
        .replace(/;/g, ";\n")
        .replace(/\n\s*\n/g, "\n")
    }
    return code
  }

  // محاكاة بسيطة لتحويل JSX إلى HTML
  const processJsxToHtml = (jsxCode: string): string => {
    // هذه محاكاة بسيطة جدًا - في التطبيق الحقيقي ستحتاج إلى محلل JSX حقيقي
    return jsxCode
      .replace(/className=/g, "class=")
      .replace(/\{\/\*.*?\*\/\}/g, "") // إزالة التعليقات
      .replace(/\{(.*?)\}/g, "") // إزالة التعبيرات البرمجية
      .replace(/<>/g, "<div>") // استبدال الشظايا
      .replace(/<\/>/g, "</div>") // استبدال الشظايا
  }

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
      font-family: 'Tajawal', 'Consolas', 'Courier New', monospace;
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

  const getLineNumbersContent = () => {
    if (!lineNumbers) return null

    const lines = formattedCode.split("\n")
    return (
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-zinc-950 text-gray-500 text-xs text-right pl-2 pr-2 select-none border-r border-zinc-800">
        {lines.map((_, i) => (
          <div key={i} className="leading-relaxed">
            {i + 1}
          </div>
        ))}
      </div>
    )
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
            <TabsTrigger value="preview" className="flex items-center gap-1" disabled={!canPreview}>
              <FileText className="h-4 w-4" />
              <span>المعاينة</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="السمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">داكن</SelectItem>
              <SelectItem value="light">فاتح</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="monokai">Monokai</SelectItem>
            </SelectContent>
          </Select>

          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue placeholder="الخط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setLineNumbers(!lineNumbers)}>
            {lineNumbers ? "إخفاء الأرقام" : "إظهار الأرقام"}
          </Button>

          <Button variant="outline" size="sm" onClick={() => setWordWrap(!wordWrap)}>
            {wordWrap ? "إلغاء اللف" : "لف النص"}
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 ml-1" /> : <Copy className="h-4 w-4 ml-1" />}
            {copied ? "تم النسخ" : "نسخ"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 ml-1" />
                تصدير
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload("raw")}>
                <FileCode className="h-4 w-4 ml-2" />
                <span>ملف نصي (.{language})</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("html")}>
                <FileCode className="h-4 w-4 ml-2" />
                <span>HTML (.html)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("markdown")}>
                <FileText className="h-4 w-4 ml-2" />
                <span>Markdown (.md)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                <FileText className="h-4 w-4 ml-2" />
                <span>PDF (.pdf)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 ml-1" />
            مشاركة
          </Button>

          {onOpenInVisualStudio && (
            <Button variant="outline" size="sm" onClick={() => onOpenInVisualStudio(code, language)}>
              <ExternalLink className="h-4 w-4 ml-1" />
              Visual Studio
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} className="flex-1">
        <TabsContent value="code" className="h-full">
          <div
            className={`relative flex-1 bg-zinc-950 rounded-lg p-4 overflow-auto h-full ${
              theme === "light"
                ? "bg-white text-black"
                : theme === "github"
                  ? "bg-[#f6f8fa] text-[#24292e]"
                  : theme === "monokai"
                    ? "bg-[#272822] text-[#f8f8f2]"
                    : "bg-zinc-950 text-green-400"
            }`}
          >
            {getLineNumbersContent()}
            <pre
              className={`text-sm font-mono ${lineNumbers ? "pl-12" : ""} ${wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {formattedCode}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="h-full">
          <div className="bg-white text-black p-4 rounded-lg h-full overflow-auto">
            {canPreview ? (
              <div>
                <div className="text-center p-2 bg-gray-100 mb-4 rounded">معاينة HTML</div>
                <div
                  className="html-preview border border-gray-200 p-4 rounded"
                  dangerouslySetInnerHTML={{ __html: htmlPreview }}
                />
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-500">المعاينة غير متاحة للغة {language.toUpperCase()}</p>
                <p className="text-sm mt-2">المعاينة متاحة فقط لكود HTML و JSX و TSX</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
