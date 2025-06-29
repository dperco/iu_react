import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, timestamp, userId } = body

    console.log(`Fiscal procedure service accessed: ${serviceId} at ${timestamp} by user ${userId}`)

    // Mock fiscal procedures data
    const fiscalProceduresData = {
      serviceId,
      serviceName: "Iniciar Trámite Fiscal",
      status: "success",
      data: {
        availableProcedures: [
          {
            id: "exencion-abl",
            title: "Solicitud de Exención ABL",
            description: "Solicitar exención del impuesto ABL por adultos mayores o vulnerabilidad social",
            category: "Exenciones",
            estimatedTime: "15-30 días hábiles",
            requirements: [
              "DNI del solicitante",
              "Certificado de ingresos",
              "Título de propiedad",
              "Certificado de discapacidad (si corresponde)",
            ],
            status: "available",
            complexity: "medium",
          },
          {
            id: "plan-pago",
            title: "Plan de Pagos",
            description: "Solicitar un plan de pagos para regularizar deudas tributarias",
            category: "Facilidades de Pago",
            estimatedTime: "5-10 días hábiles",
            requirements: ["Constancia de deuda", "Declaración jurada de ingresos", "Propuesta de pago"],
            status: "available",
            complexity: "low",
          },
          {
            id: "cambio-domicilio",
            title: "Cambio de Domicilio Fiscal",
            description: "Actualizar el domicilio fiscal registrado en el padrón tributario",
            category: "Actualización de Datos",
            estimatedTime: "3-5 días hábiles",
            requirements: ["Comprobante de domicilio", "DNI actualizado", "Formulario de cambio de domicilio"],
            status: "available",
            complexity: "low",
          },
          {
            id: "baja-actividad",
            title: "Baja de Actividad Comercial",
            description: "Dar de baja una actividad comercial o industrial registrada",
            category: "Comercio e Industria",
            estimatedTime: "10-15 días hábiles",
            requirements: ["Certificado de no deuda", "Formulario de baja", "Documentación de cese de actividad"],
            status: "available",
            complexity: "high",
          },
          {
            id: "reclamo-valuacion",
            title: "Reclamo de Valuación",
            description: "Impugnar la valuación fiscal de un inmueble",
            category: "Reclamos",
            estimatedTime: "30-45 días hábiles",
            requirements: ["Tasación profesional", "Documentación del inmueble", "Fundamentos técnicos del reclamo"],
            status: "available",
            complexity: "high",
          },
          {
            id: "certificado-libre-deuda",
            title: "Certificado Libre de Deuda",
            description: "Obtener certificado de libre deuda tributaria",
            category: "Certificaciones",
            estimatedTime: "1-3 días hábiles",
            requirements: ["Solicitud formal", "Identificación del contribuyente", "Especificación del período"],
            status: "available",
            complexity: "low",
          },
        ],
        categories: [
          { id: "exenciones", name: "Exenciones", count: 1 },
          { id: "facilidades", name: "Facilidades de Pago", count: 1 },
          { id: "actualizacion", name: "Actualización de Datos", count: 1 },
          { id: "comercio", name: "Comercio e Industria", count: 1 },
          { id: "reclamos", name: "Reclamos", count: 1 },
          { id: "certificaciones", name: "Certificaciones", count: 1 },
        ],
        recentProcedures: [
          {
            id: "PROC-2024-001",
            title: "Plan de Pagos - ABL",
            status: "En proceso",
            submittedDate: "2024-03-10",
            estimatedCompletion: "2024-03-20",
          },
          {
            id: "PROC-2024-002",
            title: "Certificado Libre de Deuda",
            status: "Completado",
            submittedDate: "2024-03-05",
            completedDate: "2024-03-07",
          },
        ],
        digitalSignatureEnabled: true,
        supportContact: {
          phone: "0800-555-FISCO",
          email: "tramites@fiscalportal.gov.ar",
          hours: "Lunes a Viernes 8:00 - 18:00",
        },
      },
      timestamp,
    }

    return NextResponse.json(fiscalProceduresData, { status: 200 })
  } catch (error) {
    console.error("Error in fiscal-procedures API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Iniciar Trámite Fiscal",
    description: "Gestión digital de trámites ante organismos fiscales",
    status: "active",
    availableProcedures: 6,
    digitalProcessing: true,
  })
}
