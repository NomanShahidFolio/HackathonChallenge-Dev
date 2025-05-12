import { NextResponse } from "next/server"

// This is a mock API for agent logs
// In a real application, this would interact with a database

// Mock data
const logs = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    agent: "github",
    action: "Summarize PR #123",
    status: "success",
    details: "Successfully summarized PR #123 in repository user/repo",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    agent: "github",
    action: "List open issues",
    status: "success",
    details: "Retrieved 5 open issues from repository user/repo",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    agent: "github",
    action: "Comment on issue #45",
    status: "error",
    details: "Failed to comment: Permission denied",
  },
]

export async function GET() {
  return NextResponse.json({ logs })
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Validate required fields
    if (!data.agent || !data.action || !data.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a new log entry
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      agent: data.agent,
      action: data.action,
      status: data.status,
      details: data.details || "",
    }

    // In a real app, this would save to a database
    logs.unshift(newLog)

    return NextResponse.json({ log: newLog }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create log entry" }, { status: 500 })
  }
}
