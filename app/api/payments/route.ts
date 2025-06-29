import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp } = body

    console.log(`Service accessed: ${serviceId} at ${timestamp}`)

    // Mock payments data
    const paymentsData = {
      serviceId,
      serviceName: "Pagos",
      status: "success",
      data: {
        availablePaymentMethods: [
          {
            id: "tarjeta",
            nombre: "Tarjeta de Crédito/Débito",
            disponible: true,
            comision: 2.5,
          },
          {
            id: "transferencia",
            nombre: "Transferencia Bancaria",
            disponible: true,
            comision: 0,
          },
          {
            id: "rapipago",
            nombre: "Rapipago/Pago Fácil",
            disponible: true,
            comision: 1.5,
          },
        ],
        recentPayments: [
          {
            id: "PAY-2024-001",
            fecha: "2024-02-15",
            impuesto: "ABL",
            periodo: "Febrero 2024",
            monto: 15750.5,
            metodo: "Tarjeta de Crédito",
            estado: "Aprobado",
          },
          {
            id: "PAY-2024-002",
            fecha: "2024-01-20",
            impuesto: "Ingresos Brutos",
            periodo: "Enero 2024",
            monto: 8420.75,
            metodo: "Transferencia",
            estado: "Aprobado",
          },
        ],
        totalPaidThisYear: 48342.75,
        pendingPayments: 2,
      },
      timestamp,
    }

    return NextResponse.json(paymentsData, { status: 200 })
  } catch (error) {
    console.error("Error in payments API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Pagos",
    description: "Gestión de pagos y métodos de pago",
    status: "active",
  })
}
