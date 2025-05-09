"use client"

import type React from "react"

import { useEffect, useState, useCallback, useRef } from "react"

// وظيفة لتأخير التنفيذ (throttle)
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall.current >= delay) {
        lastCall.current = now
        func(...args)
      }
    },
    [func, delay],
  )
}

// وظيفة لتأخير التنفيذ حتى يتوقف المستخدم (debounce)
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timer = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        func(...args)
      }, delay)
    },
    [func, delay],
  )
}

// وظيفة لتخزين قيمة مؤقتًا (debounced value)
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// وظيفة للتحميل المتأخر للصور
export function useLazyImage(src: string, placeholder = ""): { src: string; isLoaded: boolean } {
  const [imageSrc, setImageSrc] = useState<string>(placeholder)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }

    return () => {
      img.onload = null
    }
  }, [src])

  return { src: imageSrc, isLoaded }
}

// وظيفة للتحميل المتأخر للمكونات
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

// وظيفة لتحسين أداء القوائم الطويلة
export function useVirtualList<T>(
  items: T[],
  rowHeight: number,
  visibleRows: number,
): {
  virtualItems: { index: number; item: T; offsetTop: number }[]
  totalHeight: number
  startIndex: number
  endIndex: number
  scrollTo: (index: number) => void
} {
  const [scrollTop, setScrollTop] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // حساب العناصر المرئية
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 1)
  const endIndex = Math.min(items.length - 1, startIndex + visibleRows + 2)

  const virtualItems = []
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      item: items[i],
      offsetTop: i * rowHeight,
    })
  }

  // وظيفة للتمرير إلى عنصر معين
  const scrollTo = useCallback(
    (index: number) => {
      if (containerRef.current) {
        containerRef.current.scrollTop = index * rowHeight
      }
    },
    [rowHeight],
  )

  // مستمع للتمرير
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }

    container.addEventListener("scroll", handleScroll)

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return {
    virtualItems,
    totalHeight: items.length * rowHeight,
    startIndex,
    endIndex,
    scrollTo,
  }
}

// وظيفة لتحسين أداء الرسوم المتحركة
export function useAnimationFrame(callback: (deltaTime: number) => void): void {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current
        callback(deltaTime)
      }

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    },
    [callback],
  )

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}

// وظيفة لتحسين أداء الحالة المعقدة
export function useStateWithHistory<T>(
  initialState: T,
  capacity = 10,
): [T, (value: T) => void, { undo: () => void; redo: () => void; history: T[]; pointer: number }] {
  const [state, setState] = useState<T>(initialState)
  const historyRef = useRef<T[]>([initialState])
  const pointerRef = useRef<number>(0)

  const set = useCallback(
    (value: T) => {
      const newValue = typeof value === "function" ? (value as Function)(state) : value

      if (historyRef.current[pointerRef.current] !== newValue) {
        // إذا قمنا بتغيير الحالة بعد استخدام undo، نحذف التاريخ المستقبلي
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current = historyRef.current.slice(0, pointerRef.current + 1)
        }

        // إضافة الحالة الجديدة إلى التاريخ
        historyRef.current.push(newValue)

        // التأكد من عدم تجاوز السعة
        if (historyRef.current.length > capacity) {
          historyRef.current.shift()
        }

        // تحديث المؤشر
        pointerRef.current = historyRef.current.length - 1
      }

      setState(newValue)
    },
    [state, capacity],
  )

  const undo = useCallback(() => {
    if (pointerRef.current > 0) {
      pointerRef.current--
      setState(historyRef.current[pointerRef.current])
    }
  }, [])

  const redo = useCallback(() => {
    if (pointerRef.current < historyRef.current.length - 1) {
      pointerRef.current++
      setState(historyRef.current[pointerRef.current])
    }
  }, [])

  return [
    state,
    set,
    {
      undo,
      redo,
      history: historyRef.current,
      pointer: pointerRef.current,
    },
  ]
}
