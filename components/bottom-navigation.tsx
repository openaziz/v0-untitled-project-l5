"use client"

import { Home, MessageSquare, Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomNavigationProps {
  activeTab: string
  onChange: (value: string) => void
}

export default function BottomNavigation({ activeTab, onChange }: BottomNavigationProps) {
  return (
    <div className="flex justify-around items-center p-2 border-t border-zinc-800 bg-black">
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center ${activeTab === "home" ? "text-white" : "text-gray-500"}`}
        onClick={() => onChange("home")}
      >
        <Home size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center ${activeTab === "chat" ? "text-white" : "text-gray-500"}`}
        onClick={() => onChange("chat")}
      >
        <MessageSquare size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center ${activeTab === "notifications" ? "text-white" : "text-gray-500"}`}
        onClick={() => onChange("notifications")}
      >
        <Bell size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center ${activeTab === "search" ? "text-white" : "text-gray-500"}`}
        onClick={() => onChange("search")}
      >
        <Search size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center ${activeTab === "profile" ? "text-white" : "text-gray-500"}`}
        onClick={() => onChange("profile")}
      >
        <User size={20} />
      </Button>
    </div>
  )
}
