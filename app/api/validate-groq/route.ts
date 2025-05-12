import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.AGENT_GROQ_KEY

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: "API key not found" }, { status: 400 })
    }

    // Make a simple request to Groq API to validate the key
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { valid: false, error: errorData.error?.message || response.statusText },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({ valid: true, models: data.data.length })
  } catch (error) {
    console.error("Validate Groq API error:", error)
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 })
  }
}
