"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Bell, ArrowLeft, Check, Clock, AlertCircle, CreditCard, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notifications-provider"

export default function NotificacionesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case "success":
        return <Check className="w-5 h-5 text-green-400" />
      case "payment":
        return <CreditCard className="w-5 h-5 text-cyan-400" />
      default:
        return <Bell className="w-5 h-5 text-blue-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      default:
        return "border-l-cyan-500"
    }
  }

  return (
    <div className="min-h-screen mindfactory-bg">
      <Header />

      {/* Floating geometric elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-10 w-3 h-3 bg-cyan-400/10 rotate-45 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-4 h-4 border border-cyan-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-cyan-400/5 rotate-12 animate-pulse"></div>
      </div>

      <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="mb-8">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="mb-4 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Mis <span className="text-cyan-400">Notificaciones</span>
                </h1>
                <p className="text-slate-300 mt-2">
                  Mantente al día con todas tus notificaciones importantes
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                      {unreadCount} sin leer
                    </span>
                  )}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>

          {/* Notifications Grid */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`mindfactory-card text-white border-0 border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.isRead ? "bg-slate-800/70" : "bg-slate-800/40"
                } hover:bg-slate-800/80 transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3
                            className={`text-lg font-semibold ${!notification.isRead ? "text-white" : "text-slate-300"}`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          )}
                        </div>

                        <p
                          className={`text-sm leading-relaxed mb-3 ${!notification.isRead ? "text-slate-300" : "text-slate-400"}`}
                        >
                          {notification.message}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(notification.date).toLocaleDateString("es-AR")}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{notification.isRead ? "Leída" : "Sin leer"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {!notification.isRead && (
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:bg-cyan-500/10 flex-shrink-0"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Marcar como leída
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {notifications.length === 0 && (
            <Card className="mindfactory-card text-white border-0">
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No hay notificaciones</h3>
                <p className="text-slate-400">Cuando tengas nuevas notificaciones, aparecerán aquí.</p>
              </CardContent>
            </Card>
          )}

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="mindfactory-card text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{notifications.length}</h3>
                <p className="text-slate-400 text-sm">Total de notificaciones</p>
              </CardContent>
            </Card>

            <Card className="mindfactory-card text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{unreadCount}</h3>
                <p className="text-slate-400 text-sm">Sin leer</p>
              </CardContent>
            </Card>

            <Card className="mindfactory-card text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{notifications.length - unreadCount}</h3>
                <p className="text-slate-400 text-sm">Leídas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
