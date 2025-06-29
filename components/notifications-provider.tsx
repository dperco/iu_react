"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Notification {
  id: string
  title: string
  message: string
  date: string
  isRead: boolean
  type: "info" | "warning" | "success" | "payment"
  priority: "high" | "medium" | "low"
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Vencimiento de ABL próximo",
      message: "Su cuota de ABL vence el 20 de marzo. Recuerde realizar el pago para evitar recargos.",
      date: "2024-03-15",
      isRead: false,
      type: "warning",
      priority: "high",
    },
    {
      id: "2",
      title: "Pago procesado exitosamente",
      message: "Su pago de Ingresos Brutos por $8,420.75 ha sido procesado correctamente.",
      date: "2024-03-10",
      isRead: true,
      type: "success",
      priority: "medium",
    },
    {
      id: "3",
      title: "Actualización de datos personales",
      message: "Se han actualizado sus datos de contacto. Verifique que la información sea correcta.",
      date: "2024-03-08",
      isRead: false,
      type: "info",
      priority: "low",
    },
    {
      id: "4",
      title: "Nueva funcionalidad disponible",
      message: "Ya puede realizar pagos con tarjeta de crédito directamente desde el portal.",
      date: "2024-03-05",
      isRead: true,
      type: "info",
      priority: "low",
    },
    {
      id: "5",
      title: "Compensación aplicada",
      message: "Se ha aplicado una compensación de $5,000 a su cuenta de Ingresos Brutos.",
      date: "2024-03-01",
      isRead: false,
      type: "payment",
      priority: "medium",
    },
    {
      id: "6",
      title: "Recordatorio: Declaración jurada",
      message: "No olvide presentar su declaración jurada antes del 31 de marzo.",
      date: "2024-02-28",
      isRead: true,
      type: "warning",
      priority: "high",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
