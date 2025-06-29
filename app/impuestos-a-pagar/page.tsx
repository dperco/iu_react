"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import {
  ArrowLeft,
  FileCheck,
  Car,
  Home,
  Building,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"

interface TaxObligation {
  id: string
  type: "automotor" | "inmobiliario" | "ingresos_brutos"
  objectId: string
  objectDescription: string
  fiscalPeriod: string
  installment: string
  dueDate: string
  amount: number
  status: "vencido_pago" | "vencido_impago" | "a_vencer"
  daysUntilDue: number
  recargo?: number
  paymentDate?: string
  paymentMethod?: string
  paymentChannel?: string
  daysLate?: number
}

interface GroupedObligation {
  objectId: string
  objectDescription: string
  type: "automotor" | "inmobiliario" | "ingresos_brutos"
  periods: {
    fiscalPeriod: string
    obligations: TaxObligation[]
    totalAmount: number
  }[]
  totalAmount: number
}

interface BehaviorMetrics {
  totalObligations: number
  paidOnTime: number
  paidLate: number
  averageDaysLate: number
  complianceRate: number
  monetaryCompliance: number
  totalPaid: number
  totalPending: number
}

type FilterType = "all" | "automotor" | "inmobiliario" | "ingresos_brutos"

export default function ImpuestosAPagarPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [obligations, setObligations] = useState<TaxObligation[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedObligations, setSelectedObligations] = useState<Set<string>>(new Set())
  const [expandedObjects, setExpandedObjects] = useState<Set<string>>(new Set())
  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(new Set())
  const [expandedHistoryObjects, setExpandedHistoryObjects] = useState<Set<string>>(new Set())
  const [expandedHistoryPeriods, setExpandedHistoryPeriods] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadObligations = () => {
      const mockObligations: TaxObligation[] = [
        // Obligaciones pendientes
        {
          id: "AUTO-001",
          type: "automotor",
          objectId: "ABC123",
          objectDescription: "Toyota Corolla 2020",
          fiscalPeriod: "2024",
          installment: "Cuota 1/6",
          dueDate: "2024-02-25",
          amount: 125000,
          status: "vencido_impago",
          daysUntilDue: -25,
          recargo: 12500,
        },
        {
          id: "AUTO-002",
          type: "automotor",
          objectId: "ABC123",
          objectDescription: "Toyota Corolla 2020",
          fiscalPeriod: "2024",
          installment: "Cuota 2/6",
          dueDate: "2024-03-25",
          amount: 125000,
          status: "vencido_impago",
          daysUntilDue: -3,
          recargo: 6250,
        },
        {
          id: "AUTO-003",
          type: "automotor",
          objectId: "ABC123",
          objectDescription: "Toyota Corolla 2020",
          fiscalPeriod: "2024",
          installment: "Cuota 3/6",
          dueDate: "2024-04-25",
          amount: 125000,
          status: "a_vencer",
          daysUntilDue: 28,
        },
        // Historial de pagos
        {
          id: "AUTO-PAID-001",
          type: "automotor",
          objectId: "ABC123",
          objectDescription: "Toyota Corolla 2020",
          fiscalPeriod: "2023",
          installment: "Cuota 5/6",
          dueDate: "2023-12-25",
          amount: 120000,
          status: "vencido_pago",
          daysUntilDue: -90,
          paymentDate: "2023-12-20",
          paymentMethod: "Transferencia",
          paymentChannel: "Home Banking",
          daysLate: -5,
        },
        {
          id: "AUTO-PAID-002",
          type: "automotor",
          objectId: "ABC123",
          objectDescription: "Toyota Corolla 2020",
          fiscalPeriod: "2023",
          installment: "Cuota 6/6",
          dueDate: "2024-01-25",
          amount: 120000,
          status: "vencido_pago",
          daysUntilDue: -60,
          paymentDate: "2024-02-10",
          paymentMethod: "Débito Automático",
          paymentChannel: "Banco",
          daysLate: 16,
          recargo: 12000,
        },
        {
          id: "INM-PAID-001",
          type: "inmobiliario",
          objectId: "12-34-567-890",
          objectDescription: "Nomenclatura: 12-34-567-890",
          fiscalPeriod: "2023",
          installment: "Cuota 10/10",
          dueDate: "2023-12-20",
          amount: 85000,
          status: "vencido_pago",
          daysUntilDue: -95,
          paymentDate: "2023-12-18",
          paymentMethod: "Tarjeta de Crédito",
          paymentChannel: "App Móvil",
          daysLate: -2,
        },
        {
          id: "INM-PAID-002",
          type: "inmobiliario",
          objectId: "12-34-567-890",
          objectDescription: "Nomenclatura: 12-34-567-890",
          fiscalPeriod: "2024",
          installment: "Cuota 1/10",
          dueDate: "2024-01-20",
          amount: 89500,
          status: "vencido_pago",
          daysUntilDue: -65,
          paymentDate: "2024-01-25",
          paymentMethod: "Efectivo",
          paymentChannel: "Sucursal",
          daysLate: 5,
          recargo: 4475,
        },
        {
          id: "IB-PAID-001",
          type: "ingresos_brutos",
          objectId: "IB-2023-001234",
          objectDescription: "Tecnología Avanzada S.R.L.",
          fiscalPeriod: "Diciembre 2023",
          installment: "Mensual",
          dueDate: "2024-01-15",
          amount: 42000,
          status: "vencido_pago",
          daysUntilDue: -70,
          paymentDate: "2024-01-12",
          paymentMethod: "Transferencia",
          paymentChannel: "Home Banking",
          daysLate: -3,
        },
        // Más obligaciones pendientes
        {
          id: "INM-001",
          type: "inmobiliario",
          objectId: "12-34-567-890",
          objectDescription: "Nomenclatura: 12-34-567-890",
          fiscalPeriod: "2024",
          installment: "Cuota 2/10",
          dueDate: "2024-02-20",
          amount: 89500,
          status: "vencido_impago",
          daysUntilDue: -32,
          recargo: 17900,
        },
        {
          id: "IB-001",
          type: "ingresos_brutos",
          objectId: "IB-2023-001234",
          objectDescription: "Tecnología Avanzada S.R.L.",
          fiscalPeriod: "Febrero 2024",
          installment: "Mensual",
          dueDate: "2024-03-15",
          amount: 48000,
          status: "vencido_impago",
          daysUntilDue: -8,
          recargo: 4800,
        },
      ]

      setObligations(mockObligations)
      setLoading(false)
    }

    loadObligations()
  }, [])

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
      case "vencido_impago":
        return "text-red-400"
      case "a_vencer":
        return "text-yellow-400"
      case "vencido_pago":
        return "text-green-400"
      default:
        return "text-slate-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vencido_impago":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "a_vencer":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "vencido_pago":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <FileCheck className="w-4 h-4 text-slate-400" />
    }
  }

  const getPaymentStatusBadge = (daysLate: number) => {
    if (daysLate <= 0) {
      return (
        <Badge variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">
          A Tiempo
        </Badge>
      )
    } else if (daysLate <= 15) {
      return (
        <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Tardío
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
          Muy Tardío
        </Badge>
      )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vencido_impago":
        return (
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
            Vencido
          </Badge>
        )
      case "a_vencer":
        return (
          <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700 text-white">
            A Vencer
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "automotor":
        return <Car className="w-5 h-5 text-blue-400" />
      case "inmobiliario":
        return <Home className="w-5 h-5 text-green-400" />
      case "ingresos_brutos":
        return <Building className="w-5 h-5 text-purple-400" />
      default:
        return <FileCheck className="w-5 h-5 text-slate-400" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "automotor":
        return "Automotor"
      case "inmobiliario":
        return "Inmobiliario"
      case "ingresos_brutos":
        return "Ingresos Brutos"
      default:
        return "Otro"
    }
  }

  // Filtrar obligaciones pendientes
  const pendingObligations = obligations.filter(
    (obligation) => obligation.status === "vencido_impago" || obligation.status === "a_vencer",
  )

  // Filtrar obligaciones pagadas
  const paidObligations = obligations.filter((obligation) => obligation.status === "vencido_pago")

  const filteredPendingObligations = pendingObligations.filter((obligation) => {
    const matchesType = typeFilter === "all" || obligation.type === typeFilter
    const matchesSearch =
      searchTerm === "" ||
      obligation.objectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obligation.objectDescription.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  const filteredPaidObligations = paidObligations.filter((obligation) => {
    const matchesType = typeFilter === "all" || obligation.type === typeFilter
    const matchesSearch =
      searchTerm === "" ||
      obligation.objectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obligation.objectDescription.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  // Calcular métricas de comportamiento
  const calculateBehaviorMetrics = (): BehaviorMetrics => {
    const totalObligations = paidObligations.length + pendingObligations.length
    const paidOnTime = paidObligations.filter((o) => (o.daysLate || 0) <= 0).length
    const paidLate = paidObligations.filter((o) => (o.daysLate || 0) > 0).length
    const totalDaysLate = paidObligations.reduce((sum, o) => sum + Math.max(0, o.daysLate || 0), 0)
    const averageDaysLate = paidLate > 0 ? totalDaysLate / paidLate : 0
    const complianceRate = totalObligations > 0 ? (paidOnTime / totalObligations) * 100 : 0
    const totalPaid = paidObligations.reduce((sum, o) => sum + o.amount + (o.recargo || 0), 0)
    const totalPending = pendingObligations.reduce((sum, o) => sum + o.amount + (o.recargo || 0), 0)
    const monetaryCompliance = totalObligations > 0 ? (totalPaid / (totalPaid + totalPending)) * 100 : 0

    return {
      totalObligations,
      paidOnTime,
      paidLate,
      averageDaysLate,
      complianceRate,
      monetaryCompliance,
      totalPaid,
      totalPending,
    }
  }

  const behaviorMetrics = calculateBehaviorMetrics()

  // Agrupar obligaciones pendientes
  const groupObligations = (obligationsList: TaxObligation[]): GroupedObligation[] => {
    const grouped: GroupedObligation[] = []

    obligationsList
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .forEach((obligation) => {
        let objectGroup = grouped.find((group) => group.objectId === obligation.objectId)

        if (!objectGroup) {
          objectGroup = {
            objectId: obligation.objectId,
            objectDescription: obligation.objectDescription,
            type: obligation.type,
            periods: [],
            totalAmount: 0,
          }
          grouped.push(objectGroup)
        }

        let periodGroup = objectGroup.periods.find((period) => period.fiscalPeriod === obligation.fiscalPeriod)

        if (!periodGroup) {
          periodGroup = {
            fiscalPeriod: obligation.fiscalPeriod,
            obligations: [],
            totalAmount: 0,
          }
          objectGroup.periods.push(periodGroup)
        }

        periodGroup.obligations.push(obligation)
        periodGroup.totalAmount += obligation.amount + (obligation.recargo || 0)
        objectGroup.totalAmount += obligation.amount + (obligation.recargo || 0)
      })

    return grouped
  }

  // Agrupar obligaciones pagadas (ordenadas por fecha de pago, más reciente primero)
  const groupPaidObligations = (obligationsList: TaxObligation[]): GroupedObligation[] => {
    const grouped: GroupedObligation[] = []

    obligationsList
      .sort((a, b) => new Date(b.paymentDate || "").getTime() - new Date(a.paymentDate || "").getTime())
      .forEach((obligation) => {
        let objectGroup = grouped.find((group) => group.objectId === obligation.objectId)

        if (!objectGroup) {
          objectGroup = {
            objectId: obligation.objectId,
            objectDescription: obligation.objectDescription,
            type: obligation.type,
            periods: [],
            totalAmount: 0,
          }
          grouped.push(objectGroup)
        }

        let periodGroup = objectGroup.periods.find((period) => period.fiscalPeriod === obligation.fiscalPeriod)

        if (!periodGroup) {
          periodGroup = {
            fiscalPeriod: obligation.fiscalPeriod,
            obligations: [],
            totalAmount: 0,
          }
          objectGroup.periods.push(periodGroup)
        }

        periodGroup.obligations.push(obligation)
        periodGroup.totalAmount += obligation.amount + (obligation.recargo || 0)
        objectGroup.totalAmount += obligation.amount + (obligation.recargo || 0)
      })

    return grouped
  }

  const groupedPendingObligations = groupObligations(filteredPendingObligations)
  const groupedPaidObligations = groupPaidObligations(filteredPaidObligations)

  const selectedTotal = filteredPendingObligations
    .filter((obligation) => selectedObligations.has(obligation.id))
    .reduce((sum, obligation) => {
      return sum + obligation.amount + (obligation.recargo || 0)
    }, 0)

  const vencidosCount = filteredPendingObligations.filter((o) => o.status === "vencido_impago").length
  const aVencerCount = filteredPendingObligations.filter((o) => o.status === "a_vencer").length

  const handleSelectObligation = (obligationId: string) => {
    const newSelected = new Set(selectedObligations)
    if (newSelected.has(obligationId)) {
      newSelected.delete(obligationId)
    } else {
      newSelected.add(obligationId)
    }
    setSelectedObligations(newSelected)
  }

  const handleSelectAllInPeriod = (obligations: TaxObligation[]) => {
    const newSelected = new Set(selectedObligations)
    const allSelected = obligations.every((o) => newSelected.has(o.id))

    if (allSelected) {
      obligations.forEach((o) => newSelected.delete(o.id))
    } else {
      obligations.forEach((o) => newSelected.add(o.id))
    }
    setSelectedObligations(newSelected)
  }

  const toggleObjectExpansion = (objectId: string) => {
    const newExpanded = new Set(expandedObjects)
    if (newExpanded.has(objectId)) {
      newExpanded.delete(objectId)
    } else {
      newExpanded.add(objectId)
    }
    setExpandedObjects(newExpanded)
  }

  const togglePeriodExpansion = (key: string) => {
    const newExpanded = new Set(expandedPeriods)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedPeriods(newExpanded)
  }

  const toggleHistoryObjectExpansion = (objectId: string) => {
    const newExpanded = new Set(expandedHistoryObjects)
    if (newExpanded.has(objectId)) {
      newExpanded.delete(objectId)
    } else {
      newExpanded.add(objectId)
    }
    setExpandedHistoryObjects(newExpanded)
  }

  const toggleHistoryPeriodExpansion = (key: string) => {
    const newExpanded = new Set(expandedHistoryPeriods)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedHistoryPeriods(newExpanded)
  }

  const handlePayment = () => {
    if (selectedObligations.size > 0) {
      const selectedIds = Array.from(selectedObligations).join(",")
      router.push(`/pagos?payments=${selectedIds}`)
    }
  }

  const handlePaymentPlan = () => {
    if (selectedObligations.size > 0) {
      const selectedIds = Array.from(selectedObligations).join(",")
      router.push(`/planes-pago?obligations=${selectedIds}`)
    }
  }

  const typeFilters = [
    { id: "all" as FilterType, name: "Todos", icon: FileCheck },
    { id: "automotor" as FilterType, name: "Automotor", icon: Car },
    { id: "inmobiliario" as FilterType, name: "Inmobiliario", icon: Home },
    { id: "ingresos_brutos" as FilterType, name: "Ingresos Brutos", icon: Building },
  ]

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

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
              Gestión <span className="text-cyan-400">Tributaria</span>
            </h1>
            <p className="text-slate-300 mt-2">
              Administra obligaciones pendientes y analiza el comportamiento de pago
            </p>
          </div>

          {/* Filters */}
          <Card className="mindfactory-card text-white border-0 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Tipo de Impuesto</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typeFilters.map((filter) => {
                      const IconComponent = filter.icon
                      return (
                        <Button
                          key={filter.id}
                          onClick={() => setTypeFilter(filter.id)}
                          variant={typeFilter === filter.id ? "default" : "outline"}
                          size="sm"
                          className={
                            typeFilter === filter.id
                              ? "bg-cyan-500 hover:bg-cyan-600 text-slate-900"
                              : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          }
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          {filter.name}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Buscar</span>
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por objeto, inscripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 mb-8">
              <TabsTrigger value="pending" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Obligaciones Pendientes ({filteredPendingObligations.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Historial de Comportamiento ({filteredPaidObligations.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending Obligations Tab */}
            <TabsContent value="pending">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="mindfactory-card text-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{vencidosCount}</h3>
                    <p className="text-slate-400 text-sm">Vencidas</p>
                  </CardContent>
                </Card>

                <Card className="mindfactory-card text-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{aVencerCount}</h3>
                    <p className="text-slate-400 text-sm">A Vencer</p>
                  </CardContent>
                </Card>

                <Card className="mindfactory-card text-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{filteredPendingObligations.length}</h3>
                    <p className="text-slate-400 text-sm">Total Pendientes</p>
                  </CardContent>
                </Card>
              </div>

              {/* Selected Summary */}
              {selectedObligations.size > 0 && (
                <Card className="mindfactory-card text-white border-0 mb-8 border-cyan-500/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {selectedObligations.size} obligación{selectedObligations.size !== 1 ? "es" : ""}{" "}
                            seleccionada
                            {selectedObligations.size !== 1 ? "s" : ""}
                          </h3>
                          <p className="text-slate-400">Total seleccionado: {formatCurrency(selectedTotal)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          onClick={handlePayment}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pagar Ahora
                        </Button>
                        <Button
                          onClick={handlePaymentPlan}
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-semibold px-6 py-2 rounded-full"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Plan de Facilidades
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Grouped Pending Obligations */}
              <Card className="mindfactory-card text-white border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold flex items-center space-x-3">
                    <FileCheck className="w-6 h-6 text-cyan-400" />
                    <span>Obligaciones Pendientes por Objeto</span>
                  </CardTitle>
                  <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groupedPendingObligations.map((objectGroup) => (
                      <div key={objectGroup.objectId} className="border border-slate-700 rounded-lg overflow-hidden">
                        <Collapsible
                          open={expandedObjects.has(objectGroup.objectId)}
                          onOpenChange={() => toggleObjectExpansion(objectGroup.objectId)}
                        >
                          <CollapsibleTrigger className="w-full">
                            <div className="bg-slate-800/50 p-4 flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                              <div className="flex items-center space-x-4">
                                {expandedObjects.has(objectGroup.objectId) ? (
                                  <ChevronDown className="w-5 h-5 text-cyan-400" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-cyan-400" />
                                )}
                                {getTypeIcon(objectGroup.type)}
                                <div className="text-left">
                                  <h3 className="font-bold text-white text-lg">{objectGroup.objectId}</h3>
                                  <p className="text-slate-400 text-sm">{objectGroup.objectDescription}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-cyan-400 font-bold text-lg">
                                  {formatCurrency(objectGroup.totalAmount)}
                                </p>
                                <p className="text-slate-400 text-sm">{getTypeName(objectGroup.type)}</p>
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="bg-slate-900/30">
                              {objectGroup.periods.map((periodGroup) => {
                                const periodKey = `${objectGroup.objectId}-${periodGroup.fiscalPeriod}`
                                const allPeriodSelected = periodGroup.obligations.every((o) =>
                                  selectedObligations.has(o.id),
                                )

                                return (
                                  <div key={periodKey} className="border-t border-slate-700">
                                    <Collapsible
                                      open={expandedPeriods.has(periodKey)}
                                      onOpenChange={() => togglePeriodExpansion(periodKey)}
                                    >
                                      <CollapsibleTrigger className="w-full">
                                        <div className="bg-slate-800/30 p-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                          <div className="flex items-center space-x-3">
                                            {expandedPeriods.has(periodKey) ? (
                                              <ChevronDown className="w-4 h-4 text-slate-400" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4 text-slate-400" />
                                            )}
                                            <Checkbox
                                              checked={allPeriodSelected}
                                              onCheckedChange={() => handleSelectAllInPeriod(periodGroup.obligations)}
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="text-left">
                                              <h4 className="font-semibold text-white">
                                                Período: {periodGroup.fiscalPeriod}
                                              </h4>
                                              <p className="text-slate-400 text-sm">
                                                {periodGroup.obligations.length} obligación
                                                {periodGroup.obligations.length !== 1 ? "es" : ""}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-white font-semibold">
                                              {formatCurrency(periodGroup.totalAmount)}
                                            </p>
                                          </div>
                                        </div>
                                      </CollapsibleTrigger>

                                      <CollapsibleContent>
                                        <div className="bg-slate-900/50">
                                          {periodGroup.obligations.map((obligation) => (
                                            <div
                                              key={obligation.id}
                                              className={`p-4 border-t border-slate-700/50 flex items-center justify-between hover:bg-slate-800/30 transition-colors ${
                                                selectedObligations.has(obligation.id) ? "bg-cyan-500/10" : ""
                                              }`}
                                            >
                                              <div className="flex items-center space-x-4">
                                                <Checkbox
                                                  checked={selectedObligations.has(obligation.id)}
                                                  onCheckedChange={() => handleSelectObligation(obligation.id)}
                                                />
                                                <div>
                                                  <div className="flex items-center space-x-2 mb-1">
                                                    {getStatusIcon(obligation.status)}
                                                    {getStatusBadge(obligation.status)}
                                                    <span className="text-white font-medium">
                                                      {obligation.installment}
                                                    </span>
                                                  </div>
                                                  <p className="text-slate-400 text-sm">
                                                    Vencimiento: {formatDate(obligation.dueDate)}
                                                    {obligation.status === "vencido_impago" && (
                                                      <span className="text-red-400 ml-2">
                                                        (Vencido hace {Math.abs(obligation.daysUntilDue)} días)
                                                      </span>
                                                    )}
                                                    {obligation.status === "a_vencer" && (
                                                      <span className="text-yellow-400 ml-2">
                                                        (Vence en {obligation.daysUntilDue} días)
                                                      </span>
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-white font-bold">
                                                  {formatCurrency(obligation.amount)}
                                                </p>
                                                {obligation.recargo && (
                                                  <p className="text-red-400 text-sm">
                                                    + {formatCurrency(obligation.recargo)} recargo
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </div>
                                )
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}

                    {groupedPendingObligations.length === 0 && (
                      <div className="text-center py-12">
                        <FileCheck className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No hay obligaciones pendientes</h3>
                        <p className="text-slate-400">
                          {searchTerm || typeFilter !== "all"
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "No tienes obligaciones tributarias pendientes"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Behavior History Tab */}
            <TabsContent value="history">
              {/* Behavior Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="mindfactory-card text-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{behaviorMetrics.complianceRate.toFixed(1)}%</h3>
                    <p className="text-slate-400 text-sm">Cumplimiento a Tiempo</p>
                  </CardContent>
                </Card>

                <Card className="mindfactory-card text-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{behaviorMetrics.averageDaysLate.toFixed(0)}</h3>
                    <p className="text-slate-400 text-sm">Días Promedio de Atraso</p>
                  </CardContent>
                </Card>

                <Card className="mindfactory-card text-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {behaviorMetrics.monetaryCompliance.toFixed(1)}%
                    </h3>
                    <p className="text-slate-400 text-sm">Cumplimiento Monetario</p>
                  </CardContent>
                </Card>

                <Card className="mindfactory-card text-white border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{behaviorMetrics.totalObligations}</h3>
                    <p className="text-slate-400 text-sm">Total Pagos Realizados</p>
                  </CardContent>
                </Card>
              </div>

              {/* Grouped Payment History */}
              <Card className="mindfactory-card text-white border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                    <span>Historial de Comportamiento por Objeto</span>
                  </CardTitle>
                  <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groupedPaidObligations.map((objectGroup) => (
                      <div key={objectGroup.objectId} className="border border-slate-700 rounded-lg overflow-hidden">
                        <Collapsible
                          open={expandedHistoryObjects.has(objectGroup.objectId)}
                          onOpenChange={() => toggleHistoryObjectExpansion(objectGroup.objectId)}
                        >
                          <CollapsibleTrigger className="w-full">
                            <div className="bg-slate-800/50 p-4 flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                              <div className="flex items-center space-x-4">
                                {expandedHistoryObjects.has(objectGroup.objectId) ? (
                                  <ChevronDown className="w-5 h-5 text-cyan-400" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-cyan-400" />
                                )}
                                {getTypeIcon(objectGroup.type)}
                                <div className="text-left">
                                  <h3 className="font-bold text-white text-lg">{objectGroup.objectId}</h3>
                                  <p className="text-slate-400 text-sm">{objectGroup.objectDescription}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-green-400 font-bold text-lg">
                                  {formatCurrency(objectGroup.totalAmount)}
                                </p>
                                <p className="text-slate-400 text-sm">{getTypeName(objectGroup.type)}</p>
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="bg-slate-900/30">
                              {objectGroup.periods.map((periodGroup) => {
                                const periodKey = `history-${objectGroup.objectId}-${periodGroup.fiscalPeriod}`

                                return (
                                  <div key={periodKey} className="border-t border-slate-700">
                                    <Collapsible
                                      open={expandedHistoryPeriods.has(periodKey)}
                                      onOpenChange={() => toggleHistoryPeriodExpansion(periodKey)}
                                    >
                                      <CollapsibleTrigger className="w-full">
                                        <div className="bg-slate-800/30 p-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                          <div className="flex items-center space-x-3">
                                            {expandedHistoryPeriods.has(periodKey) ? (
                                              <ChevronDown className="w-4 h-4 text-slate-400" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4 text-slate-400" />
                                            )}
                                            <div className="text-left">
                                              <h4 className="font-semibold text-white">
                                                Período: {periodGroup.fiscalPeriod}
                                              </h4>
                                              <p className="text-slate-400 text-sm">
                                                {periodGroup.obligations.length} pago
                                                {periodGroup.obligations.length !== 1 ? "s" : ""} realizado
                                                {periodGroup.obligations.length !== 1 ? "s" : ""}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-green-400 font-semibold">
                                              {formatCurrency(periodGroup.totalAmount)}
                                            </p>
                                          </div>
                                        </div>
                                      </CollapsibleTrigger>

                                      <CollapsibleContent>
                                        <div className="bg-slate-900/50">
                                          {periodGroup.obligations.map((obligation) => (
                                            <div
                                              key={obligation.id}
                                              className="p-4 border-t border-slate-700/50 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                                            >
                                              <div className="flex items-center space-x-4">
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                                <div>
                                                  <div className="flex items-center space-x-2 mb-1">
                                                    {getPaymentStatusBadge(obligation.daysLate || 0)}
                                                    <span className="text-white font-medium">
                                                      {obligation.installment}
                                                    </span>
                                                  </div>
                                                  <p className="text-slate-400 text-sm">
                                                    Vencimiento: {formatDate(obligation.dueDate)} | Pagado:{" "}
                                                    {formatDate(obligation.paymentDate || "")}
                                                    {(obligation.daysLate || 0) > 0 && (
                                                      <span className="text-red-400 ml-2">
                                                        ({obligation.daysLate} días de atraso)
                                                      </span>
                                                    )}
                                                    {(obligation.daysLate || 0) < 0 && (
                                                      <span className="text-green-400 ml-2">
                                                        ({Math.abs(obligation.daysLate || 0)} días de adelanto)
                                                      </span>
                                                    )}
                                                  </p>
                                                  <p className="text-slate-500 text-xs">
                                                    {obligation.paymentMethod} - {obligation.paymentChannel}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-white font-bold">
                                                  {formatCurrency(obligation.amount)}
                                                </p>
                                                {obligation.recargo && (
                                                  <p className="text-red-400 text-sm">
                                                    + {formatCurrency(obligation.recargo)} recargo
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </div>
                                )
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}

                    {groupedPaidObligations.length === 0 && (
                      <div className="text-center py-12">
                        <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No hay historial de pagos</h3>
                        <p className="text-slate-400">
                          {searchTerm || typeFilter !== "all"
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "No se encontraron pagos realizados"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
