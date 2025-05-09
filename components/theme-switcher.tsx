"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

type Theme = "dark" | "light" | "system" | "blue" | "green" | "purple" | "amber" | "high-contrast"
type ColorScheme = "default" | "blue" | "green" | "purple" | "amber" | "high-contrast"

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark")
  const [colorScheme, setColorScheme] = useState<ColorScheme>("default")
  const [fontFamily, setFontFamily] = useState<string>("Tajawal")

  useEffect(() => {
    // تحميل السمة المحفوظة
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme
    const savedFontFamily = localStorage.getItem("fontFamily")

    if (savedTheme) setTheme(savedTheme)
    if (savedColorScheme) setColorScheme(savedColorScheme)
    if (savedFontFamily) setFontFamily(savedFontFamily)

    // تطبيق السمة
    applyTheme(savedTheme || theme, savedColorScheme || colorScheme, savedFontFamily || fontFamily)
  }, [])

  const applyTheme = (newTheme: Theme, newColorScheme: ColorScheme, newFontFamily: string) => {
    // تطبيق السمة على العناصر
    const root = document.documentElement

    // تطبيق الوضع المظلم/الفاتح
    if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }

    // تطبيق نظام الألوان
    root.setAttribute("data-color-scheme", newColorScheme)

    // تطبيق الخط
    document.body.style.fontFamily = newFontFamily

    // حفظ الإعدادات
    localStorage.setItem("theme", newTheme)
    localStorage.setItem("colorScheme", newColorScheme)
    localStorage.setItem("fontFamily", newFontFamily)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme, colorScheme, fontFamily)
  }

  const handleColorSchemeChange = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme)
    applyTheme(theme, newColorScheme, fontFamily)
  }

  const handleFontFamilyChange = (newFontFamily: string) => {
    setFontFamily(newFontFamily)
    applyTheme(theme, colorScheme, newFontFamily)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Palette className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>المظهر</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="h-4 w-4 ml-2" />
          <span>فاتح</span>
          {theme === "light" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="h-4 w-4 ml-2" />
          <span>داكن</span>
          {theme === "dark" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <Palette className="h-4 w-4 ml-2" />
          <span>تلقائي</span>
          {theme === "system" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>نظام الألوان</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleColorSchemeChange("default")}>
          <div className="h-4 w-4 rounded-full bg-zinc-800 ml-2" />
          <span>افتراضي</span>
          {colorScheme === "default" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleColorSchemeChange("blue")}>
          <div className="h-4 w-4 rounded-full bg-blue-600 ml-2" />
          <span>أزرق</span>
          {colorScheme === "blue" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleColorSchemeChange("green")}>
          <div className="h-4 w-4 rounded-full bg-green-600 ml-2" />
          <span>أخضر</span>
          {colorScheme === "green" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleColorSchemeChange("purple")}>
          <div className="h-4 w-4 rounded-full bg-purple-600 ml-2" />
          <span>أرجواني</span>
          {colorScheme === "purple" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleColorSchemeChange("amber")}>
          <div className="h-4 w-4 rounded-full bg-amber-600 ml-2" />
          <span>كهرماني</span>
          {colorScheme === "amber" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleColorSchemeChange("high-contrast")}>
          <div className="h-4 w-4 rounded-full bg-white border border-black ml-2" />
          <span>تباين عالي</span>
          {colorScheme === "high-contrast" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>الخط</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleFontFamilyChange("Tajawal")}>
          <span>Tajawal</span>
          {fontFamily === "Tajawal" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFontFamilyChange("Cairo")}>
          <span>Cairo</span>
          {fontFamily === "Cairo" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFontFamilyChange("Almarai")}>
          <span>Almarai</span>
          {fontFamily === "Almarai" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFontFamilyChange("Amiri")}>
          <span>Amiri</span>
          {fontFamily === "Amiri" && <Check className="h-4 w-4 mr-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
