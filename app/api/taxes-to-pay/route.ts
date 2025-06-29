import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp } = body

    console.log(`Service accessed: ${serviceId} at ${timestamp}`)

    // Mock taxes to pay data
    const taxesData = {
      serviceId,
      serviceName: "Impuestos a pagar",
      status: "success",
      data: {
        pendingTaxes: [
          {
            id: "ABL-2024-03",
            impuesto: "ABL",
            periodo: "Marzo 2024",
            monto: 15750.5,
            vencimiento: "2024-03-20",
            estado: "Pendiente",
            recargo: 0,
          },
          {
            id: "IB-2024-02",
            impuesto: "Ingresos Brutos",
            periodo: "Febrero 2024",
            monto: 8420.75,
            vencimiento: "2024-03-15",
            estado: "Vencido",
            recargo: 842.08,
          },
        ],
        upcomingPayments: [
          {
            id: "ABL-2024-04",
            impuesto: "ABL",
            periodo: "Abril 2024",
            monto: 15750.5,
            vencimiento: "2024-04-20",
            estado: "Próximo",
          },
        ],
        totalPending: 25013.33,
        totalWithSurcharges: 25855.41,
      },
      timestamp,
    }

    return NextResponse.json(taxesData, { status: 200 })
  } catch (error) {
    console.error("Error in taxes-to-pay API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Impuestos a pagar",
    description: "Consulta de impuestos pendientes y vencimientos",
    status: "active",
  })
}
