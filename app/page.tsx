"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  FileCheck,
  CreditCard,
  ClipboardList,
  Search,
  Building2,
  ExternalLink,
  Calendar,
} from "lucide-react"
import { Header } from "@/components/header"
import { LoginScreen } from "@/components/login-screen"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [cuit, setCuit] = useState("")
  const [taxpayerInfo, setTaxpayerInfo] = useState<{
    cuit: string
    razonSocial: string
    esRegular: boolean
  } | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [serviceData, setServiceData] = useState<{
    [key: string]: any
  }>({})

  const services = [
    {
      id: "linked-objects",
      title: "Inscripciones/Objetos",
      icon: TrendingUp,
      buttonVariant: "secondary" as const,
      endpoint: "/api/linked-objects",
      route: "/objetos-vinculados",
    },
    {
      id: "taxes-to-pay",
      title: "Impuestos a Pagar",
      icon: FileCheck,
      buttonVariant: "secondary" as const,
      endpoint: "/api/taxes-to-pay",
      route: "/impuestos-a-pagar",
    },
    {
      id: "payments",
      title: "Pagos",
      icon: CreditCard,
      buttonVariant: "secondary" as const,
      endpoint: "/api/payments",
      route: "/pagos",
    },
    {
      id: "payment-plans",
      title: "Planes de Pago",
      icon: Calendar,
      buttonVariant: "secondary" as const,
      endpoint: "/api/payment-plans",
      route: "/planes-de-pago",
    },
    {
      id: "fiscal-procedures",
      title: "Trámites Fiscales",
      icon: ClipboardList,
      buttonVariant: "default" as const,
      endpoint: "/api/fiscal-procedures",
      route: "/tramites-fiscales",
    },
  ]

  const handleServiceClick = async (service: (typeof services)[0]) => {
    // If service has a specific route, navigate to it
    if (service.route) {
      router.push(service.route)
      return
    }

    // Otherwise, call the API endpoint
    try {
      const response = await fetch(service.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service.id,
          timestamp: new Date().toISOString(),
          userId: user?.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Accediendo a: ${service.title}`)
      } else {
        alert("Error al acceder al servicio")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión")
    }
  }

  const handleCuitSearch = async () => {
    if (!cuit || cuit.length < 13) {
      alert("Por favor ingrese un CUIT válido")
      return
    }

    setSearchLoading(true)

    try {
      // Simular llamada a API para obtener razón social
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generar nombre ficticio basado en el CUIT
      const generateFicticiousName = (cuitValue: string) => {
        const nombres = ["MARTINEZ", "RODRIGUEZ", "GONZALEZ", "FERNANDEZ", "LOPEZ", "GARCIA", "PEREZ", "SANCHEZ"]
        const apellidos = [
          "JUAN CARLOS",
          "MARIA ELENA",
          "CARLOS ALBERTO",
          "ANA SOFIA",
          "LUIS MIGUEL",
          "PATRICIA",
          "ROBERTO",
          "SILVIA",
        ]
        const empresas = [
          "COMERCIAL",
          "INDUSTRIAL",
          "SERVICIOS",
          "CONSTRUCCIONES",
          "TRANSPORTES",
          "CONSULTORA",
          "INMOBILIARIA",
          "TECNOLOGIA",
        ]
        const sufijos = ["S.A.", "S.R.L.", "S.H.", "& ASOC.", "LTDA.", "& CIA.", "GROUP", "CORP."]

        const lastDigit = Number.parseInt(cuitValue.slice(-1))

        if (lastDigit % 2 === 0) {
          // Persona física
          const nombre = nombres[lastDigit % nombres.length]
          const apellido = apellidos[lastDigit % apellidos.length]
          return `${nombre} ${apellido}`
        } else {
          // Empresa
          const empresa = empresas[lastDigit % empresas.length]
          const sufijo = sufijos[lastDigit % sufijos.length]
          return `${empresa} DEL SUR ${sufijo}`
        }
      }

      const razonSocial = generateFicticiousName(cuit)
      const lastDigit = Number.parseInt(cuit.slice(-1))
      const esRegular = lastDigit % 3 !== 0 // Aproximadamente 2/3 serán regulares

      setTaxpayerInfo({
        cuit,
        razonSocial,
        esRegular,
      })

      // Generar datos ficticios basados en el CUIT
      const generateServiceData = (cuitValue: string) => {
        const seed = Number.parseInt(cuitValue.replace(/\D/g, "").slice(-4)) // Últimos 4 dígitos como semilla

        // Datos para Inscripciones/Objetos
        const automotores = Math.floor((seed * 0.1) % 8)
        const inmuebles = Math.floor((seed * 0.15) % 12) + 1
        const inscripciones = Math.floor((seed * 0.05) % 5)

        // Datos para Impuestos a Pagar
        const totalImpuestos = ((seed * 0.001) % 50000) + 5000 // Entre $5,000 y $55,000

        // Datos para Último Pago
        const fechas = ["15/11/2024", "28/10/2024", "12/11/2024", "05/11/2024", "22/10/2024", "18/11/2024"]
        const mediosPago = ["Débito Automático", "Transferencia", "Tarjeta de Crédito", "Efectivo", "Cheque"]
        const canales = ["Home Banking", "Cajero Automático", "Sucursal", "App Móvil", "Página Web"]

        const fechaIndex = seed % fechas.length
        const medioIndex = Math.floor(seed * 0.3) % mediosPago.length
        const canalIndex = Math.floor(seed * 0.7) % canales.length
        const importePago = ((seed * 0.002) % 25000) + 2000 // Entre $2,000 y $27,000

        // Datos para Planes de Pago
        const planesVigentes = Math.floor((seed * 0.08) % 4) // 0-3 planes
        const cuotasAdeudadas = planesVigentes > 0 ? Math.floor((seed * 0.12) % 8) + 1 : 0 // 1-8 cuotas si hay planes
        const montoAdeudado = cuotasAdeudadas > 0 ? ((seed * 0.003) % 30000) + 3000 : 0 // Entre $3,000 y $33,000

        // Próximo vencimiento (próximos 30 días)
        const diasHastaVencimiento = Math.floor((seed * 0.02) % 30) + 1
        const fechaVencimiento = new Date()
        fechaVencimiento.setDate(fechaVencimiento.getDate() + diasHastaVencimiento)
        const proximoVencimiento = fechaVencimiento.toLocaleDateString("es-AR")

        const importeProximaCuota = cuotasAdeudadas > 0 ? Math.floor(montoAdeudado / cuotasAdeudadas) : 0

        return {
          "linked-objects": {
            automotores,
            inmuebles,
            inscripciones,
            total: automotores + inmuebles + inscripciones,
          },
          "taxes-to-pay": {
            total: Math.round(totalImpuestos),
          },
          payments: {
            fecha: fechas[fechaIndex],
            importe: Math.round(importePago),
            medio: mediosPago[medioIndex],
            canal: canales[canalIndex],
          },
          "payment-plans": {
            planesVigentes,
            cuotasAdeudadas,
            montoAdeudado: Math.round(montoAdeudado),
            proximoVencimiento,
            importeProximaCuota: Math.round(importeProximaCuota),
          },
          "fiscal-procedures": {
            total: Math.floor((seed * 0.03) % 5), // 0-4
          },
        }
      }

      setServiceData(generateServiceData(cuit))
    } catch (error) {
      console.error("Error:", error)
      alert("Error al buscar contribuyente")
    } finally {
      setSearchLoading(false)
    }
  }

  const formatCuit = (value: string) => {
    // Remover caracteres no numéricos
    const numbers = value.replace(/\D/g, "")

    // Limitar a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11)

    // Formatear como XX-XXXXXXXX-X
    if (limitedNumbers.length <= 2) return limitedNumbers
    if (limitedNumbers.length <= 10) return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2)}`
    return `${limitedNumbers.slice(0, 2)}-${limitedNumbers.slice(2, 10)}-${limitedNumbers.slice(10, 11)}`
  }

  const handleCuitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCuit(e.target.value)
    setCuit(formatted)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleArcaLink = () => {
    // Simular apertura de link a ARCA
    window.open(`https://arca.afip.gob.ar/contribuyente/${cuit}`, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen mindfactory-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen mindfactory-bg">
      <Header />

      {/* Subtle floating geometric elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-cyan-400/10 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-4 h-4 border border-cyan-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-cyan-400/5 rotate-12 animate-pulse"></div>
      </div>

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* CUIT Search Section - Optimized */}
          <div className="mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 text-white min-w-0">
                  <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm font-medium">CUIT:</span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="XX-XXXXXXXX-X"
                    value={cuit}
                    onChange={handleCuitChange}
                    maxLength={13}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 h-9 text-sm w-32 font-mono"
                  />

                  <Button
                    onClick={handleCuitSearch}
                    disabled={searchLoading || !cuit || cuit.length < 13}
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-3 h-9 flex-shrink-0"
                  >
                    {searchLoading ? (
                      <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-3 h-3" />
                    )}
                  </Button>

                  {taxpayerInfo && (
                    <div className="flex items-center gap-3 ml-2">
                      <div className="text-white">
                        <span className="text-sm font-semibold text-cyan-400">{taxpayerInfo.razonSocial}</span>
                      </div>

                      <Badge
                        variant={taxpayerInfo.esRegular ? "default" : "destructive"}
                        className={
                          taxpayerInfo.esRegular
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }
                      >
                        {taxpayerInfo.esRegular ? "Regular" : "No Regular"}
                      </Badge>

                      <Button
                        onClick={handleArcaLink}
                        size="sm"
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-2 h-7 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        ARCA
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              const data = serviceData[service.id]

              return (
                <Card
                  key={service.id}
                  className="relative overflow-hidden mindfactory-card text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0 group"
                >
                  {/* Icon Circle - Smaller */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <IconComponent className="w-5 h-5 text-cyan-400" />
                  </div>

                  <CardHeader className="pb-2 pt-6 relative">
                    {/* Smaller title */}
                    <h2 className="text-lg font-bold leading-tight mb-2 text-white pr-12">{service.title}</h2>

                    {/* Totalizador específico por servicio */}
                    <div className="mb-3">
                      {service.id === "linked-objects" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300">Automotores:</span>
                            <span className="text-cyan-400 font-semibold">{data?.automotores ?? "-"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300">Inmuebles:</span>
                            <span className="text-cyan-400 font-semibold">{data?.inmuebles ?? "-"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300">Inscripciones:</span>
                            <span className="text-cyan-400 font-semibold">{data?.inscripciones ?? "-"}</span>
                          </div>
                          <div className="border-t border-slate-600 pt-1 mt-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-300">Total:</span>
                              <span className="text-xl font-bold text-cyan-400">{data?.total ?? "-"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {service.id === "taxes-to-pay" && (
                        <div className="text-center">
                          <div className="text-xs text-slate-300 mb-1">Total a Pagar</div>
                          <div className="text-xl font-bold text-cyan-400">
                            {data?.total ? formatCurrency(data.total) : "-"}
                          </div>
                        </div>
                      )}

                      {service.id === "payments" && (
                        <div className="space-y-1">
                          <div className="text-xs text-slate-300 mb-2">Último Pago:</div>
                          {data ? (
                            <>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300">Fecha:</span>
                                <span className="text-cyan-400 font-semibold">{data.fecha}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300">Importe:</span>
                                <span className="text-cyan-400 font-semibold">{formatCurrency(data.importe)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300">Medio:</span>
                                <span className="text-cyan-400 font-semibold text-right text-xs">{data.medio}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300">Canal:</span>
                                <span className="text-cyan-400 font-semibold text-right text-xs">{data.canal}</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-xl font-bold text-cyan-400">-</div>
                          )}
                        </div>
                      )}

                      {service.id === "payment-plans" && (
                        <div className="space-y-1">
                          {data ? (
                            <>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300">Planes Vigentes:</span>
                                <span className="text-cyan-400 font-semibold">{data.planesVigentes}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300">Cuotas Adeudadas:</span>
                                <span className="text-cyan-400 font-semibold">{data.cuotasAdeudadas}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300">Monto Adeudado:</span>
                                <span className="text-cyan-400 font-semibold">
                                  {data.montoAdeudado > 0 ? formatCurrency(data.montoAdeudado) : "-"}
                                </span>
                              </div>
                              {data.cuotasAdeudadas > 0 && (
                                <>
                                  <div className="border-t border-slate-600 pt-1 mt-2">
                                    <div className="text-xs text-slate-300 mb-1">Próximo Vencimiento:</div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-slate-300">Fecha:</span>
                                      <span className="text-cyan-400 font-semibold">{data.proximoVencimiento}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-slate-300">Importe:</span>
                                      <span className="text-cyan-400 font-semibold">
                                        {formatCurrency(data.importeProximaCuota)}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="text-center text-xl font-bold text-cyan-400">-</div>
                          )}
                        </div>
                      )}

                      {service.id === "fiscal-procedures" && (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-cyan-400">{data?.total ?? "-"}</span>
                          <span className="text-sm text-slate-300">en proceso</span>
                        </div>
                      )}
                    </div>

                    {/* Decorative line */}
                    <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300"></div>
                  </CardHeader>

                  <CardContent className="pt-4">
                    <Button
                      onClick={() => handleServiceClick(service)}
                      variant={service.buttonVariant}
                      className={`w-full font-semibold py-2 px-4 rounded-full transition-all duration-300 ${
                        service.buttonVariant === "default"
                          ? "bg-cyan-500 hover:bg-cyan-600 text-slate-900 shadow-lg hover:shadow-xl border-0"
                          : "bg-slate-600 hover:bg-slate-500 text-white shadow-lg hover:shadow-xl border-0"
                      }`}
                    >
                      Ver Detalle
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Help Section */}
          <div className="mt-16 text-center">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-cyan-500/10">
              <h3 className="text-xl font-semibold text-white mb-4">¿Necesitas ayuda?</h3>
              <p className="text-slate-300 mb-6">
                Nuestro equipo de soporte está disponible para asistirte con cualquier consulta.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-6 py-2 rounded-full"
                >
                  Contactar Soporte
                </Button>
                <Button
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-6 py-2 rounded-full"
                >
                  Ver Guías
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
