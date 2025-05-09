/**
 * محلل JSX/TSX متقدم
 * يقوم بتحويل كود JSX/TSX إلى HTML قابل للعرض
 */

interface JSXNode {
  type: string
  props: Record<string, any>
  children: (JSXNode | string)[]
}

export class JSXParser {
  /**
   * تحويل كود JSX/TSX إلى HTML
   */
  static parseJSX(jsxCode: string): string {
    try {
      // تنظيف الكود
      const cleanedCode = this.cleanJSXCode(jsxCode)

      // استخراج مكونات JSX
      const components = this.extractComponents(cleanedCode)

      // تحويل المكونات إلى HTML
      let html = cleanedCode

      // استبدال مكونات React الشائعة بمكافئاتها في HTML
      components.forEach((component) => {
        html = this.replaceComponent(html, component)
      })

      // معالجة الخصائص
      html = this.processProps(html)

      // معالجة التعبيرات البرمجية
      html = this.processExpressions(html)

      // معالجة الشظايا
      html = this.processFragments(html)

      // إزالة الاستيراد والتصدير
      html = this.removeImportsExports(html)

      // إزالة التعليقات
      html = this.removeComments(html)

      // إزالة الكود البرمجي خارج JSX
      html = this.extractJSXOnly(html)

      // تنظيف نهائي
      html = this.finalCleanup(html)

      return html
    } catch (error: any) {
      console.error("خطأ في تحليل JSX:", error)
      return `<div class="error">خطأ في تحليل JSX: ${error.message}</div>`
    }
  }

  /**
   * تنظيف كود JSX
   */
  private static cleanJSXCode(code: string): string {
    return code
      .replace(/\/\/.*$/gm, "") // إزالة التعليقات السطرية
      .replace(/\/\*[\s\S]*?\*\//g, "") // إزالة التعليقات المتعددة الأسطر
      .replace(/^\s*import.*$\n?/gm, "") // إزالة عبارات الاستيراد
      .replace(/^\s*export.*$\n?/gm, "") // إزالة عبارات التصدير
  }

  /**
   * استخراج مكونات JSX
   */
  private static extractComponents(code: string): string[] {
    const componentRegex = /<([A-Z][a-zA-Z0-9]*)[^>]*>/g
    const matches = code.match(componentRegex) || []
    return matches
      .map((match) => {
        const componentMatch = match.match(/<([A-Z][a-zA-Z0-9]*)[^>]*>/)
        return componentMatch ? componentMatch[1] : ""
      })
      .filter(Boolean)
  }

  /**
   * استبدال مكون React بمكافئه في HTML
   */
  private static replaceComponent(html: string, componentName: string): string {
    // قاموس لمكونات React الشائعة ومكافئاتها في HTML
    const componentMap: Record<string, string> = {
      // مكونات الأساسية
      div: "div",
      span: "span",
      p: "p",
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      h5: "h5",
      h6: "h6",
      ul: "ul",
      ol: "ol",
      li: "li",
      a: "a",
      img: "img",
      button: "button",
      input: "input",
      textarea: "textarea",
      select: "select",
      option: "option",
      form: "form",
      label: "label",
      table: "table",
      tr: "tr",
      td: "td",
      th: "th",
      thead: "thead",
      tbody: "tbody",

      // مكونات React الشائعة
      Button: "button",
      Input: "input",
      TextArea: "textarea",
      Select: "select",
      Option: "option",
      Form: "form",
      Label: "label",
      Image: "img",
      Link: "a",
      List: "ul",
      ListItem: "li",
      Table: "table",
      TableRow: "tr",
      TableCell: "td",
      TableHeader: "th",

      // مكونات shadcn/ui
      Card: "div",
      CardHeader: "div",
      CardTitle: "h3",
      CardDescription: "p",
      CardContent: "div",
      CardFooter: "div",
      Button: "button",
      Input: "input",
      Textarea: "textarea",
      Label: "label",
      Select: "select",
      SelectTrigger: "button",
      SelectValue: "span",
      SelectContent: "div",
      SelectItem: "div",
      Tabs: "div",
      TabsList: "div",
      TabsTrigger: "button",
      TabsContent: "div",
      Dialog: "div",
      DialogTrigger: "button",
      DialogContent: "div",
      DialogHeader: "div",
      DialogTitle: "h2",
      DialogDescription: "p",
      DialogFooter: "div",
      Avatar: "div",
      AvatarImage: "img",
      AvatarFallback: "div",
      Badge: "span",
      Checkbox: "input",
      RadioGroup: "div",
      RadioGroupItem: "input",
      Switch: "button",
      DropdownMenu: "div",
      DropdownMenuTrigger: "button",
      DropdownMenuContent: "div",
      DropdownMenuItem: "button",
      DropdownMenuLabel: "div",
      DropdownMenuSeparator: "hr",
      Tooltip: "div",
      TooltipTrigger: "button",
      TooltipContent: "div",
      Popover: "div",
      PopoverTrigger: "button",
      PopoverContent: "div",
      Slider: "input",
      Progress: "progress",
      Skeleton: "div",
      Alert: "div",
      AlertTitle: "h5",
      AlertDescription: "div",
      Accordion: "div",
      AccordionItem: "div",
      AccordionTrigger: "button",
      AccordionContent: "div",
    }

    // أيقونات Lucide تحول إلى SVG
    if (componentName.match(/^[A-Z]/) && !componentMap[componentName]) {
      componentMap[componentName] = "svg"
    }

    const htmlTag = componentMap[componentName] || "div"
    const regex = new RegExp(`<${componentName}(\\s+[^>]*)?>(.*?)<\\/${componentName}>`, "gs")

    return html.replace(regex, (match, props, content) => {
      return `<${htmlTag}${props || ""}>${content}</${htmlTag}>`
    })
  }

  /**
   * معالجة خصائص JSX
   */
  private static processProps(html: string): string {
    // تحويل خصائص JSX إلى خصائص HTML
    let processedHtml = html.replace(/className=/g, "class=").replace(/htmlFor=/g, "for=")

    // معالجة الخصائص المضمنة
    const inlineStyleRegex = /style=\{(\{[^}]*\})\}/g
    processedHtml = processedHtml.replace(inlineStyleRegex, (match, styleObj) => {
      try {
        // تحويل كائن النمط إلى سلسلة CSS
        const styleString = styleObj
          .replace(/[{}]/g, "")
          .replace(/,/g, ";")
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .toLowerCase()

        return `style="${styleString}"`
      } catch (error) {
        return 'style=""'
      }
    })

    return processedHtml
  }

