"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (provider: string) => {
    // Aquí se implementaría la lógica de autenticación real
    console.log(`Iniciando sesión con ${provider}`)

    // Simulación de inicio de sesión exitoso
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Fondo con gradientes */}
      <div className="absolute inset-0 bg-black opacity-90 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#00ffff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#ff00ff33,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffff0033,transparent_70%)]"></div>
      </div>

      {/* Logo */}
      <div className="relative z-10 animate-pulse mb-5">
        <Image
          src="/images/wolf-logo.png"
          alt="WOLF Logo"
          width={120}
          height={120}
          className="animate-[pulse_4s_ease-in-out_infinite]"
        />
      </div>

      {/* Título */}
      <h1 className="text-2xl mb-10 text-center relative z-10">
        مرحبًا بك في <strong>WOLF</strong>
      </h1>

      {/* Botones de inicio de sesión */}
      <div className="flex flex-col gap-4 w-[90%] max-w-[360px] relative z-10">
        <button
          onClick={() => handleLogin("Google")}
          className="py-3.5 px-4 text-base rounded-lg flex items-center justify-center gap-2.5 bg-gradient-to-r from-white to-gray-200 text-black transition-transform hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" alt="Google" />
          متابعة باستخدام Google
        </button>

        <button
          onClick={() => handleLogin("Apple")}
          className="py-3.5 px-4 text-base rounded-lg flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#f1f1f1] to-[#cccccc] text-black transition-transform hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        >
          <img src="https://www.svgrepo.com/show/452210/apple.svg" width="20" alt="Apple" />
          متابعة باستخدام Apple
        </button>

        <button
          onClick={() => handleLogin("Email")}
          className="py-3.5 px-4 text-base rounded-lg flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#444] to-[#222] text-white transition-transform hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        >
          <img src="https://www.svgrepo.com/show/452213/email.svg" width="20" alt="Email" />
          متابعة باستخدام البريد الإلكتروني
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2.5 text-sm text-gray-400 flex gap-4 z-10">
        <Link href="/terms" className="hover:text-white transition-colors">
          شروط الخدمة
        </Link>
        <Link href="/privacy" className="hover:text-white transition-colors">
          سياسة الخصوصية
        </Link>
      </footer>
    </div>
  )
}
