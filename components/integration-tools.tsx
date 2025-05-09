"use client"

import { X, Code, Globe, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface IntegrationToolsProps {
  onClose: () => void
}

export function IntegrationTools({ onClose }: IntegrationToolsProps) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 z-10 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">أدوات التكامل</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Visual Studio Integration */}
        <Card className="bg-zinc-800 border-none p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <Code className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Visual Studio</h3>
                <p className="text-sm text-gray-400">فتح وتحرير الكود في Visual Studio</p>
              </div>
            </div>
            <Switch id="vs-integration" defaultChecked />
          </div>
          <div className="bg-zinc-900 p-3 rounded-lg text-sm">
            <p className="mb-2">
              عند تنفيذ أي أمر برمجي، سيقوم البوت بفتح Visual Studio تلقائياً مع الكود الذي تم إنشاؤه.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs">
                تكوين Visual Studio
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                اختبار الاتصال
              </Button>
            </div>
          </div>
        </Card>

        {/* Web Research Integration */}
        <Card className="bg-zinc-800 border-none p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-full">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">البحث على الويب</h3>
                <p className="text-sm text-gray-400">البحث عن معلومات حديثة من الإنترنت</p>
              </div>
            </div>
            <Switch id="web-research" defaultChecked />
          </div>
          <div className="bg-zinc-900 p-3 rounded-lg text-sm">
            <p className="mb-2">يمكن للبوت البحث عن معلومات محدثة من الإنترنت للإجابة على أسئلتك بدقة أكبر.</p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs">
                تحديد مصادر البحث
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                إعدادات متقدمة
              </Button>
            </div>
          </div>
        </Card>

        {/* Deep Thinking Integration */}
        <Card className="bg-zinc-800 border-none p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-full">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">التفكير العميق</h3>
                <p className="text-sm text-gray-400">تحليل متعمق للمشكلات المعقدة</p>
              </div>
            </div>
            <Switch id="deep-thinking" defaultChecked />
          </div>
          <div className="bg-zinc-900 p-3 rounded-lg text-sm">
            <p className="mb-2">
              يتيح وضع التفكير العميق للبوت تحليل المشكلات المعقدة خطوة بخطوة للوصول إلى حلول أكثر دقة.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs">
                ضبط مستوى التفكير
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                عرض أمثلة
              </Button>
            </div>
          </div>
        </Card>

        {/* Google Gemini Integration */}
        <Card className="bg-zinc-800 border-none p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-400 p-2 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">G</span>
              </div>
              <div>
                <h3 className="font-semibold">Google Gemini</h3>
                <p className="text-sm text-gray-400">تكامل مع نماذج Google Gemini المتقدمة</p>
              </div>
            </div>
            <Switch id="gemini-integration" defaultChecked />
          </div>
          <div className="bg-zinc-900 p-3 rounded-lg text-sm">
            <p className="mb-2">يستخدم البوت نماذج Google Gemini المتقدمة لتوليد استجابات أكثر دقة وفهماً للسياق.</p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs">
                اختيار النموذج
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                إعدادات API
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
