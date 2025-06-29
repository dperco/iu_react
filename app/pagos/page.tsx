"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ArrowLeft, CreditCard, Building2, Calendar, DollarSign, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"

interface PaymentOption {
  id: string
  name: string
  description: string
  fee: number
  processingTime: string
  icon: any
  available: boolean
}

interface PendingPayment {
  id: string
  type: string
  description: string
  amount: number
  dueDate: string
  status: "vencido" | "proximo" | "vigente"
  daysUntilDue: number
}

export default function PagosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const paymentId = searchParams.get("payment")

    // Only set selected payment if it's different from current state
    if (paymentId && paymentId !== selectedPayment) {
      setSelectedPayment(paymentId)
    }

    // Cargar datos de pagos pendientes
    const loadPaymentData = () => {
      const mockPendingPayments: PendingPayment[] = [
        {
          id: "PAY-001",
          type: "inmobiliario",
          description: "ABL - Cuota 3/2024",
          amount: 89500,
          dueDate: "2024-03-20",
          status: "vencido",
          daysUntilDue: -2,
        },
        {
          id: "PAY-002",
          type: "automotor",
          description: "Impuesto Automotor - Cuota 1/2024",
          amount: 125000,
          dueDate: "2024-03-25",
          status: "proximo",
          daysUntilDue: 7,
        },
        {
          id: "PAY-003",
          type: "comercio",
          description: "Ingresos Brutos - Febrero 2024",
          amount: 45000,
          dueDate: "2024-04-15",
          status: "vigente",
          daysUntilDue: 28,
        },
      ]

      const mockPaymentMethods: PaymentOption[] = [
        {
          id: "credit-card",
          name: "Tarjeta de Crédito/Débito",
          description: "Pago inmediato con tarjetas Visa, Mastercard, American Express",
          fee: 2.5,
          processingTime: "Inmediato",
          icon: CreditCard,
          available: true,
        },
        {
          id: "bank-transfer",
          name: "Transferencia Bancaria",
          description: "Transferencia desde tu cuenta bancaria",
          fee: 0,
          processingTime: "24-48 horas",
          icon: Building2,
          available: true,
        },
        {
          id: "payment-network",
          name: "Red de Pagos",
          description: "Rapipago, Pago Fácil, Provincia NET",
          fee: 1.5,
          processingTime: "24 horas",
          icon: Building2,
          available: true,
        },
      ]

      setPendingPayments(mockPendingPayments)
      setPaymentMethods(mockPaymentMethods)
      setLoading(false)
    }

    // Only load data once when component mounts
    if (loading) {
      loadPaymentData()
    }
  }, []) // Remove searchParams dependency

  // Handle search params separately
  useEffect(() => {
    const paymentId = searchParams.get("payment")
    if (paymentId && paymentId !== selectedPayment) {
      setSelectedPayment(paymentId)
    }
  }, [searchParams.get("payment")])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencido":
        return "text-red-400"
      case "proximo":
        return "text-yellow-400"
      default:
        return "text-green-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vencido":
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      case "proximo":
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />
    }
  }

  const getStatusText = (status: string, daysUntilDue: number) => {
    switch (status) {
      case "vencido":
        return `Vencido hace ${Math.abs(daysUntilDue)} días`
      case "proximo":
        return `Vence en ${daysUntilDue} días`
      default:
        return `Vence en ${daysUntilDue} días`
    }
  }

  const handlePayment = (paymentId: string, methodId: string) => {
    const payment = pendingPayments.find((p) => p.id === paymentId)
    const method = paymentMethods.find((m) => m.id === methodId)

    if (payment && method) {
      const totalAmount = payment.amount + (payment.amount * method.fee) / 100
      alert(`Procesando pago de ${formatCurrency(totalAmount)} mediante ${method.name}`)
      // Aquí se implementaría la lógica real de pago
    }
  }

  const totalPendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen mindfactory-bg">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
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
        <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Centro de <span className="text-cyan-400">Pagos</span>
            </h1>
            <p className="text-slate-300 mt-2">Gestiona tus pagos tributarios de manera segura y eficiente</p>
          </div>

          {/* Resumen de Pagos Pendientes */}
          <Card className="mindfactory-card text-white border-0 mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-red-400" />
                <span>Resumen de Pagos Pendientes</span>
              </CardTitle>
              <div className="h-0.5 bg-gradient-to-r from-red-400 to-red-300 w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Total Pendiente</p>
                  <p className="text-3xl font-bold text-red-400">{formatCurrency(totalPendingAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Pagos Pendientes</p>
                  <p className="text-3xl font-bold text-white">{pendingPayments.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Vencidos</p>
                  <p className="text-3xl font-bold text-red-400">
                    {pendingPayments.filter((p) => p.status === "vencido").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Pagos Pendientes */}
          <Card className="mindfactory-card text-white border-0 mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-yellow-400" />
                <span>Pagos Pendientes</span>
              </CardTitle>
              <div className="h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-300 w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className={`bg-slate-800/50 rounded-lg p-6 border-l-4 ${
                      payment.status === "vencido"
                        ? "border-red-500"
                        : payment.status === "proximo"
                          ? "border-yellow-500"
                          : "border-green-500"
                    } ${selectedPayment === payment.id ? "ring-2 ring-cyan-500" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(payment.status)}
                        <div>
                          <h3 className="font-bold text-white text-lg">{payment.description}</h3>
                          <p className="text-slate-400">ID: {payment.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{formatCurrency(payment.amount)}</p>
                        <p className={`text-sm font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status, payment.daysUntilDue)}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">Fecha de Vencimiento</p>
                        <p className="text-white font-medium">{formatDate(payment.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Tipo de Impuesto</p>
                        <p className="text-white font-medium capitalize">{payment.type}</p>
                      </div>
                    </div>

                    {/* Métodos de Pago */}
                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="text-white font-semibold mb-3">Selecciona método de pago:</h4>
                      <div className="grid md:grid-cols-3 gap-3">
                        {paymentMethods.map((method) => {
                          const IconComponent = method.icon
                          const totalWithFee = payment.amount + (payment.amount * method.fee) / 100

                          return (
                            <Button
                              key={method.id}
                              onClick={() => handlePayment(payment.id, method.id)}
                              variant="outline"
                              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 p-4 h-auto flex flex-col items-center space-y-2"
                            >
                              <IconComponent className="w-6 h-6" />
                              <div className="text-center">
                                <p className="font-semibold text-sm">{method.name}</p>
                                <p className="text-xs text-slate-400">{method.processingTime}</p>
                                <p className="text-xs font-bold text-cyan-400">
                                  {formatCurrency(totalWithFee)}
                                  {method.fee > 0 && <span className="text-slate-500"> (+{method.fee}%)</span>}
                                </p>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información de Seguridad */}
          <Card className="mindfactory-card text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Pagos Seguros</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Encriptación SSL de 256 bits</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Certificación PCI DSS</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Comprobante inmediato por email</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Soporte 24/7</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
