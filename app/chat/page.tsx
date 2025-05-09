"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import dynamic from "next/dynamic"
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
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AIProcessor } from "@/lib/ai-processor"
import { GeminiApiKeyDialog } from "@/components/gemini-api-key-dialog"
import { WebSearchResults } from "@/components/web-search-results"
import { DeepThinkingVisualizer } from "@/components/deep-thinking-visualizer"
import { MindMapViewer } from "@/components/mind-map-viewer"
import type { WebSearchResult } from "@/lib/ai-processor"
import { getGeminiConfigState } from "@/lib/gemini-config"
import { FormattedResponse } from "@/components/formatted-response"
import { VisualStudioService } from "@/lib/visual-studio-service"
import { throttle } from "@/lib/performance-utils"

// تحميل المكونات الثقيلة بشكل متأخر (lazy loading)
const EnhancedCodeViewer = dynamic(
  () => import("@/components/enhanced-code-viewer").then((mod) => mod.EnhancedCodeViewer),
  {
    loading: () => <div className="bg-zinc-900 p-4 rounded-lg animate-pulse h-40"></div>,
    ssr: false,
  },
)

// نوع للرسائل
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  hasCode?: boolean
  code?: string
  codeLanguage?: string
  hasHtml?: boolean
  htmlContent?: string
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
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
  const [expandedView, setExpandedView] = useState<string | null>(null)
  const [htmlPreviewContent, setHtmlPreviewContent] = useState<string>("")
  const [isScrollPaused, setIsScrollPaused] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const aiProcessorRef = useRef<AIProcessor>(new AIProcessor())

  // تحسين الأداء: استخدام useMemo للحسابات الثقيلة
  const visibleMessages = useMemo(() => {
    // في التطبيق الحقيقي، يمكن تنفيذ افتراضي هنا للرسائل الطويلة
    return messages.slice(-50) // عرض آخر 50 رسالة فقط لتحسين الأداء
  }, [messages])

  // تحسين الأداء: استخدام useCallback للوظائف
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
  }, [])

  const toggleExpandedView = useCallback((view: string) => {
    setExpandedView((prev) => (prev === view ? null : view))
  }, [])

  // تحسين الأداء: استخدام throttle للوظائف المتكررة
  const handleScroll = useCallback(
    throttle(() => {
      if (!messagesContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

      setIsScrollPaused(!isNearBottom)
    }, 100),
    [],
  )

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

    // إضافة مستمع التمرير
    const messagesContainer = messagesContainerRef.current
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScroll)
    }

    // تنظيف المستمعين
    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [initialQuery, handleScroll])

  useEffect(() => {
    // التمرير إلى أسفل عند إضافة رسائل جديدة
    if (!isScrollPaused && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isThinking, thinkingSteps, isScrollPaused])

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
    const thinkingPromise = aiProcessorRef.current.performDeepThinking(query).then((steps) => {
      setThinkingSteps(steps)
    })

    // بدء البحث على الويب
    const searchPromise = aiProcessorRef.current.performWebSearch(query).then((results) => {
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
      let htmlContent = ""
      let hasHtml = false

      // إذا كان الاستعلام يتعلق بالبرمجة، قم بتوليد الكود
      if (isProgrammingQuery) {
        const codeResult = await aiProcessorRef.current.generateCodeForQuery(query)
        code = codeResult.code
        language = codeResult.language
        setCurrentCode(code)
        setCurrentLanguage(language)
        setShowCodeViewer(true)

        // إذا كان الكود HTML أو JSX أو TSX، قم بإنشاء معاينة HTML
        if (language === "html" || language === "jsx" || language === "tsx") {
          hasHtml = true
          htmlContent = code
          setHtmlPreviewContent(code)
        }
      }

      // معالجة الاستعلام باستخدام محرك الذكاء الاصطناعي
      const response = await aiProcessorRef.current.processQuery(query)

      // إضافة رد المساعد
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        hasCode: isProgrammingQuery,
        code: isProgrammingQuery ? code : undefined,
        codeLanguage: isProgrammingQuery ? language : undefined,
        hasHtml: hasHtml,
        htmlContent: htmlContent,
      }

      setMessages((prev) => [...prev, assistantMessage])

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

  // تحسين الأداء: استخدام useCallback للوظائف المهمة
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
      const thinkingPromise = aiProcessorRef.current.performDeepThinking(inputValue).then((steps) => {
        setThinkingSteps(steps)
      })

      // بدء البحث على الويب
      const searchPromise = aiProcessorRef.current.performWebSearch(inputValue).then((results) => {
        setResearchResults(results)
      })

      try {
        // التحقق مما إذا كان الاستعلام يتعلق بالبرمجة
        const isProgrammingQuery =
          inputValue.includes("كود") ||
          inputValue.includes("برمج") ||
          inputValue.includes("React") ||
          inputValue.includes("JavaScript") ||
          inputValue.includes("تطبيق") ||
          inputValue.includes("html") ||
          inputValue.includes("HTML")

        let code = ""
        let language = "javascript"
        let htmlContent = ""
        let hasHtml = false

        // إذا كان الاستعلام يتعلق بالبرمجة، قم بتوليد الكود
        if (isProgrammingQuery) {
          const codeResult = await aiProcessorRef.current.generateCodeForQuery(inputValue)
          code = codeResult.code
          language = codeResult.language
          setCurrentCode(code)
          setCurrentLanguage(language)
          setShowCodeViewer(true)

          // إذا كان الكود HTML أو JSX أو TSX، قم بإنشاء معاينة HTML
          if (language === "html" || language === "jsx" || language === "tsx") {
            hasHtml = true
            htmlContent = code
            setHtmlPreviewContent(code)
          }
        }

        // معالجة الاستعلام باستخدام محرك الذكاء الاصطناعي
        const response = await aiProcessorRef.current.processQuery(inputValue)

        // إضافة رد المساعد
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
          hasCode: isProgrammingQuery,
          code: isProgrammingQuery ? code : undefined,
          codeLanguage: isProgrammingQuery ? language : undefined,
          hasHtml: hasHtml,
          htmlContent: htmlContent,
        }

        setMessages((prev) => [...prev, assistantMessage])

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
    },
    [inputValue, isProcessing],
  )

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
  }

  const openInVisualStudio = useCallback((code: string, language: string) => {
    const vsService = new VisualStudioService()
    vsService.openInVisualStudio(code, language)
  }, [])

  const handleWebSearch = useCallback((query: string) => {
    setCurrentQuery(query)
    setResearchResults([])
    aiProcessorRef.current.performWebSearch(query).then((results) => {
      setResearchResults(results)
    })
  }, [])

  // تحويل كود HTML إلى معاينة
  const renderHtmlPreview = useCallback((htmlContent: string) => {
    // تنظيف الكود وإزالة العلامات الخطرة
    const sanitizedHtml = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/g, "")

    return (
      <div className="bg-white text-black p-4 rounded-lg overflow-auto">
        <div className="text-center p-2 bg-gray-100 mb-4 rounded">معاينة HTML</div>
        <div
          className="html-preview border border-gray-200 p-4 rounded"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    )
  }, [])

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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Image src="/images/wolf-logo.png" alt="WOLF" width={60} height={60} className="mb-4 opacity-50" />
              <p>ابدأ محادثة جديدة مع WOLF</p>
            </div>
          ) : (
            <div className="space-y-6">
              {visibleMessages.map((message) => (
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

                    {/* عرض معاينة HTML إذا كان الكود HTML/JSX/TSX */}
                    {message.hasHtml && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">معاينة HTML</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandedView(`html-preview-${message.id}`)}
                            className="h-6 px-2"
                          >
                            {expandedView === `html-preview-${message.id}` ? (
                              <Minimize2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Maximize2 className="h-3 w-3 mr-1" />
                            )}
                            {expandedView === `html-preview-${message.id}` ? "تصغير" : "تكبير"}
                          </Button>
                        </div>

                        {expandedView === `html-preview-${message.id}` ? (
                          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 p-4 overflow-auto">
                            <div className="bg-zinc-900 rounded-lg p-4 max-w-4xl mx-auto">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">معاينة HTML</h2>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpandedView(`html-preview-${message.id}`)}
                                >
                                  <Minimize2 className="h-4 w-4 mr-1" />
                                  تصغير
                                </Button>
                              </div>
                              {renderHtmlPreview(message.htmlContent || "")}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white text-black p-2 rounded-lg h-40 overflow-hidden">
                            <div
                              className="html-preview h-full overflow-hidden"
                              dangerouslySetInnerHTML={{
                                __html: (message.htmlContent || "").replace(
                                  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                                  "",
                                ),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* عرض التفكير العميق مباشرة في الرسالة */}
                    {message.role === "assistant" && thinkingSteps.length > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium flex items-center">
                            <BrainCircuit className="h-4 w-4 mr-1 text-purple-400" />
                            التفكير العميق
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandedView(`thinking-${message.id}`)}
                            className="h-6 px-2"
                          >
                            {expandedView === `thinking-${message.id}` ? (
                              <Minimize2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Maximize2 className="h-3 w-3 mr-1" />
                            )}
                            {expandedView === `thinking-${message.id}` ? "تصغير" : "تكبير"}
                          </Button>
                        </div>

                        {expandedView === `thinking-${message.id}` ? (
                          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 p-4 overflow-auto">
                            <div className="bg-zinc-900 rounded-lg p-4 max-w-4xl mx-auto">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">التفكير العميق</h2>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpandedView(`thinking-${message.id}`)}
                                >
                                  <Minimize2 className="h-4 w-4 mr-1" />
                                  تصغير
                                </Button>
                              </div>
                              <DeepThinkingVisualizer steps={thinkingSteps} isThinking={false} query={currentQuery} />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-zinc-900 p-2 rounded-lg">
                            <div className="text-xs text-gray-300 max-h-20 overflow-hidden">
                              {thinkingSteps.slice(0, 2).map((step, index) => (
                                <p key={index} className="mb-1">
                                  {index + 1}. {step.length > 100 ? `${step.substring(0, 100)}...` : step}
                                </p>
                              ))}
                              {thinkingSteps.length > 2 && <p className="text-gray-500">...</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* عرض نتائج البحث مباشرة في الرسالة */}
                    {message.role === "assistant" && researchResults.length > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-blue-400" />
                            نتائج البحث
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandedView(`research-${message.id}`)}
                            className="h-6 px-2"
                          >
                            {expandedView === `research-${message.id}` ? (
                              <Minimize2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Maximize2 className="h-3 w-3 mr-1" />
                            )}
                            {expandedView === `research-${message.id}` ? "تصغير" : "تكبير"}
                          </Button>
                        </div>

                        {expandedView === `research-${message.id}` ? (
                          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 p-4 overflow-auto">
                            <div className="bg-zinc-900 rounded-lg p-4 max-w-4xl mx-auto">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">نتائج البحث</h2>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpandedView(`research-${message.id}`)}
                                >
                                  <Minimize2 className="h-4 w-4 mr-1" />
                                  تصغير
                                </Button>
                              </div>
                              <WebSearchResults
                                results={researchResults}
                                isSearching={false}
                                onSearch={handleWebSearch}
                                currentQuery={currentQuery}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-zinc-900 p-2 rounded-lg">
                            <div className="text-xs text-gray-300 max-h-20 overflow-hidden">
                              {researchResults.slice(0, 2).map((result, index) => (
                                <div key={index} className="mb-1">
                                  <p className="font-medium text-blue-400">{result.title}</p>
                                  <p className="text-gray-400 truncate">{result.snippet}</p>
                                </div>
                              ))}
                              {researchResults.length > 2 && <p className="text-gray-500">...</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* عرض الخريطة الذهنية مباشرة في الرسالة */}
                    {message.role === "assistant" && hasMindMap && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium flex items-center">
                            <Map className="h-4 w-4 mr-1 text-green-400" />
                            الخريطة الذهنية
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandedView(`mindmap-${message.id}`)}
                            className="h-6 px-2"
                          >
                            {expandedView === `mindmap-${message.id}` ? (
                              <Minimize2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Maximize2 className="h-3 w-3 mr-1" />
                            )}
                            {expandedView === `mindmap-${message.id}` ? "تصغير" : "تكبير"}
                          </Button>
                        </div>

                        {expandedView === `mindmap-${message.id}` ? (
                          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 p-4 overflow-auto">
                            <div className="bg-zinc-900 rounded-lg p-4 max-w-4xl mx-auto">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">الخريطة الذهنية</h2>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpandedView(`mindmap-${message.id}`)}
                                >
                                  <Minimize2 className="h-4 w-4 mr-1" />
                                  تصغير
                                </Button>
                              </div>
                              <MindMapViewer mindMapId={mindMapId} />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-zinc-900 p-2 rounded-lg">
                            <div className="text-xs text-gray-300 h-20 flex items-center justify-center">
                              <Map className="h-6 w-6 text-green-400 mr-2" />
                              <span>انقر لعرض الخريطة الذهنية الكاملة</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-1 text-left">{formatTime(message.timestamp)}</div>

                    {message.role === "assistant" && (
                      <div className="flex justify-end mt-2 gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyMessage(message.content)}
                        >
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
        </div>

        {/* Code Viewer Modal */}
        {showCodeViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 p-4 overflow-auto">
            <div className="bg-zinc-900 rounded-lg p-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">عارض الكود</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCodeViewer(false)}>
                  <Minimize2 className="h-4 w-4 mr-1" />
                  إغلاق
                </Button>
              </div>
              <EnhancedCodeViewer
                code={currentCode}
                language={currentLanguage}
                onOpenInVisualStudio={openInVisualStudio}
              />
            </div>
          </div>
        )}
      </div>

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
