import { StreamingTextResponse, type Message } from "ai"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { messages } = body

    // Create a simple system message
    const systemMessage =
      "You are a helpful assistant that can answer questions about GitHub and other developer tools."

    // Prepend the system message to the messages array
    const augmentedMessages: Message[] = [{ id: "system", role: "system", content: systemMessage }, ...messages]

    // Check if we have the Groq API key
    if (!process.env.AGENT_GROQ_KEY) {
      return new Response(JSON.stringify({ error: "Missing AGENT_GROQ_KEY environment variable" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Use the AI SDK to generate a response - without any tools for now
    const response = await streamText({
      model: groq("llama3-8b-8192", {
        apiKey: process.env.AGENT_GROQ_KEY,
      }),
      messages: augmentedMessages,
    })

    // Return the streaming response
    return new StreamingTextResponse(response.textStream)
  } catch (error) {
    console.error("Chat API error:", error)

    // Return a detailed error response
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message || "Unknown error",
        stack: error.stack || "No stack trace available",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
