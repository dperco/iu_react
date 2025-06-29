"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
} from "lucide-react"

interface PaymentPlan {
  id: string
  numeroAcuerdo: string
  fechaCreacion: string
  fechaVencimiento: string
  montoTotal: number
  montoAdeudado: number
  cuotasTotales: number
  cuotasPagadas: number
  cuotasAdeudadas: number
  proximaCuota: {
    numero: number
    fechaVencimiento: string
    importe: number
  }
  estado: "vigente" | "vencido" | "finalizado" | "cancelado"
  objetos: string[]
  periodos: string[]
}

export default function PlanesDePagoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [activeTab, setActiveTab] = useState("vigentes")

  // Datos simulados de planes de pago
  const [paymentPlans] = useState<PaymentPlan[]>([
    {
      id: "1",
      numeroAcuerdo: "PP-2024-001234",
      fechaCreacion: "15/01/2024",
      fechaVencimiento: "15/12/2024",
      montoTotal: 125000,
      montoAdeudado: 75000,
      cuotasTotales: 12,
      cuotasPagadas: 4,
      cuotasAdeudadas: 8,
      proximaCuota: {
        numero: 5,
        fechaVencimiento: "15/01/2025",
        importe: 12500,
      },
      estado: "vigente",
      objetos: ["Inmueble 001-234-567", "Automotor ABC123"],
      periodos: ["2023-01 a 2023-12"],
    },
    {
      id: "2",
      numeroAcuerdo: "PP-2023-005678",
      fechaCreacion: "10/03/2023",
      fechaVencimiento: "10/03/2024",
      montoTotal: 85000,
      montoAdeudado: 0,
      cuotasTotales: 6,
      cuotasPagadas: 6,
      cuotasAdeudadas: 0,
      proximaCuota: {
        numero: 0,
        fechaVencimiento: "",
        importe: 0,
      },
      estado: "finalizado",
      objetos: ["Actividad Económica AE-2020-001234"],
      periodos: ["2022-07 a 2022-12"],
    },
    {
      id: "3",
      numeroAcuerdo: "PP-2024-002345",
      fechaCreacion: "20/06/2024",
      fechaVencimiento: "20/12/2024",
      montoTotal: 45000,
      montoAdeudado: 45000,
      cuotasTotales: 6,
      cuotasPagadas: 0,
      cuotasAdeudadas: 6,
      proximaCuota: {
        numero: 1,
        fechaVencimiento: "20/12/2024",
        importe: 7500,
      },
      estado: "vencido",
      objetos: ["Inmueble 002-345-678"],
      periodos: ["2023-01 a 2023-06"],
    },
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      vigente: { label: "Vigente", className: "bg-green-600 hover:bg-green-700" },
      vencido: { label: "Vencido", className: "bg-red-600 hover:bg-red-700" },
      finalizado: { label: "Finalizado", className: "bg-blue-600 hover:bg-blue-700" },
      cancelado: { label: "Cancelado", className: "bg-gray-600 hover:bg-gray-700" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={`${config.className} text-white`}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vigente":
        return <Clock className="w-4 h-4 text-green-500" />
      case "vencido":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "finalizado":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "cancelado":
        return <AlertCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredPlans = paymentPlans.filter((plan) => {
    const matchesSearch =
      plan.numeroAcuerdo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.objetos.some((obj) => obj.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterStatus === "todos" || plan.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  const plansByTab = {
    vigentes: filteredPlans.filter((plan) => plan.estado === "vigente"),
    vencidos: filteredPlans.filter((plan) => plan.estado === "vencido"),
    finalizados: filteredPlans.filter((plan) => plan.estado === "finalizado"),
    todos: filteredPlans,
  }

  const currentPlans = plansByTab[activeTab as keyof typeof plansByTab]

  // Estadísticas
  const stats = {
    total: paymentPlans.length,
    vigentes: paymentPlans.filter((p) => p.estado === "vigente").length,
    vencidos: paymentPlans.filter((p) => p.estado === "vencido").length,
    finalizados: paymentPlans.filter((p) => p.estado === "finalizado").length,
    montoTotalAdeudado: paymentPlans
      .filter((p) => p.estado === "vigente" || p.estado === "vencido")
      .reduce((sum, p) => sum + p.montoAdeudado, 0),
  }

  return (
    <div className="min-h-screen mindfactory-bg">
      <Header />

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Planes de Pago</h1>
            <p className="text-slate-300">Gestión de planes de facilidades de pago</p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="mindfactory-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Total Planes</p>
                    <p className="text-2xl font-bold text-cyan-400">{stats.total}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="mindfactory-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Vigentes</p>
                    <p className="text-2xl font-bold text-green-400">{stats.vigentes}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="mindfactory-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Vencidos</p>
                    <p className="text-2xl font-bold text-red-400">{stats.vencidos}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="mindfactory-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Finalizados</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.finalizados}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="mindfactory-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Monto Adeudado</p>
                    <p className="text-lg font-bold text-cyan-400">{formatCurrency(stats.montoTotalAdeudado)}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros y Búsqueda */}
          <Card className="mindfactory-card border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por número de acuerdo o objeto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="vigente">Vigentes</SelectItem>
                      <SelectItem value="vencido">Vencidos</SelectItem>
                      <SelectItem value="finalizado">Finalizados</SelectItem>
                      <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-cyan-500/20">
              <TabsTrigger
                value="vigentes"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900"
              >
                Vigentes ({plansByTab.vigentes.length})
              </TabsTrigger>
              <TabsTrigger
                value="vencidos"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900"
              >
                Vencidos ({plansByTab.vencidos.length})
              </TabsTrigger>
              <TabsTrigger
                value="finalizados"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900"
              >
                Finalizados ({plansByTab.finalizados.length})
              </TabsTrigger>
              <TabsTrigger value="todos" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900">
                Todos ({plansByTab.todos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid gap-6">
                {currentPlans.length === 0 ? (
                  <Card className="mindfactory-card border-0">
                    <CardContent className="p-12 text-center">
                      <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No hay planes de pago</h3>
                      <p className="text-slate-300">No se encontraron planes de pago con los filtros aplicados.</p>
                    </CardContent>
                  </Card>
                ) : (
                  currentPlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className="mindfactory-card border-0 hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(plan.estado)}
                            <div>
                              <CardTitle className="text-white text-lg">{plan.numeroAcuerdo}</CardTitle>
                              <p className="text-slate-300 text-sm">Creado el {plan.fechaCreacion}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">{getStatusBadge(plan.estado)}</div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Información Principal */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-slate-300 text-sm mb-1">Monto Total</p>
                              <p className="text-xl font-bold text-cyan-400">{formatCurrency(plan.montoTotal)}</p>
                            </div>
                            <div>
                              <p className="text-slate-300 text-sm mb-1">Monto Adeudado</p>
                              <p className="text-lg font-semibold text-white">{formatCurrency(plan.montoAdeudado)}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-slate-300 text-sm mb-1">Cuotas</p>
                              <p className="text-lg font-semibold text-white">
                                {plan.cuotasPagadas} / {plan.cuotasTotales}
                              </p>
                              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                                <div
                                  className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(plan.cuotasPagadas / plan.cuotasTotales) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-300 text-sm mb-1">Cuotas Adeudadas</p>
                              <p className="text-lg font-semibold text-red-400">{plan.cuotasAdeudadas}</p>
                            </div>
                          </div>

                          {plan.estado === "vigente" && plan.proximaCuota.numero > 0 && (
                            <div className="space-y-4">
                              <div>
                                <p className="text-slate-300 text-sm mb-1">Próxima Cuota</p>
                                <p className="text-lg font-semibold text-white">Cuota #{plan.proximaCuota.numero}</p>
                              </div>
                              <div>
                                <p className="text-slate-300 text-sm mb-1">Vencimiento</p>
                                <p className="text-lg font-semibold text-yellow-400">
                                  {plan.proximaCuota.fechaVencimiento}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-300 text-sm mb-1">Importe</p>
                                <p className="text-lg font-semibold text-cyan-400">
                                  {formatCurrency(plan.proximaCuota.importe)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Objetos y Períodos */}
                        <div className="border-t border-slate-600 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-300 text-sm mb-2">Objetos Incluidos</p>
                              <div className="space-y-1">
                                {plan.objetos.map((objeto, index) => (
                                  <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                                    {objeto}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-300 text-sm mb-2">Períodos</p>
                              <div className="space-y-1">
                                {plan.periodos.map((periodo, index) => (
                                  <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                                    {periodo}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="border-t border-slate-600 pt-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalle
                            </Button>
                            {plan.estado === "vigente" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Pagar Cuota
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Modificar
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Descargar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
