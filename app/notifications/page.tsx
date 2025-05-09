"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function NotificationsPage() {
  const router = useRouter()

  const notifications = [
    {
      id: 1,
      date: "الثلاثاء",
      title: "لقد حصلت على 2 رمز دعوة حصري",
      description: "بداية صغيرة لإنشاء شيء كبير.",
    },
    {
      id: 2,
      date: "٣/٢١",
      title: "تقديم عضوية Manus (نسخة تجريبية) وتطبيق الجوال",
      description:
        "شكراً لكونك من أوائل مستخدمي Manus! لقد كانت شغفك وإبداعك مصدر إلهام لنا اليوم. نحن متحمسون للإعلان عن تحديثين رئيسيين:",
      details: [
        "١. تقديم عضوية Manus (نسخة تجريبية)",
        "نحن نطلق نسخة تجريبية من عضوية Manus مع المزيد من الأرصدة لاستخدامها، وتقديم المزيد من الـ...",
      ],
      hasMore: true,
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <X />
        </Button>
        <h1 className="text-xl font-semibold">الإشعارات</h1>
        <div className="w-8"></div>
      </header>

      {/* Notifications */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-gray-500 mb-4">الثلاثاء</h2>

        {notifications.map((notification) => (
          <Card key={notification.id} className="bg-zinc-800 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">{notification.title}</h3>
            <p className="text-sm text-gray-300">{notification.description}</p>
            {notification.details && (
              <ul className="mt-2 text-sm text-gray-300">
                {notification.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
            {notification.hasMore && (
              <Button variant="link" className="text-blue-400 p-0 mt-2">
                عرض المزيد
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
