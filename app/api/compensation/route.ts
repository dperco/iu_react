import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp } = body

    console.log(`Service accessed: ${serviceId} at ${timestamp}`)

    // Mock compensation data
    const compensationData = {
      serviceId,
      serviceName: "Compensación",
      status: "success",
      data: {
        availableCredit: 15750.5,
        pendingPayments: [
          {
            id: "IB-2024-001",
            description: "Ingresos Brutos - Cuota 1/2024",
            amount: 8500.0,
            dueDate: "2024-03-15",
          },
          {
            id: "SEL-2024-002",
            description: "Sellos - Contrato Alquiler",
            amount: 4200.0,
            dueDate: "2024-03-20",
          },
        ],
        compensationHistory: [
          {
            date: "2024-02-15",
            amount: 5000.0,
            appliedTo: "Ingresos Brutos - Cuota 12/2023",
          },
        ],
      },
      timestamp,
    }

    return NextResponse.json(compensationData, { status: 200 })
  } catch (error) {
    console.error("Error in compensation API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Compensación",
    description: "Gestión de créditos a favor y compensaciones",
    status: "active",
  })
}
