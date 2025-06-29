import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp } = body

    // Simulate database logging
    console.log(`Service accessed: ${serviceId} at ${timestamp}`)

    // Mock rental values data
    const rentalData = {
      serviceId,
      serviceName: "Valores de referencia en alquileres",
      status: "success",
      data: {
        averageRentalValues: {
          CABA: {
            "1_bedroom": 45000,
            "2_bedroom": 65000,
            "3_bedroom": 85000,
          },
          GBA: {
            "1_bedroom": 35000,
            "2_bedroom": 50000,
            "3_bedroom": 70000,
          },
        },
        lastUpdated: new Date().toISOString(),
        taxRates: {
          sellos: 0.012,
          ingresosBrutos: 0.015,
        },
      },
      timestamp,
    }

    return NextResponse.json(rentalData, { status: 200 })
  } catch (error) {
    console.error("Error in rental-values API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Valores de referencia en alquileres",
    description: "Consulta valores de referencia para liquidación de impuestos",
    status: "active",
  })
}
