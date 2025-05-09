import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      systemPrompt,
      model = "gemini-2.0-flash",
      maxTokens = 1024,
      temperature = 0.7,
      customApiKey = null,
    } = body

    // استخدام مفتاح API المخصص أو مفتاح API من متغيرات البيئة
    const apiKey = customApiKey || process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "مفتاح API غير متوفر. يرجى تكوين متغير البيئة GEMINI_API_KEY أو توفير مفتاح API مخصص." },
        { status: 500 },
      )
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: temperature,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `خطأ في Gemini API: ${errorData.error?.message || response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("خطأ في استدعاء Gemini API:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة الطلب" }, { status: 500 })
  }
}
