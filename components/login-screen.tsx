"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { Shield, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useState } from "react"

export function LoginScreen() {
  const { signIn, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMethod, setLoginMethod] = useState<"traditional" | "google">("traditional")

  const handleTraditionalLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se implementaría la lógica de login tradicional
    console.log("Login tradicional:", { email, password })
    // Por ahora, simularemos que funciona igual que Google
    signIn()
  }

  return (
    <div className="min-h-screen mindfactory-bg flex items-center justify-center p-4">
      {/* Floating geometric elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 border-2 border-cyan-400/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-8 h-8 bg-cyan-400/10 rotate-12 animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-cyan-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-60 right-1/4 w-5 h-5 border border-cyan-400/20 rotate-45"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
        </div>

        {/* Login Card */}
        <Card className="mindfactory-card text-white border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Acceso Seguro</span>
            </CardTitle>
            <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-16 mx-auto"></div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Method Tabs */}
            <div className="flex space-x-2 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setLoginMethod("traditional")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "traditional" ? "bg-cyan-500 text-slate-900" : "text-slate-300 hover:text-white"
                }`}
              >
                Email y Contraseña
              </button>
              <button
                onClick={() => setLoginMethod("google")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "google" ? "bg-cyan-500 text-slate-900" : "text-slate-300 hover:text-white"
                }`}
              >
                Google
              </button>
            </div>

            {loginMethod === "traditional" ? (
              /* Traditional Login Form */
              <form onSubmit={handleTraditionalLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-slate-300">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                    />
                    <span>Recordarme</span>
                  </label>
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold py-3 rounded-full transition-all duration-300"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            ) : (
              /* Google Login */
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-slate-300 text-sm mb-4">
                    Inicia sesión de forma rápida y segura con tu cuenta de Google
                  </p>
                </div>

                <Button
                  onClick={signIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-full transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continuar con Google</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Security Features */}
            <div className="border-t border-slate-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span>Encriptación SSL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span>Datos Protegidos</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-400">
              <p>
                Al iniciar sesión, aceptas nuestros{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  términos de servicio
                </a>{" "}
                y{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  política de privacidad
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm mb-4">¿Necesitas ayuda para acceder?</p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Soporte Técnico
            </a>
            <span className="text-slate-600">•</span>
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Crear Cuenta
            </a>
            <span className="text-slate-600">•</span>
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Guía de Uso
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
