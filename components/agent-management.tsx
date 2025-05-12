"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Slack, BugIcon as Jira, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Agent = {
  id: string
  name: string
  description: string
  icon: JSX.Element
  active: boolean
  config: Record<string, string>
}

export default function AgentManagement() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "github",
      name: "GitHub Agent",
      description: "Interacts with GitHub repositories, PRs, and issues",
      icon: <GitHubLogoIcon className="h-5 w-5" />,
      active: true,
      config: {
        GITHUB_TOKEN: "••••••••••••••••",
        GITHUB_USERNAME: "user",
        DEFAULT_REPO: "user/repo",
      },
    },
  ])

  const [open, setOpen] = useState(false)
  const [agentType, setAgentType] = useState("github")

  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map((agent) => (agent.id === id ? { ...agent, active: !agent.active } : agent)))
  }

  const removeAgent = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id))
  }

  const addAgent = (type: string, name: string, description: string, config: Record<string, string>) => {
    const newAgent: Agent = {
      id: type + Date.now(),
      name,
      description,
      icon:
        type === "github" ? (
          <GitHubLogoIcon className="h-5 w-5" />
        ) : type === "slack" ? (
          <Slack className="h-5 w-5" />
        ) : (
          <Jira className="h-5 w-5" />
        ),
      active: true,
      config,
    }

    setAgents([...agents, newAgent])
    setOpen(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Registered Agents</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Register New Agent</DialogTitle>
              <DialogDescription>Configure a new agent to add to your AgentDock</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="github" onValueChange={setAgentType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="slack">Slack</TabsTrigger>
                <TabsTrigger value="jira">Jira</TabsTrigger>
              </TabsList>

              <TabsContent value="github" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input id="name" defaultValue="GitHub Agent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue="Interacts with GitHub repositories, PRs, and issues" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token">GitHub Token</Label>
                  <Input id="token" type="password" placeholder="ghp_..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">GitHub Username</Label>
                  <Input id="username" placeholder="username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo">Default Repository</Label>
                  <Input id="repo" placeholder="username/repository" />
                </div>
              </TabsContent>

              <TabsContent value="slack" className="space-y-4 py-4">
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Slack agent configuration coming soon
                </div>
              </TabsContent>

              <TabsContent value="jira" className="space-y-4 py-4">
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Jira agent configuration coming soon
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addAgent(agentType, "GitHub Agent", "Interacts with GitHub repositories, PRs, and issues", {
                    GITHUB_TOKEN: "••••••••••••••••",
                    GITHUB_USERNAME: "user",
                    DEFAULT_REPO: "user/repo",
                  })
                }}
              >
                Register Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {agent.icon}
                <CardTitle className="text-xl">{agent.name}</CardTitle>
              </div>
              <Badge variant={agent.active ? "default" : "outline"}>{agent.active ? "Active" : "Inactive"}</Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">{agent.description}</CardDescription>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Configuration</h4>
                <div className="rounded-md bg-muted p-3">
                  {Object.entries(agent.config).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={agent.active}
                  onCheckedChange={() => toggleAgentStatus(agent.id)}
                  id={`switch-${agent.id}`}
                />
                <Label htmlFor={`switch-${agent.id}`}>{agent.active ? "Enabled" : "Disabled"}</Label>
              </div>
              <Button variant="outline" size="icon" onClick={() => removeAgent(agent.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
