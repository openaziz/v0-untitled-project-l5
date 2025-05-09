"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send, Mic, Settings, Sparkles, Code, Globe, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AICapabilities } from "@/components/ai-capabilities"
import { BotPersonalitySelector } from "@/components/bot-personality-selector"
import { IntegrationTools } from "@/components/integration-tools"

export default function HomePage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [showCapabilities, setShowCapabilities] = useState(false)
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false)
  const [showIntegrationTools, setShowIntegrationTools] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // هنا سيتم معالجة الاستعلام وإرسال الطلب إلى البوت
    router.push(`/chat?query=${encodeURIComponent(inputValue)}`)
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Image src="/images/wolf-logo.png" alt="WOLF" width={40} height={40} />
          <h1 className="text-xl font-bold">WOLF</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCapabilities(!showCapabilities)}
            className="relative"
            title="قدرات البوت"
          >
            <Sparkles className="h-5 w-5" />
            {showCapabilities && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowIntegrationTools(!showIntegrationTools)}
            title="أدوات التكامل"
          >
            <Code className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
            title="تخصيص البوت"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 relative">
        {/* قدرات البوت */}
        {showCapabilities && <AICapabilities onClose={() => setShowCapabilities(false)} />}

        {/* أدوات التكامل */}
        {showIntegrationTools && <IntegrationTools onClose={() => setShowIntegrationTools(false)} />}

        {/* اختيار شخصية البوت */}
        {showPersonalitySelector && <BotPersonalitySelector onClose={() => setShowPersonalitySelector(false)} />}

        {/* محتوى الصفحة الرئيسية */}
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">مرحباً بك في WOLF</h1>
            <p className="text-gray-400 max-w-md">
              مساعدك الذكي لمختلف المهام. يمكنك طلب المساعدة في البرمجة، تحليل البيانات، كتابة المحتوى، وأكثر من ذلك
              بكثير.
            </p>
          </div>

          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-3">جرب هذه الأمثلة:</h2>
            <div className="space-y-2 mb-6">
              <ExamplePrompt text="اكتب لي كود لتطبيق قائمة مهام بلغة React" />
              <ExamplePrompt text="حلل هذه البيانات وأنشئ رسماً بيانياً يوضح الاتجاهات" />
              <ExamplePrompt text="اكتب مقالاً عن تأثير الذكاء الاصطناعي على مستقبل العمل" />
              <ExamplePrompt text="صمم لي واجهة مستخدم لتطبيق تتبع اللياقة البدنية" />
            </div>
          </div>

          {/* أزرار الميزات المتقدمة */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <FeatureButton icon={<Brain className="h-4 w-4 mr-2" />} text="التفكير العميق" />
            <FeatureButton icon={<Globe className="h-4 w-4 mr-2" />} text="البحث على الويب" />
            <FeatureButton icon={<Code className="h-4 w-4 mr-2" />} text="Visual Studio" />
          </div>
        </div>
      </main>

      {/* Input Field */}
      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            className="bg-zinc-800 border-none rounded-full pr-12 pl-12 py-6 text-white"
            placeholder="اسأل WOLF عن أي شيء..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Mic className="text-gray-400" />
          </Button>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          >
            <Send className="text-gray-400" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// مكون لعرض أمثلة الاستعلامات
function ExamplePrompt({ text }: { text: string }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/chat?query=${encodeURIComponent(text)}`)
  }

  return (
    <div
      className="bg-zinc-800 p-3 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
      onClick={handleClick}
    >
      <p className="text-sm">{text}</p>
    </div>
  )
}

// مكون لأزرار الميزات المتقدمة
function FeatureButton({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Button variant="outline" className="bg-zinc-800 hover:bg-zinc-700 border-zinc-600">
      {icon}
      {text}
    </Button>
  )
}
