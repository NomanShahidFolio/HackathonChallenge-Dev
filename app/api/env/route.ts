import { NextResponse } from "next/server"

// This is a mock API for environment variables
// In a real application, this would interact with a database or environment variable service

// Mock data - in a real app, this would be stored securely
const environmentVariables = [
  {
    id: "1",
    key: "AGENT_GROQ_KEY",
    value: "••••••••••••••••", // Masked for security
    category: "agent",
    isSecret: true,
  },
  {
    id: "2",
    key: "GITHUB_TOKEN",
    value: "", // Empty until set by user
    category: "integration",
    isSecret: true,
  },
]

export async function GET() {
  // In a real app, you would mask secret values before returning
  const maskedVariables = environmentVariables.map((variable) => {
    if (variable.isSecret && variable.value) {
      return {
        ...variable,
        value: "••••••••••••••••",
      }
    }
    return variable
  })

  return NextResponse.json({ variables: maskedVariables })
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Validate required fields
    if (!data.key || !data.value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a new environment variable
    const newVariable = {
      id: Date.now().toString(),
      key: data.key,
      value: data.value,
      category: data.category || "integration",
      isSecret: data.isSecret !== undefined ? data.isSecret : true,
    }

    // In a real app, this would save to a database or environment variable service
    environmentVariables.push(newVariable)

    // Return a masked version for security
    const maskedVariable = {
      ...newVariable,
      value: newVariable.isSecret ? "••••••••••••••••" : newVariable.value,
    }

    return NextResponse.json({ variable: maskedVariable }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create environment variable" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()

    // Validate required fields
    if (!data.id || !data.value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find and update the environment variable
    const index = environmentVariables.findIndex((v) => v.id === data.id)

    if (index === -1) {
      return NextResponse.json({ error: "Environment variable not found" }, { status: 404 })
    }

    environmentVariables[index].value = data.value

    // Return a masked version for security
    const maskedVariable = {
      ...environmentVariables[index],
      value: environmentVariables[index].isSecret ? "••••••••••••••••" : environmentVariables[index].value,
    }

    return NextResponse.json({ variable: maskedVariable })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update environment variable" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }

    // Find and remove the environment variable
    const index = environmentVariables.findIndex((v) => v.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Environment variable not found" }, { status: 404 })
    }

    environmentVariables.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete environment variable" }, { status: 500 })
  }
}
