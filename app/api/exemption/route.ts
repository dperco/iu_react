import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp } = body

    console.log(`Service accessed: ${serviceId} at ${timestamp}`)

    // Mock exemption data
    const exemptionData = {
      serviceId,
      serviceName: "Exención adultos mayores o vulnerabilidad social",
      status: "success",
      data: {
        eligibilityCriteria: {
          adultosMayores: {
            minAge: 65,
            maxIncome: 180000,
            maxPropertyValue: 8000000,
          },
          vulnerabilidadSocial: {
            requiredDocumentation: [
              "Certificado de vulnerabilidad social",
              "Declaración jurada de ingresos",
              "Título de propiedad",
            ],
          },
        },
        applicationProcess: {
          steps: [
            "Verificar elegibilidad",
            "Completar formulario online",
            "Adjuntar documentación",
            "Enviar solicitud",
            "Seguimiento del trámite",
          ],
          estimatedProcessingTime: "30 días hábiles",
        },
        benefits: {
          exemptionPercentage: 100,
          applicableTaxes: ["ABL", "Territorial"],
        },
      },
      timestamp,
    }

    return NextResponse.json(exemptionData, { status: 200 })
  } catch (error) {
    console.error("Error in exemption API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Exención adultos mayores o vulnerabilidad social",
    description: "Consulta y solicitud de exenciones tributarias",
    status: "active",
  })
}
