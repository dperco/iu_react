"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notifications-provider"
import { LogOut, User, ChevronDown, Settings, Key, Bell } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, signIn, signOut, loading } = useAuth()
  const { unreadCount } = useNotifications()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMyData = () => {
    setIsDropdownOpen(false)
    router.push("/mis-datos")
  }

  const handleNotifications = () => {
    setIsDropdownOpen(false)
    router.push("/notificaciones")
  }

  const handleChangePassword = () => {
    setIsDropdownOpen(false)
    alert("Navegando a Cambiar mi clave...")
    // Here you would navigate to the change password page
  }

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">Backoffice Rentas Cordoba</span>
                <span className="text-cyan-400 text-xs">Sistema de Gestión</span>
              </div>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 hover:bg-slate-800/50 rounded-lg p-2 transition-colors"
                  >
                    {user.image ? (
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-cyan-500"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-900" />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-medium hidden sm:block">{user.name}</span>
                      {/* Notification Bell */}
                      {unreadCount > 0 && (
                        <div className="relative">
                          <Bell className="w-4 h-4 text-cyan-400 animate-pulse" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold leading-none">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-cyan-500/20 py-2 z-50">
                      <button
                        onClick={handleMyData}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Mis Datos</span>
                      </button>
                      <button
                        onClick={handleNotifications}
                        className="w-full flex items-center justify-between px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Bell className="w-4 h-4" />
                          <span>Notificaciones</span>
                        </div>
                        {unreadCount > 0 && (
                          <div className="bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </div>
                        )}
                      </button>
                      <button
                        onClick={handleChangePassword}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        <span>Cambiar mi clave</span>
                      </button>
                      <hr className="my-2 border-slate-700" />
                      <button
                        onClick={signOut}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button onClick={signIn} className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-6">
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
