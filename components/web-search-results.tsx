"use client"

import type React from "react"

import { useState } from "react"
import { Search, ExternalLink, RotateCcw, ThumbsUp, ThumbsDown, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WebSearchResult } from "@/lib/ai-processor"

interface WebSearchResultsProps {
  results: WebSearchResult[]
  isSearching: boolean
  onSearch: (query: string) => void
  currentQuery: string
}

export function WebSearchResults({ results, isSearching, onSearch, currentQuery }: WebSearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState(currentQuery)
  const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "relevant">("all")
  const [activeView, setActiveView] = useState<"list" | "grid">("list")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  // تصفية النتائج حسب الفلتر النشط
  const filteredResults = [...results].sort((a, b) => {
    if (activeFilter === "recent") {
      // محاكاة الترتيب حسب الحداثة (في التطبيق الحقيقي، ستكون هناك تواريخ فعلية)
      return Math.random() - 0.5
    } else if (activeFilter === "relevant") {
      // محاكاة الترتيب حسب الصلة (في التطبيق الحقيقي، ستكون هناك درجات صلة)
      return b.title.length - a.title.length
    }
    return 0
  })

  return (
    <div className="space-y-4">
      {/* نموذج البحث */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          className="bg-zinc-800 border-zinc-700"
          placeholder="البحث على الويب..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" disabled={isSearching}>
          <Search className="h-4 w-4 mr-1" />
          بحث
        </Button>
      </form>

      {/* أدوات التصفية والعرض */}
      <div className="flex justify-between items-center">
        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)} className="w-auto">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>الأحدث</span>
            </TabsTrigger>
            <TabsTrigger value="relevant" className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>الأكثر صلة</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-auto">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="list">قائمة</TabsTrigger>
            <TabsTrigger value="grid">شبكة</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* عرض النتائج */}
      {isSearching ? (
        <div className="flex items-center justify-center h-32 text-gray-400">
          <div className="animate-spin mr-2">
            <RotateCcw className="h-5 w-5" />
          </div>
          <span>جاري البحث...</span>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>لم يتم العثور على نتائج</p>
          <p className="text-sm mt-2">حاول استخدام كلمات مفتاحية مختلفة</p>
        </div>
      ) : (
        <div className={activeView === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
          {filteredResults.map((result) => (
            <SearchResultCard key={result.id} result={result} view={activeView} />
          ))}
        </div>
      )}

      {/* معلومات البحث */}
      {!isSearching && filteredResults.length > 0 && (
        <div className="text-xs text-gray-400 flex justify-between items-center mt-4 pt-2 border-t border-zinc-700">
          <span>تم العثور على {filteredResults.length} نتيجة</span>
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            تم التحديث: {new Date().toLocaleDateString("ar-SA")}
          </span>
        </div>
      )}
    </div>
  )
}

interface SearchResultCardProps {
  result: WebSearchResult
  view: "list" | "grid"
}

function SearchResultCard({ result, view }: SearchResultCardProps) {
  // توليد تاريخ عشوائي للمحاكاة
  const randomDate = new Date()
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))
  const formattedDate = randomDate.toLocaleDateString("ar-SA")

  // توليد نوع المصدر عشوائياً للمحاكاة
  const sourceTypes = ["مقالة", "موقع إخباري", "مدونة", "منتدى", "موقع رسمي"]
  const randomSourceType = sourceTypes[Math.floor(Math.random() * sourceTypes.length)]

  return (
    <Card
      className={`bg-zinc-800 border-zinc-700 overflow-hidden transition-all hover:border-zinc-500 ${
        view === "grid" ? "h-full" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-blue-400 mb-1">{result.title}</h3>
          <Badge variant="outline" className="text-xs bg-zinc-700">
            {randomSourceType}
          </Badge>
        </div>
        <p className="text-xs text-green-400 mb-2 flex items-center">
          {result.url}
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-gray-400 hover:text-white"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
        <p className="text-sm">{result.snippet}</p>

        <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
          <span>{formattedDate}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>مفيد</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <ThumbsDown className="h-3 w-3 mr-1" />
              <span>غير مفيد</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
