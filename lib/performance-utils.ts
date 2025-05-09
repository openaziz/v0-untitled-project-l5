/**
 * أدوات تحسين الأداء للتطبيق
 */

// وظيفة لتأخير التنفيذ (throttle)
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// وظيفة لتأخير التنفيذ حتى يتوقف المستخدم (debounce)
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}

// وظيفة لتقسيم المهام الثقيلة
export function chunkTasks<T>(
  items: T[],
  chunkSize: number,
  processor: (item: T) => void,
  callback?: () => void,
): void {
  let index = 0

  function processNextChunk() {
    const chunk = items.slice(index, index + chunkSize)
    index += chunkSize

    if (chunk.length === 0) {
      if (callback) callback()
      return
    }

    // معالجة الدفعة الحالية
    chunk.forEach(processor)

    // جدولة الدفعة التالية
    setTimeout(processNextChunk, 0)
  }

  processNextChunk()
}

// وظيفة لتخزين النتائج المؤقتة (memoization)
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map()
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

// وظيفة للتحقق من دعم المتصفح لميزات معينة
export function checkBrowserSupport(): Record<string, boolean> {
  if (typeof window === "undefined") return {}

  return {
    webWorkers: typeof Worker !== "undefined",
    sharedWorkers: typeof SharedWorker !== "undefined",
    serviceWorkers: "serviceWorker" in navigator,
    indexedDB: "indexedDB" in window,
    webGL: (() => {
      try {
        const canvas = document.createElement("canvas")
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        )
      } catch (e) {
        return false
      }
    })(),
    webAssembly: typeof WebAssembly !== "undefined",
  }
}

// وظيفة لقياس أداء الوظائف
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string,
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => {
    const start = performance.now()
    const result = func(...args)
    const end = performance.now()
    console.log(`[Performance] ${label}: ${end - start}ms`)
    return result
  }
}

// وظيفة لتحسين عرض القوائم الطويلة
export class VirtualizedList {
  private container: HTMLElement | null = null
  private items: any[] = []
  private itemHeight = 0
  private visibleItems = 0
  private scrollTop = 0
  private renderCallback: (item: any, index: number) => HTMLElement

  constructor(
    containerSelector: string,
    items: any[],
    itemHeight: number,
    renderCallback: (item: any, index: number) => HTMLElement,
  ) {
    this.items = items
    this.itemHeight = itemHeight
    this.renderCallback = renderCallback

    if (typeof window !== "undefined") {
      this.container = document.querySelector(containerSelector)
      if (this.container) {
        this.visibleItems = Math.ceil(this.container.clientHeight / this.itemHeight) + 2 // +2 للتمرير السلس
        this.container.addEventListener("scroll", this.handleScroll.bind(this))
        this.render()
      }
    }
  }

  private handleScroll(): void {
    if (!this.container) return
    this.scrollTop = this.container.scrollTop
    this.render()
  }

  private render(): void {
    if (!this.container) return

    // حساب العناصر المرئية
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(startIndex + this.visibleItems, this.items.length)

    // إنشاء حاوية للعناصر المرئية
    const fragment = document.createDocumentFragment()
    const containerHeight = this.items.length * this.itemHeight
    const offsetY = startIndex * this.itemHeight

    // إنشاء عنصر للحفاظ على ارتفاع الحاوية
    const spacer = document.createElement("div")
    spacer.style.height = `${containerHeight}px`
    spacer.style.position = "relative"
    fragment.appendChild(spacer)

    // إضافة العناصر المرئية فقط
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.renderCallback(this.items[i], i)
      item.style.position = "absolute"
      item.style.top = `${i * this.itemHeight}px`
      item.style.width = "100%"
      spacer.appendChild(item)
    }

    // تحديث المحتوى
    this.container.innerHTML = ""
    this.container.appendChild(fragment)
  }

  // تحديث قائمة العناصر
  public updateItems(newItems: any[]): void {
    this.items = newItems
    this.render()
  }

  // تنظيف المستمعين عند إزالة المكون
  public cleanup(): void {
    if (this.container) {
      this.container.removeEventListener("scroll", this.handleScroll.bind(this))
    }
  }
}
