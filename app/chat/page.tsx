"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import {
  Send,
  ArrowLeft,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Code,
  Globe,
  BrainCircuit,
  ExternalLink,
  Settings,
  Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AIProcessor } from "@/lib/ai-processor"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EnhancedCodeViewer } from "@/components/enhanced-code-viewer"
import { GeminiApiKeyDialog } from "@/components/gemini-api-key-dialog"
import { WebSearchResults } from "@/components/web-search-results"
import { DeepThinkingVisualizer } from "@/components/deep-thinking-visualizer"
import { MindMapViewer } from "@/components/mind-map-viewer"
import type { WebSearchResult } from "@/lib/ai-processor"
import { getGeminiConfigState } from "@/lib/gemini-config"
import { FormattedResponse } from "@/components/formatted-response"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "code" | "thinking" | "research" | "mindmap">("chat")
  const [showCodeViewer, setShowCodeViewer] = useState(false)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("javascript")
  const [isThinking, setIsThinking] = useState(false)
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([])
  const [researchResults, setResearchResults] = useState<WebSearchResult[]>([])
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")
  const [hasMindMap, setHasMindMap] = useState(false)
  const [mindMapId, setMindMapId] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // نوع للرسائل
  type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    hasCode?: boolean
    code?: string
    codeLanguage?: string
  }

  // معالج الذكاء الاصطناعي
  const aiProcessor = new AIProcessor()

  useEffect(() => {
    // التحقق من حالة تكوين Gemini
    const { isConfigured } = getGeminiConfigState()
    if (!isConfigured) {
      setShowApiKeyDialog(true)
    }

    // إذا كان هناك استعلام أولي، قم بمعالجته
    if (initialQuery) {
      handleInitialQuery(initialQuery)
    }

    // التحقق من وجود خريطة ذهنية
    if (typeof window !== "undefined") {
      const mindMapData = localStorage.getItem("mindMapData")
      if (mindMapData) {
        setHasMindMap(true)
        setMindMapId(`mind-map-${Date.now()}`)
      }
    }
  }, [initialQuery])

  useEffect(() => {
    // التمرير إلى أسفل عند إضافة رسائل جديدة
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking, thinkingSteps])

  const handleInitialQuery = async (query: string) => {
    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    }

    setMessages([userMessage])
    setIsProcessing(true)
    setCurrentQuery(query)

    // بدء التفكير العميق
    setIsThinking(true)
    const thinkingPromise = aiProcessor.performDeepThinking(query).then((steps) => {
      setThinkingSteps(steps)
    })

    // بدء البحث على الويب
    const searchPromise = aiProcessor.performWebSearch(query).then((results) => {
      setResearchResults(results)
    })

    try {
      // التحقق مما إذا كان الاستعلام يتعلق بالبرمجة
      const isProgrammingQuery =
        query.includes("كود") ||
        query.includes("برمج") ||
        query.includes("React") ||
        query.includes("JavaScript") ||
        query.includes("تطبيق")

      let code = ""
      let language = "javascript"

      // إذا كان الاستعلام يتعلق بالبرمجة، قم بتوليد الكود
      if (isProgrammingQuery) {
        const codeResult = await aiProcessor.generateCodeForQuery(query)
        code = codeResult.code
        language = codeResult.language
        setCurrentCode(code)
        setCurrentLanguage(language)
        setShowCodeViewer(true)
      }

      // معالجة الاستعلام باستخدام محرك الذكاء الاصطناعي
      const response = await aiProcessor.processQuery(query)

      // إضافة رد المساعد
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        hasCode: isProgrammingQuery,
        code: isProgrammingQuery ? code : undefined,
        codeLanguage: isProgrammingQuery ? language : undefined,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // إذا كان الاستعلام يتعلق بالبرمجة، افتح علامة تبويب الكود
      if (isProgrammingQuery) {
        setActiveTab("code")
      }

      // التحقق من وجود خريطة ذهنية
      if (typeof window !== "undefined") {
        const mindMapData = localStorage.getItem("mindMapData")
        if (mindMapData) {
          setHasMindMap(true)
          setMindMapId(`mind-map-${Date.now()}`)
        }
      }

      // انتظار اكتمال التفكير العميق والبحث
      await Promise.all([thinkingPromise, searchPromise])
    } catch (error) {
      console.error("Error processing query:", error)
    } finally {
      setIsProcessing(false)
      setIsThinking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isProcessing) return

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsProcessing(true)
    setCurrentQuery(inputValue)

    // بدء التفكير العميق
    setIsThinking(true)
    const thinkingPromise = aiProcessor.performDeepThinking(inputValue).then((steps) => {
      setThinkingSteps(steps)
    })

    // بدء البحث على الويب
    const searchPromise = aiProcessor.performWebSearch(inputValue).then((results) => {
      setResearchResults(results)
    })

    try {
      // التحقق مما إذا كان الاستعلام يتعلق بالبرمجة
      const isProgrammingQuery =
        inputValue.includes("كود") ||
        inputValue.includes("برمج") ||
        inputValue.includes("React") ||
        inputValue.includes("JavaScript") ||
        inputValue.includes("تطبيق")

      let code = ""
      let language = "javascript"

      // إذا كان الاستعلام يتعلق بالبرمجة، قم بتوليد الكود
      if (isProgrammingQuery) {
        const codeResult = await aiProcessor.generateCodeForQuery(inputValue)
        code = codeResult.code
        language = codeResult.language
        setCurrentCode(code)
        setCurrentLanguage(language)
        setShowCodeViewer(true)
      }

      // معالجة الاستعلام باستخدام محرك الذكاء الاصطناعي
      const response = await aiProcessor.processQuery(inputValue)

      // إضافة رد المساعد
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        hasCode: isProgrammingQuery,
        code: isProgrammingQuery ? code : undefined,
        codeLanguage: isProgrammingQuery ? language : undefined,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // إذا كان الاستعلام يتعلق بالبرمجة، افتح علامة تبويب الكود
      if (isProgrammingQuery) {
        setActiveTab("code")
      }

      // التحقق من وجود خريطة ذهنية
      if (typeof window !== "undefined") {
        const mindMapData = localStorage.getItem("mindMapData")
        if (mindMapData) {
          setHasMindMap(true)
          setMindMapId(`mind-map-${Date.now()}`)
        }
      }

      // انتظار اكتمال التفكير العميق والبحث
      await Promise.all([thinkingPromise, searchPromise])
    } catch (error) {
      console.error("Error processing query:", error)
    } finally {
      setIsProcessing(false)
      setIsThinking(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
  }

  const openInVisualStudio = (code: string, language: string) => {
    const vsService = new VisualStudioService()
    vsService.openInVisualStudio(code, language)
  }

  const handleWebSearch = (query: string) => {
    setCurrentQuery(query)
    setResearchResults([])
    aiProcessor.performWebSearch(query).then((results) => {
      setResearchResults(results)
    })
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-zinc-800">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">WOLF</h1>
        <Button variant="ghost" size="icon" onClick={() => setShowApiKeyDialog(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="w-full bg-zinc-900 p-1">
          <TabsTrigger value="chat" className="flex-1">
            المحادثة
          </TabsTrigger>
          <TabsTrigger value="code" className="flex-1">
            <Code className="h-4 w-4 ml-1" />
            الكود
          </TabsTrigger>
          <TabsTrigger value="thinking" className="flex-1">
            <BrainCircuit className="h-4 w-4 ml-1" />
            التفكير العميق
          </TabsTrigger>
          <TabsTrigger value="research" className="flex-1">
            <Globe className="h-4 w-4 ml-1" />
            البحث
          </TabsTrigger>
          {hasMindMap && (
            <TabsTrigger value="mindmap" className="flex-1">
              <Map className="h-4 w-4 ml-1" />
              الخريطة الذهنية
            </TabsTrigger>
          )}
        </TabsList>

        {/* Chat Messages */}
        <TabsContent value="chat" className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Image src="/images/wolf-logo.png" alt="WOLF" width={60} height={60} className="mb-4 opacity-50" />
              <p>ابدأ محادثة جديدة مع WOLF</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] ${
                      message.role === "user" ? "bg-blue-600" : "bg-zinc-800"
                    } rounded-lg p-3 shadow-lg`}
                  >
                    {message.role === "assistant" ? (
                      <FormattedResponse content={message.content} />
                    ) : (
                      <div className="text-sm">{message.content}</div>
                    )}

                    {message.hasCode && (
                      <div className="mt-3 bg-zinc-900 p-2 rounded text-xs font-mono overflow-x-auto">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400">{message.codeLanguage}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setCurrentCode(message.code || "")
                                setCurrentLanguage(message.codeLanguage || "javascript")
                                setShowCodeViewer(true)
                                setActiveTab("code")
                              }}
                            >
                              <Code className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                openInVisualStudio(message.code || "", message.codeLanguage || "javascript")
                              }
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <pre className="text-green-400">
                          {message.code?.split("\n").slice(0, 3).join("\n")}
                          {message.code && message.code.split("\n").length > 3 && "\n..."}
                        </pre>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-1 text-left">{formatTime(message.timestamp)}</div>

                    {message.role === "assistant" && (
                      <div className="flex justify-end mt-2 gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">
                        <RotateCcw className="h-4 w-4" />
                      </div>
                      <span className="text-sm">WOLF يفكر...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </TabsContent>

        {/* Code Viewer */}
        <TabsContent value="code" className="flex-1 overflow-y-auto p-4">
          <div className="bg-zinc-900 rounded-lg p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">عارض الكود</h2>
            </div>
            <EnhancedCodeViewer
              code={currentCode}
              language={currentLanguage}
              onOpenInVisualStudio={openInVisualStudio}
            />
          </div>
        </TabsContent>

        {/* Deep Thinking */}
        <TabsContent value="thinking" className="flex-1 overflow-y-auto p-4">
          <DeepThinkingVisualizer steps={thinkingSteps} isThinking={isThinking} query={currentQuery} />
        </TabsContent>

        {/* Web Research */}
        <TabsContent value="research" className="flex-1 overflow-y-auto p-4">
          <div className="bg-zinc-900 rounded-lg p-4">
            <WebSearchResults
              results={researchResults}
              isSearching={isProcessing}
              onSearch={handleWebSearch}
              currentQuery={currentQuery}
            />
          </div>
        </TabsContent>

        {/* Mind Map */}
        {hasMindMap && (
          <TabsContent value="mindmap" className="flex-1 overflow-y-auto p-4">
            <MindMapViewer mindMapId={mindMapId} />
          </TabsContent>
        )}
      </Tabs>

      {/* Input Field */}
      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            className="bg-zinc-800 border-none rounded-full pr-4 pl-12 py-6 text-white"
            placeholder="اكتب رسالتك هنا..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
            disabled={isProcessing}
          >
            <Send className={`h-5 w-5 ${isProcessing ? "text-gray-600" : "text-gray-400"}`} />
          </Button>
        </form>
      </div>

      {/* Gemini API Key Dialog */}
      {showApiKeyDialog && <GeminiApiKeyDialog onClose={() => setShowApiKeyDialog(false)} />}
    </div>
  )
}

// استيراد خدمة Visual Studio
import { VisualStudioService } from "@/lib/visual-studio-service"
