import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      "personal-data": "active",
      "linked-objects": "active",
      "taxes-to-pay": "active",
      payments: "active",
      auth: "active",
    },
    version: "2.0.0",
  })
}
