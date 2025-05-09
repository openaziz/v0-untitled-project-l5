"use client"

import { useState, useEffect, useRef } from "react"
import { Maximize, Minimize, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MindMapExporter } from "@/components/mind-map-exporter"

interface MindMapViewerProps {
  mindMapId: string
}

export function MindMapViewer({ mindMapId }: MindMapViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mindMapData, setMindMapData] = useState<any>(null)

  useEffect(() => {
    // تحميل بيانات الخريطة الذهنية
    if (typeof window !== "undefined") {
      const savedMindMapData = localStorage.getItem("mindMapData")
      if (savedMindMapData) {
        setMindMapData(JSON.parse(savedMindMapData))
      }
    }

    // إعداد مستمع لحدث الخروج من وضع ملء الشاشة
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  // محاكاة رسم الخريطة الذهنية
  const renderMindMap = () => {
    if (!mindMapData) return null

    // في التطبيق الحقيقي، هنا سيتم استخدام مكتبة لرسم الخريطة الذهنية
    // هذه محاكاة بسيطة للخريطة الذهنية
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">{mindMapData.root.text}</div>
          <div className="flex flex-wrap justify-center mt-8 gap-8">
            {mindMapData.root.children.map((child: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-gray-400"></div>
                <div className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-center">{child.text}</div>
                {child.children && child.children.length > 0 && (
                  <div className="flex flex-wrap justify-center mt-4 gap-4">
                    {child.children.map((subChild: any, subIndex: number) => (
                      <div key={subIndex} className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-gray-400"></div>
                        <div className="bg-purple-600 text-white px-2 py-1 rounded-lg text-center text-sm">
                          {subChild.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">الخريطة الذهنية</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <MindMapExporter mindMapId={mindMapId} />
        </div>
      </div>
      <div
        ref={containerRef}
        className="bg-white rounded-lg p-4 flex-1 overflow-auto mind-map-container"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
      >
        {renderMindMap()}
      </div>
    </div>
  )
}
