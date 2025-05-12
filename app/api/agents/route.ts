import { NextResponse } from "next/server"

// This is a mock API for agent management
// In a real application, this would interact with a database

// Mock data
const agents = [
  {
    id: "github",
    name: "GitHub Agent",
    description: "Interacts with GitHub repositories, PRs, and issues",
    active: true,
    config: {
      GITHUB_TOKEN: "••••••••••••••••",
      GITHUB_USERNAME: "user",
      DEFAULT_REPO: "user/repo",
    },
  },
]

export async function GET() {
  return NextResponse.json({ agents })
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Validate required fields
    if (!data.name || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a new agent
    const newAgent = {
      id: data.id || `agent-${Date.now()}`,
      name: data.name,
      description: data.description,
      active: data.active !== undefined ? data.active : true,
      config: data.config || {},
    }

    // In a real app, this would save to a database
    agents.push(newAgent)

    return NextResponse.json({ agent: newAgent }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
