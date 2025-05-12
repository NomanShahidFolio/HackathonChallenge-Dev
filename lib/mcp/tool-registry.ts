import { z } from "zod"

// Define the tool schema
export const ToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.any(), // This would typically be a Zod schema
  execute: z.function().args(z.any()).returns(z.promise(z.any())),
})

export type Tool = z.infer<typeof ToolSchema>

// Tool registry to store registered tools
class ToolRegistry {
  private tools: Map<string, Tool> = new Map()

  register(tool: Tool): void {
    this.tools.set(tool.name, tool)
  }

  deregister(toolName: string): boolean {
    return this.tools.delete(toolName)
  }

  getTool(toolName: string): Tool | undefined {
    return this.tools.get(toolName)
  }

  listTools(): Tool[] {
    return Array.from(this.tools.values())
  }

  getToolsByCategory(category: string): Tool[] {
    return this.listTools().filter((tool) => tool.name.toLowerCase().includes(category.toLowerCase()))
  }
}

// Create a singleton instance of the registry
export const toolRegistry = new ToolRegistry()

// Initialize with GitHub tools
import { GitHubTool } from "@/lib/tools/github-tool"
toolRegistry.register(GitHubTool)
