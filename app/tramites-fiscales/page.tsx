"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ArrowLeft, Clock, FileText, AlertCircle, CheckCircle, Phone, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"

interface FiscalProcedure {
  id: string
  title: string
  description: string
  category: string
  estimatedTime: string
  requirements: string[]
  status: string
  complexity: "low" | "medium" | "high"
}

interface RecentProcedure {
  id: string
  title: string
  status: string
  submittedDate: string
  estimatedCompletion?: string
  completedDate?: string
}

export default function TramitesFiscalesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [procedures, setProcedures] = useState<FiscalProcedure[]>([])
  const [recentProcedures, setRecentProcedures] = useState<RecentProcedure[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await fetch("/api/fiscal-procedures", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: "fiscal-procedures",
            timestamp: new Date().toISOString(),
            userId: user?.id,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setProcedures(data.data.availableProcedures)
          setRecentProcedures(data.data.recentProcedures)
        }
      } catch (error) {
        console.error("Error fetching procedures:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProcedures()
    }
  }, [user])

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-500/20 text-green-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "high":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "Fácil"
      case "medium":
        return "Intermedio"
      case "high":
        return "Complejo"
      default:
        return "N/A"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completado":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "En proceso":
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-400" />
    }
  }

  const categories = [
    { id: "all", name: "Todos los Trámites" },
    { id: "Exenciones", name: "Exenciones" },
    { id: "Facilidades de Pago", name: "Facilidades de Pago" },
    { id: "Actualización de Datos", name: "Actualización de Datos" },
    { id: "Comercio e Industria", name: "Comercio e Industria" },
    { id: "Reclamos", name: "Reclamos" },
    { id: "Certificaciones", name: "Certificaciones" },
  ]

  const filteredProcedures =
    selectedCategory === "all" ? procedures : procedures.filter((p) => p.category === selectedCategory)

  const handleStartProcedure = (procedureId: string) => {
    alert(`Iniciando trámite: ${procedureId}`)
    // Aquí se implementaría la lógica para iniciar el trámite
  }

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
              Trámites <span className="text-cyan-400">Fiscales</span>
            </h1>
            <p className="text-slate-300 mt-2">
              Iniciá y gestioná tus trámites ante organismos fiscales de manera digital
            </p>
          </div>

          {/* Recent Procedures */}
          {recentProcedures.length > 0 && (
            <Card className="mindfactory-card text-white border-0 mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>Mis Trámites Recientes</span>
                </CardTitle>
                <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recentProcedures.map((procedure) => (
                    <div
                      key={procedure.id}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(procedure.status)}
                        <div>
                          <h3 className="text-white font-medium">{procedure.title}</h3>
                          <p className="text-slate-400 text-sm">ID: {procedure.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            procedure.status === "Completado"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {procedure.status}
                        </span>
                        <p className="text-slate-400 text-xs mt-1">
                          {procedure.completedDate
                            ? `Completado: ${new Date(procedure.completedDate).toLocaleDateString("es-AR")}`
                            : `Estimado: ${procedure.estimatedCompletion ? new Date(procedure.estimatedCompletion).toLocaleDateString("es-AR") : "N/A"}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedCategory === category.id
                      ? "bg-cyan-500 hover:bg-cyan-600 text-slate-900"
                      : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Available Procedures */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProcedures.map((procedure) => (
              <Card
                key={procedure.id}
                className="mindfactory-card text-white border-0 hover:scale-105 transition-transform duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold leading-tight">{procedure.title}</CardTitle>
                        <p className="text-cyan-400 text-sm">{procedure.category}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(procedure.complexity)}`}
                    >
                      {getComplexityText(procedure.complexity)}
                    </span>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-16"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm leading-relaxed">{procedure.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">{procedure.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm">Documentación requerida:</h4>
                    <ul className="space-y-1">
                      {procedure.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="text-slate-400 text-xs flex items-center space-x-2">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                          <span>{req}</span>
                        </li>
                      ))}
                      {procedure.requirements.length > 3 && (
                        <li className="text-cyan-400 text-xs">+{procedure.requirements.length - 3} más...</li>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleStartProcedure(procedure.id)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold py-2 rounded-full"
                  >
                    Iniciar Trámite
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support Section */}
          <Card className="mindfactory-card text-white border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center space-x-3">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>¿Necesitas Ayuda?</span>
              </CardTitle>
              <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Contacto de Soporte</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">0800-555-FISCO</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">tramites@rentascordoba.gov.ar</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">Lunes a Viernes 8:00 - 18:00</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Información Importante</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Todos los trámites cuentan con firma digital</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Seguimiento en tiempo real del estado</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Notificaciones automáticas por email</span>
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
