"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Play, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TerminalPage() {
  const router = useRouter()
  const [command, setCommand] = useState("git_init")
  const [output, setOutput] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // محاكاة تنفيذ الأمر عند تحميل الصفحة
    executeCommand()
  }, [])

  const executeCommand = () => {
    setIsLoading(true)

    // محاكاة تنفيذ الأمر
    setTimeout(() => {
      if (command === "git_init") {
        setOutput([
          "mkdir -p / && _موقع_الخير_الذكي_/cd /home/ubuntu $ _موقع_الخير_الذكي_/",
          "git init && _موقع_الخير_الذكي_/cd /home/ubuntu && _موقع_الخير_الذكي_/home/ubuntu/git./_موقع_الخير_الذكي_/Reinitialized existing Git repository in /home/ubuntu",
          "$ _موقع_الخير_الذكي_/~:ubuntu@sandbox",
        ])
      } else {
        setOutput([`تنفيذ الأمر: ${command}`])
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <X />
        </Button>
        <h1 className="text-xl font-semibold">حاسوب Manus</h1>
        <div className="w-8"></div>
      </header>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="bg-zinc-900 p-4 rounded-lg">
          <h2 className="text-center mb-4">{command}</h2>
          <div className="bg-zinc-950 p-3 rounded text-sm font-mono overflow-x-auto">
            {output.map((line, index) => (
              <p key={index} className="text-green-500 mb-1 whitespace-pre-wrap break-all">
                {line}
              </p>
            ))}
            {isLoading && <p className="text-gray-400">جار التنفيذ...</p>}
          </div>
        </Card>

        <div className="mt-8">
          <p className="text-center mb-2">Manus يستخدم الطرفية</p>
          <p className="text-xs text-center text-gray-400">
            جار تنفيذ الأمر: mkdir -p /home/ubuntu && _موقع_الخير_الذكي_/cd /home/ubuntu && _موقع_الخير_الذكي_/
          </p>

          <div className="flex justify-between items-center mt-6">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button className="rounded-full bg-zinc-700 text-white px-6">
              <Play className="h-4 w-4 mr-2" /> الانتقال إلى البث المباشر
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">حالة التنفيذ: {isLoading ? "جار التنفيذ" : "مكتمل"}</div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setCommand("git_init")
              executeCommand()
            }}
          >
            إعادة تنفيذ
          </Button>
        </div>
      </div>
    </div>
  )
}