  /**
   * معالجة التعبيرات البرمجية في JSX
   */
  private static processExpressions(html: string): string {
    // استبدال التعبيرات البرمجية البسيطة
    return html.replace(/\{([^{}]*)\}/g, (match, expr) => {
      // تجاهل التعبيرات المعقدة
      if (expr.includes("{") || expr.includes("}")) {
        return ""
      }

      // محاولة تقييم التعبيرات البسيطة
      try {
        // استبدال العمليات الحسابية البسيطة
        if (/^[\d\s+\-*/()]+$/.test(expr)) {
          return String(eval(expr))
        }

        // استبدال السلاسل النصية
        if (/^['"].*['"]$/.test(expr)) {
          return expr.slice(1, -1)
        }

        // استبدال القيم المنطقية
        if (expr.trim() === "true") return "true"
        if (expr.trim() === "false") return "false"

        // استبدال المصفوفات البسيطة
        if (/^\[.*\]$/.test(expr) && !expr.includes("{")) {
          return expr.slice(1, -1).split(",").join(" ")
        }

        return expr
      } catch (error) {
        return ""
      }
    })
  }

  /**
   * معالجة شظايا React
   */
  private static processFragments(html: string): string {
    // استبدال <> </> بـ <div> </div>
    return html
      .replace(/<>([^<]*)<\/>/g, "<div>$1</div>")
      .replace(/<React.Fragment>([^<]*)<\/React.Fragment>/g, "<div>$1</div>")
  }

  /**
   * إزالة عبارات الاستيراد والتصدير
   */
  private static removeImportsExports(html: string): string {
    return html
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, "")
      .replace(/export\s+default\s+.*?;?/g, "")
      .replace(/export\s+const\s+.*?;?/g, "")
      .replace(/export\s+function\s+.*?\{.*?\}/gs, "")
  }

  /**
   * إزالة التعليقات
   */
  private static removeComments(html: string): string {
    return html.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
  }

  /**
   * استخراج JSX فقط
   */
  private static extractJSXOnly(html: string): string {
    // محاولة استخراج JSX من الكود
    const jsxRegex = /<[A-Za-z][^>]*>[\s\S]*<\/[A-Za-z][^>]*>/g
    const matches = html.match(jsxRegex)

    if (matches && matches.length > 0) {
      return matches.join("\n")
    }

    // إذا لم يتم العثور على JSX، إرجاع HTML كما هو
    return html
  }

  /**
   * تنظيف نهائي للكود
   */
  private static finalCleanup(html: string): string {
    return html.replace(/\s+/g, " ").replace(/> </g, ">\n<").trim()
  }
}
