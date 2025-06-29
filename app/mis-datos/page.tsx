"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { User, Mail, MapPin, Edit, ArrowLeft, Phone, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function MisDatosPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleEdit = (section: string) => {
    alert(`Editando ${section}...`)
  }

  const handleAdd = (item: string) => {
    alert(`Agregando ${item}...`)
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
              Mi <span className="text-cyan-400">Perfil</span>
            </h1>
            <p className="text-slate-300 mt-2">Gestiona tu información personal y de contacto</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mindfactory-card text-white border-0 sticky top-24">
                <CardContent className="p-6">
                  {/* User Avatar */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">{user?.name || "Usuario"}</h2>
                    <p className="text-cyan-400 text-sm">20214952050</p>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Datos</span>
                    </button>
                    <button
                      onClick={() => router.push("/notificaciones")}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Notificaciones</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Contact Data Section */}
              <Card className="mindfactory-card text-white border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                    <Phone className="w-6 h-6 text-cyan-400" />
                    <span>Datos de contacto</span>
                  </CardTitle>
                  <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-24"></div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Phone Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Teléfono</h3>
                      <Button
                        onClick={() => handleAdd("otro teléfono")}
                        variant="outline"
                        size="sm"
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar otro teléfono
                      </Button>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Fijo</p>
                          <p className="text-white font-medium text-lg">3514807568</p>
                        </div>
                        <Button
                          onClick={() => handleEdit("teléfono")}
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Correo electrónico</h3>
                      <Button
                        onClick={() => handleAdd("otro correo electrónico")}
                        variant="outline"
                        size="sm"
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar otro correo electrónico
                      </Button>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 border-dashed">
                      <p className="text-slate-400 text-center py-4">No hay correos electrónicos registrados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fiscal Address Section */}
              <Card className="mindfactory-card text-white border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                        <MapPin className="w-6 h-6 text-cyan-400" />
                        <span>Domicilio Fiscal</span>
                      </CardTitle>
                      <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 w-24 mt-2"></div>
                    </div>
                    <Button
                      onClick={() => handleEdit("domicilio fiscal")}
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Calle</p>
                        <p className="text-white font-medium">Ciudad De Tampa</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Número</p>
                        <p className="text-white font-medium">2233</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Piso</p>
                        <p className="text-slate-300">-</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Departamento</p>
                        <p className="text-slate-300">-</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Barrio</p>
                        <p className="text-white font-medium">Villa Cabrera</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Código postal</p>
                        <p className="text-white font-medium">5009</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Provincia</p>
                        <p className="text-white font-medium">Córdoba</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Localidad</p>
                        <p className="text-white font-medium">Córdoba</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-8 py-3 rounded-full"
                >
                  Guardar Cambios
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 rounded-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
