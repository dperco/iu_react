import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp } = body

    console.log(`Service accessed: ${serviceId} at ${timestamp}`)

    // Mock personal data
    const personalData = {
      serviceId,
      serviceName: "Datos personales",
      status: "success",
      data: {
        personalInfo: {
          nombre: "Juan Carlos",
          apellido: "González",
          dni: "12345678",
          cuit: "20-12345678-9",
          email: "juan.gonzalez@email.com",
          telefono: "+54 11 1234-5678",
          domicilio: "Av. Corrientes 1234, CABA",
        },
        fiscalStatus: {
          categoria: "Responsable Inscripto",
          condicionIVA: "Responsable Inscripto",
          ultimaActualizacion: "2024-01-15",
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
        },
      },
      timestamp,
    }

    return NextResponse.json(personalData, { status: 200 })
  } catch (error) {
    console.error("Error in personal-data API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Datos personales",
    description: "Gestión de información personal del contribuyente",
    status: "active",
  })
}
