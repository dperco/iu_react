"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Car, Home, Building, ArrowLeft, Download, Filter } from "lucide-react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"

// Tipos de datos
interface Automotor {
  id: string
  dominio: string
  marca: string
  modelo: string
  año: number
  tipo: string
  estado: "Activo" | "Baja" | "Transferido"
}

interface Inmueble {
  id: string
  nomenclatura: string
  superficie: number
  valorFiscal: number
  estado: "Activo" | "Exento" | "Baja"
}

interface ActividadEconomica {
  id: string
  numeroInscripcion: string // Add this line
  actividad: string
  fechaInicio: string
  estado: "Activa" | "Baja" | "Suspendida"
}

export default function ObjetosVinculadosPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("automotores")

  // Datos simulados
  const [automotores] = useState<Automotor[]>([
    {
      id: "1",
      dominio: "ABC123",
      marca: "Ford",
      modelo: "Focus",
      año: 2020,
      tipo: "Automóvil",
      estado: "Activo",
    },
    {
      id: "2",
      dominio: "DEF456",
      marca: "Toyota",
      modelo: "Corolla",
      año: 2019,
      tipo: "Automóvil",
      estado: "Activo",
    },
    {
      id: "3",
      dominio: "GHI789",
      marca: "Honda",
      modelo: "Civic",
      año: 2021,
      tipo: "Automóvil",
      estado: "Transferido",
    },
    {
      id: "4",
      dominio: "JKL012",
      marca: "Chevrolet",
      modelo: "Onix",
      año: 2018,
      tipo: "Automóvil",
      estado: "Activo",
    },
  ])

  const [inmuebles] = useState<Inmueble[]>([
    {
      id: "1",
      nomenclatura: "12-01-001-001",
      superficie: 250,
      valorFiscal: 2500000,
      estado: "Activo",
    },
    {
      id: "2",
      nomenclatura: "12-01-002-003",
      superficie: 180,
      valorFiscal: 1800000,
      estado: "Activo",
    },
    {
      id: "3",
      nomenclatura: "12-02-001-005",
      superficie: 320,
      valorFiscal: 3200000,
      estado: "Exento",
    },
    {
      id: "4",
      nomenclatura: "12-01-003-002",
      superficie: 150,
      valorFiscal: 1500000,
      estado: "Activo",
    },
    {
      id: "5",
      nomenclatura: "12-03-001-001",
      superficie: 400,
      valorFiscal: 4000000,
      estado: "Activo",
    },
  ])

  const [actividadesEconomicas] = useState<ActividadEconomica[]>([
    {
      id: "1",
      numeroInscripcion: "AE-2020-001234", // Add this line
      actividad: "Venta al por menor de productos alimenticios",
      fechaInicio: "15/03/2020",
      estado: "Activa",
    },
    {
      id: "2",
      numeroInscripcion: "AE-2019-005678", // Add this line
      actividad: "Servicios de consultoría empresarial",
      fechaInicio: "10/01/2019",
      estado: "Activa",
    },
    {
      id: "3",
      numeroInscripcion: "AE-2018-009012", // Add this line
      actividad: "Fabricación de productos textiles",
      fechaInicio: "22/08/2018",
      estado: "Suspendida",
    },
  ])

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Activo":
      case "Activa":
        return "default"
      case "Baja":
        return "destructive"
      case "Transferido":
      case "Suspendida":
        return "secondary"
      case "Exento":
        return "outline"
      default:
        return "secondary"
    }
  }

  const filteredAutomotores = automotores.filter(
    (auto) =>
      auto.dominio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auto.modelo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInmuebles = inmuebles.filter((inmueble) =>
    inmueble.nomenclatura.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredActividades = actividadesEconomicas.filter(
    (actividad) =>
      actividad.actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actividad.numeroInscripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen mindfactory-bg">
        <Header />
        <div className="flex items-center justify-center h-96">
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
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Objetos Vinculados</h1>
                <p className="text-slate-300">Gestión de automotores, inmuebles y actividades económicas</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <Card className="mindfactory-card border-0 shadow-xl mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por dominio, marca, nomenclatura o actividad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-cyan-500/10">
              <TabsTrigger
                value="automotores"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900"
              >
                <Car className="w-4 h-4 mr-2" />
                Automotores ({filteredAutomotores.length})
              </TabsTrigger>
              <TabsTrigger
                value="inmuebles"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900"
              >
                <Home className="w-4 h-4 mr-2" />
                Inmuebles ({filteredInmuebles.length})
              </TabsTrigger>
              <TabsTrigger
                value="actividades"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900"
              >
                <Building className="w-4 h-4 mr-2" />
                Actividades Económicas ({filteredActividades.length})
              </TabsTrigger>
            </TabsList>

            {/* Automotores Tab */}
            <TabsContent value="automotores">
              <Card className="mindfactory-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-cyan-400" />
                    Automotores Registrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800/50">
                          <TableHead className="text-slate-300">Dominio</TableHead>
                          <TableHead className="text-slate-300">Marca</TableHead>
                          <TableHead className="text-slate-300">Modelo</TableHead>
                          <TableHead className="text-slate-300">Año</TableHead>
                          <TableHead className="text-slate-300">Tipo</TableHead>
                          <TableHead className="text-slate-300">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAutomotores.map((auto) => (
                          <TableRow key={auto.id} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell className="text-white font-medium">{auto.dominio}</TableCell>
                            <TableCell className="text-slate-300">{auto.marca}</TableCell>
                            <TableCell className="text-slate-300">{auto.modelo}</TableCell>
                            <TableCell className="text-slate-300">{auto.año}</TableCell>
                            <TableCell className="text-slate-300">{auto.tipo}</TableCell>
                            <TableCell>
                              <Badge variant={getEstadoBadgeVariant(auto.estado)}>{auto.estado}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inmuebles Tab */}
            <TabsContent value="inmuebles">
              <Card className="mindfactory-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Home className="w-5 h-5 text-cyan-400" />
                    Inmuebles Registrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800/50">
                          <TableHead className="text-slate-300">Nomenclatura</TableHead>
                          <TableHead className="text-slate-300">Superficie (m²)</TableHead>
                          <TableHead className="text-slate-300">Valor Fiscal</TableHead>
                          <TableHead className="text-slate-300">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInmuebles.map((inmueble) => (
                          <TableRow key={inmueble.id} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell className="text-white font-medium">{inmueble.nomenclatura}</TableCell>
                            <TableCell className="text-slate-300">{inmueble.superficie.toLocaleString()}</TableCell>
                            <TableCell className="text-slate-300">{formatCurrency(inmueble.valorFiscal)}</TableCell>
                            <TableCell>
                              <Badge variant={getEstadoBadgeVariant(inmueble.estado)}>{inmueble.estado}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Actividades Económicas Tab */}
            <TabsContent value="actividades">
              <Card className="mindfactory-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-cyan-400" />
                    Actividades Económicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800/50">
                          <TableHead className="text-slate-300">Nro. de Inscripción</TableHead>
                          <TableHead className="text-slate-300">Actividad</TableHead>
                          <TableHead className="text-slate-300">Fecha de Inicio</TableHead>
                          <TableHead className="text-slate-300">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActividades.map((actividad) => (
                          <TableRow key={actividad.id} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell className="text-white font-medium">{actividad.numeroInscripcion}</TableCell>
                            <TableCell className="text-white font-medium">{actividad.actividad}</TableCell>
                            <TableCell className="text-slate-300">{actividad.fechaInicio}</TableCell>
                            <TableCell>
                              <Badge variant={getEstadoBadgeVariant(actividad.estado)}>{actividad.estado}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="mindfactory-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Total Automotores</p>
                    <p className="text-2xl font-bold text-cyan-400">{automotores.length}</p>
                  </div>
                  <Car className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="mindfactory-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Total Inmuebles</p>
                    <p className="text-2xl font-bold text-cyan-400">{inmuebles.length}</p>
                  </div>
                  <Home className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="mindfactory-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Actividades Económicas</p>
                    <p className="text-2xl font-bold text-cyan-400">{actividadesEconomicas.length}</p>
                  </div>
                  <Building className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
