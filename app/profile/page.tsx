"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { X, ChevronLeft, Share2, BookOpen, Globe, User, Moon, Trash2, Heart, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <X />
        </Button>
        <div className="flex-1"></div>
      </header>

      {/* Profile Info */}
      <div className="flex flex-col items-end p-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <h2 className="text-xl font-semibold">عزيز</h2>
            <p className="text-sm text-gray-400">sa6aa6116@gmail.com</p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src="/images/user-avatar.png" alt="عزيز" />
            <AvatarFallback>ع</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Subscription */}
      <div className="p-4">
        <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-lg">
          <span className="text-xl">Free</span>
          <div className="flex items-center gap-2">
            <span>0</span>
            <Star className="h-5 w-5" />
            <ChevronLeft className="h-5 w-5" />
          </div>
          <Button className="bg-white text-black rounded-full px-4 py-1 text-sm">ترقية</Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4">
        <div className="space-y-1 mb-6">
          <h3 className="text-lg mb-2">Manus</h3>
          <MenuItem icon={<Share2 />} label="شارك مع صديق" />
          <MenuItem icon={<BookOpen />} label="معرفة" />
          <MenuItem icon={<Globe />} label="اللغة" value="العربية" />
        </div>

        <div className="space-y-1 mb-6">
          <h3 className="text-gray-500 text-sm mb-2">عام</h3>
          <MenuItem icon={<User />} label="الحساب" />
          <MenuItem icon={<Moon />} label="المظهر" value="الوضع الداكن" />
          <MenuItem icon={<Trash2 />} label="مسح ذاكرة التخزين المؤقت" value="B 0" />
        </div>

        <div className="space-y-1">
          <h3 className="text-gray-500 text-sm mb-2">معلومات</h3>
          <MenuItem icon={<Heart />} label="قيم هذا التطبيق" />
          <MenuItem icon={<Mail />} label="اتصل بنا" />
        </div>
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  value?: string
}

function MenuItem({ icon, label, value }: MenuItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2 text-gray-400">
        {value && <span>{value}</span>}
        <ChevronLeft className="h-5 w-5" />
      </div>
      <div className="flex items-center gap-3">
        <span>{label}</span>
        {icon}
      </div>
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
