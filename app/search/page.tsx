"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AIEngine } from "@/lib/ai-engine"

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const aiEngine = new AIEngine()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // استخدام محرك الذكاء الاصطناعي في الخلفية للبحث
    await aiEngine.search(searchQuery)
    // يمكن هنا إضافة منطق للانتقال إلى صفحة نتائج البحث
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Search Form - Fixed at top */}
      <form onSubmit={handleSearch} className="sticky top-0 p-4 flex items-center gap-2 bg-black z-10">
        <Button type="button" variant="ghost" onClick={() => router.push("/")}>
          إلغاء
        </Button>
        <div className="relative flex-1">
          <Input
            className="bg-zinc-800 border-none rounded-lg pr-10 py-2"
            placeholder="بحث"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </form>

      {/* Empty Search Results - With proper spacing */}
      <div className="flex-1 flex items-center justify-center text-gray-500 mt-10">
        <p>ابدأ البحث للحصول على نتائج</p>
      </div>
    </div>
  )
}
