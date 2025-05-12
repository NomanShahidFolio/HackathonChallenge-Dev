import { z } from "zod"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Define the agent schema
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  systemPrompt: z.string(),
  tools: z.array(z.any()).optional(),
  model: z.string().default("llama3-8b-8192"),
  active: z.boolean().default(true),
})

export type Agent = z.infer<typeof AgentSchema>

// Agent registry to store registered agents
class AgentRegistry {
  private agents: Map<string, Agent> = new Map()

  register(agent: Agent): void {
    this.agents.set(agent.id, agent)
  }

  deregister(agentId: string): boolean {
    return this.agents.delete(agentId)
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId)
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values())
  }
}

// Create a singleton instance of the registry
export const agentRegistry = new AgentRegistry()

// Initialize with the GitHub agent
agentRegistry.register({
  id: "github",
  name: "GitHub Agent",
  description: "Interacts with GitHub repositories, PRs, and issues",
  systemPrompt: `You are a GitHub agent that can help users interact with GitHub repositories.
You can summarize PRs, list issues, check repository status, and more.
Always respond in a helpful and concise manner.`,
  tools: [], // Will be populated with GitHub tools
  model: "llama3-8b-8192",
  active: true,
})

// MCP Agent Server
export class MCPAgentServer {
  async processQuery(agentId: string, query: string, tools: any[] = []) {
    try {
      const agent = agentRegistry.getAgent(agentId)

      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`)
      }

      if (!agent.active) {
        throw new Error(`Agent with ID ${agentId} is not active`)
      }

      // Log the query
      this.logAgentActivity(agentId, `Process query: ${query.substring(0, 50)}...`, "pending")

      try {
        // Use the AI SDK to process the query with the environment variable
        const response = await generateText({
          model: groq(agent.model, {
            apiKey: process.env.AGENT_GROQ_KEY,
          }),
          messages: [
            { role: "system", content: agent.systemPrompt },
            { role: "user", content: query },
          ],
          tools: tools.length > 0 ? tools : undefined,
          maxSteps: 3, // Allow up to 3 tool calls
        })

        // Log success
        this.logAgentActivity(agentId, `Process query: ${query.substring(0, 50)}...`, "success")

        return response.text
      } catch (aiError) {
        // Log error
        this.logAgentActivity(
          agentId,
          `Process query: ${query.substring(0, 50)}...`,
          "error",
          `AI error: ${aiError.message || "Unknown AI error"}`,
        )

        throw aiError
      }
    } catch (error) {
      console.error("MCP Agent Server error:", error)
      throw error
    }
  }

  private logAgentActivity(agentId: string, action: string, status: "success" | "error" | "pending", details = "") {
    // In a real app, this would save to a database
    console.log(
      `[${new Date().toISOString()}] Agent ${agentId}: ${action} - ${status} ${details ? "- " + details : ""}`,
    )

    // Here you would typically call an API to store the log
    // For demo purposes, we're just logging to console
  }
}

// Create a singleton instance of the MCP Agent Server
export const mcpAgentServer = new MCPAgentServer()
