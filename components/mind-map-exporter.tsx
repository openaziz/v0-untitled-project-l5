"use client"

import { useState } from "react"
import { Download, ImageIcon, FileText, FileCode, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MindMapExporterProps {
  mindMapId: string
}

export function MindMapExporter({ mindMapId }: MindMapExporterProps) {
  const [exportFormat, setExportFormat] = useState<"png" | "svg" | "pdf" | "json">("png")
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const handleExport = (format: "png" | "svg" | "pdf" | "json") => {
    setExportFormat(format)

    // في التطبيق الحقيقي، هنا سيتم تصدير الخريطة الذهنية بالتنسيق المطلوب
    console.log(`تصدير الخريطة الذهنية بتنسيق ${format}`)

    // محاكاة تصدير الخريطة الذهنية
    setTimeout(() => {
      // إنشاء رابط تنزيل وهمي
      const link = document.createElement("a")
      link.href = "#"
      link.download = `mind-map-${Date.now()}.${format}`
      link.click()
    }, 500)
  }

  const handleShare = () => {
    // في التطبيق الحقيقي، هنا سيتم إنشاء رابط مشاركة للخريطة الذهنية
    const shareUrl = `https://wolf-ai.com/share/mind-map/${mindMapId}`
    setShareUrl(shareUrl)
    setShowShareDialog(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleExport("png")}>
            <ImageIcon className="h-4 w-4 ml-2" />
            <span>صورة PNG</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("svg")}>
            <FileCode className="h-4 w-4 ml-2" />
            <span>صورة SVG</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("pdf")}>
            <FileText className="h-4 w-4 ml-2" />
            <span>ملف PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")}>
            <FileCode className="h-4 w-4 ml-2" />
            <span>ملف JSON</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 ml-2" />
            مشاركة
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>مشاركة الخريطة الذهنية</DialogTitle>
            <DialogDescription>يمكن لأي شخص لديه الرابط الوصول إلى الخريطة الذهنية</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="grid flex-1 gap-2">
              <div className="bg-zinc-800 p-2 rounded-md text-sm overflow-hidden overflow-ellipsis">{shareUrl}</div>
            </div>
            <Button type="submit" size="sm" onClick={copyToClipboard}>
              {copied ? "تم النسخ" : "نسخ"}
            </Button>
          </div>
          <div className="mt-4">
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="link">رابط</TabsTrigger>
                <TabsTrigger value="embed">تضمين</TabsTrigger>
                <TabsTrigger value="qr">رمز QR</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
