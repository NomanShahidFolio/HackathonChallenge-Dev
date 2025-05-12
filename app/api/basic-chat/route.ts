import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { messages } = body

    // Check if we have the Groq API key
    const apiKey = process.env.AGENT_GROQ_KEY
    if (!apiKey) {
      console.error("Missing AGENT_GROQ_KEY environment variable")
      return NextResponse.json({ error: "Missing API key" }, { status: 500 })
    }

    console.log("Using Groq API key:", apiKey.substring(0, 5) + "...")
    console.log("Messages:", JSON.stringify(messages))

    // Format messages for Groq API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add system message
    formattedMessages.unshift({
      role: "system",
      content: "You are a helpful assistant that answers questions concisely.",
    })

    try {
      // Make direct request to Groq API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Groq API error:", errorData)
        return NextResponse.json(
          { error: `Groq API error: ${errorData.error?.message || response.statusText}` },
          { status: response.status },
        )
      }

      const data = await response.json()
      console.log("Groq API response:", data)

      // Return the response
      return NextResponse.json({
        role: "assistant",
        content: data.choices[0].message.content,
      })
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json({ error: `Fetch error: ${fetchError.message}` }, { status: 500 })
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: `API route error: ${error.message}` }, { status: 500 })
  }
}
