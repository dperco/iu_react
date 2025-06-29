import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp } = body

    console.log(`Service accessed: ${serviceId} at ${timestamp}`)

    // Mock linked objects data
    const linkedObjectsData = {
      serviceId,
      serviceName: "Objetos Vinculados",
      status: "success",
      data: {
        properties: [
          {
            id: "PROP-001",
            tipo: "Departamento",
            direccion: "Av. Santa Fe 2500, CABA",
            superficie: "85 m²",
            valuacionFiscal: 12500000,
            estado: "Activo",
          },
          {
            id: "PROP-002",
            tipo: "Casa",
            direccion: "Calle Falsa 123, San Isidro",
            superficie: "150 m²",
            valuacionFiscal: 18750000,
            estado: "Activo",
          },
        ],
        vehicles: [
          {
            id: "VEH-001",
            marca: "Toyota",
            modelo: "Corolla",
            año: 2020,
            dominio: "ABC123",
            estado: "Activo",
          },
        ],
        totalObjects: 3,
        lastUpdate: "2024-02-20",
      },
      timestamp,
    }

    return NextResponse.json(linkedObjectsData, { status: 200 })
  } catch (error) {
    console.error("Error in linked-objects API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Objetos Vinculados",
    description: "Consulta de propiedades y bienes registrados",
    status: "active",
  })
}
