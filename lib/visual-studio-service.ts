/**
 * خدمة التكامل مع Visual Studio
 */
export class VisualStudioService {
  /**
   * فتح الكود في Visual Studio
   */
  openInVisualStudio(code: string, language: string): void {
    console.log(`فتح الكود في Visual Studio (${language}):`, code)

    // في بيئة الإنتاج، يمكن استخدام واجهة برمجة تطبيقات مخصصة لفتح Visual Studio
    // مثال: استخدام بروتوكول URL مخصص أو واجهة برمجة تطبيقات ويب

    // محاكاة فتح Visual Studio
    this.simulateOpeningVisualStudio(code, language)
  }

  /**
   * محاكاة فتح Visual Studio
   */
  private simulateOpeningVisualStudio(code: string, language: string): void {
    // في بيئة الويب، يمكن استخدام نافذة منبثقة لمحاكاة فتح Visual Studio
    if (typeof window !== "undefined") {
      // حفظ الكود في التخزين المحلي لاستخدامه لاحقاً
      localStorage.setItem("vsCode", code)
      localStorage.setItem("vsLanguage", language)

      // إظهار إشعار للمستخدم
      this.showVSNotification()
    }
  }

  /**
   * إظهار إشعار بفتح Visual Studio
   */
  private showVSNotification(): void {
    // إنشاء عنصر الإشعار
    const notification = document.createElement("div")
    notification.style.position = "fixed"
    notification.style.bottom = "20px"
    notification.style.right = "20px"
    notification.style.backgroundColor = "#1e1e1e" // لون Visual Studio
    notification.style.color = "white"
    notification.style.padding = "15px 20px"
    notification.style.borderRadius = "5px"
    notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
    notification.style.zIndex = "9999"
    notification.style.display = "flex"
    notification.style.alignItems = "center"
    notification.style.gap = "10px"
    notification.style.fontFamily = "Arial, sans-serif"
    notification.style.direction = "rtl"

    // إضافة أيقونة Visual Studio
    notification.innerHTML = `
      <div style="background-color: #5C2D91; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 5px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 20.8l-12.5 -16.6c-0.2 -0.3 -0.5 -0.5 -0.9 -0.5c-0.2 0 -0.4 0 -0.6 0.1l-3.5 1.3a1 1 0 0 0 -0.5 1.4l9.7 16.3a1 1 0 0 0 0.8 0.4l6.3 -0.1a1 1 0 0 0 0.7 -1.5z"></path>
          <path d="M17.8 20.8l3.4 -1.2a1 1 0 0 0 0.6 -0.8l0 -14.6a1 1 0 0 0 -0.7 -1l-3.3 -1.1a1 1 0 0 0 -1 0.2l-9.6 9.6"></path>
          <path d="M7.5 4.2l9.5 13.6"></path>
        </svg>
      </div>
      <div>
        <div style="font-weight: bold; margin-bottom: 3px;">تم فتح الكود في Visual Studio</div>
        <div style="font-size: 12px;">انقر لعرض الكود في محرر الكود</div>
      </div>
    `

    // إضافة حدث النقر
    notification.style.cursor = "pointer"
    notification.addEventListener("click", () => {
      // فتح محرر الكود
      this.openCodeEditor()
      // إزالة الإشعار
      document.body.removeChild(notification)
    })

    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification)

    // إزالة الإشعار بعد 5 ثوانٍ
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 5000)
  }

  /**
   * فتح محرر الكود
   */
  private openCodeEditor(): void {
    // استرجاع الكود من التخزين المحلي
    const code = localStorage.getItem("vsCode") || ""
    const language = localStorage.getItem("vsLanguage") || "javascript"

    // إنشاء نافذة محرر الكود
    const editorWindow = window.open("", "VSCodeEditor", "width=800,height=600")

    if (editorWindow) {
      // إنشاء محتوى محرر الكود
      editorWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Visual Studio Code - محرر الكود</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/vs2015.min.css">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/javascript.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/typescript.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/python.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Consolas', 'Courier New', monospace;
              background-color: #1e1e1e;
              color: #d4d4d4;
              display: flex;
              flex-direction: column;
              height: 100vh;
            }
            .title-bar {
              background-color: #323233;
              padding: 8px 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #252526;
            }
            .title {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .vs-icon {
              background-color: #5C2D91;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 3px;
            }
            .file-name {
              font-size: 14px;
            }
            .language-badge {
              background-color: #4d4d4d;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 12px;
              margin-right: 10px;
            }
            .editor-container {
              flex: 1;
              overflow: auto;
              padding: 10px 0;
            }
            pre {
              margin: 0;
              padding: 0 15px;
              tab-size: 4;
              counter-reset: line;
            }
            code {
              font-family: 'Consolas', 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.5;
              display: block;
            }
            code .hljs-line {
              display: block;
              position: relative;
            }
            code .hljs-line:before {
              counter-increment: line;
              content: counter(line);
              display: inline-block;
              width: 30px;
              text-align: right;
              margin-right: 15px;
              color: #858585;
              user-select: none;
            }
            .status-bar {
              background-color: #007acc;
              color: white;
              padding: 3px 10px;
              font-size: 12px;
              display: flex;
              justify-content: space-between;
            }
            .status-item {
              display: flex;
              align-items: center;
              gap: 5px;
            }
          </style>
        </head>
        <body>
          <div class="title-bar">
            <div class="title">
              <div class="vs-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.8 20.8l-12.5 -16.6c-0.2 -0.3 -0.5 -0.5 -0.9 -0.5c-0.2 0 -0.4 0 -0.6 0.1l-3.5 1.3a1 1 0 0 0 -0.5 1.4l9.7 16.3a1 1 0 0 0 0.8 0.4l6.3 -0.1a1 1 0 0 0 0.7 -1.5z"></path>
                  <path d="M17.8 20.8l3.4 -1.2a1 1 0 0 0 0.6 -0.8l0 -14.6a1 1 0 0 0 -0.7 -1l-3.3 -1.1a1 1 0 0 0 -1 0.2l-9.6 9.6"></path>
                  <path d="M7.5 4.2l9.5 13.6"></path>
                </svg>
              </div>
              <div class="file-name">code.${language}</div>
              <div class="language-badge">${language.toUpperCase()}</div>
            </div>
          </div>
          <div class="editor-container">
            <pre><code class="language-${language}" id="codeBlock">${this.escapeHtml(code)}</code></pre>
          </div>
          <div class="status-bar">
            <div class="status-item">
              <span>Visual Studio Code</span>
            </div>
            <div class="status-item">
              <span>${language.toUpperCase()}</span>
              <span>UTF-8</span>
            </div>
          </div>
          <script>
            // تقسيم الكود إلى أسطر وإضافة فئة لكل سطر
            const codeBlock = document.getElementById('codeBlock');
            const codeLines = codeBlock.innerHTML.split('\\n');
            codeBlock.innerHTML = codeLines.map(line => \`<span class="hljs-line">\${line}</span>\`).join('\\n');
            
            // تطبيق تنسيق الكود
            hljs.highlightAll();
          </script>
        </body>
        </html>
      `)

      editorWindow.document.close()
    }
  }

  /**
   * تهرب الأحرف الخاصة في HTML
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
}
