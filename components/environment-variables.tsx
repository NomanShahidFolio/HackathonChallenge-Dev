"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

type EnvironmentVariable = {
  id: string
  key: string
  value: string
  category: "agent" | "integration" | "system"
  isSecret: boolean
}

export default function EnvironmentVariables() {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([
    {
      id: "1",
      key: "AGENT_GROQ_KEY",
      value: "••••••••••••••••",
      category: "agent",
      isSecret: true,
    },
    {
      id: "2",
      key: "GITHUB_TOKEN",
      value: "",
      category: "integration",
      isSecret: true,
    },
  ])

  const [newVariable, setNewVariable] = useState({
    key: "",
    value: "",
    category: "integration" as const,
    isSecret: true,
  })

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("all")

  const toggleShowSecret = (id: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddVariable = () => {
    if (!newVariable.key || !newVariable.value) {
      toast({
        title: "Error",
        description: "Key and value are required",
        variant: "destructive",
      })
      return
    }

    setVariables([
      ...variables,
      {
        id: Date.now().toString(),
        ...newVariable,
      },
    ])

    setNewVariable({
      key: "",
      value: "",
      category: "integration",
      isSecret: true,
    })

    toast({
      title: "Success",
      description: `Environment variable ${newVariable.key} added`,
    })
  }

  const handleRemoveVariable = (id: string) => {
    setVariables(variables.filter((variable) => variable.id !== id))
    toast({
      title: "Success",
      description: "Environment variable removed",
    })
  }

  const handleUpdateVariable = (id: string, value: string) => {
    setVariables(variables.map((variable) => (variable.id === id ? { ...variable, value } : variable)))
  }

  const filteredVariables =
    activeTab === "all" ? variables : variables.filter((variable) => variable.category === activeTab)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Manage environment variables for your agents and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {filteredVariables.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No environment variables found</div>
                  ) : (
                    filteredVariables.map((variable) => (
                      <div key={variable.id} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <Label htmlFor={`var-${variable.id}`}>{variable.key}</Label>
                          <div className="flex items-center mt-1">
                            <Input
                              id={`var-${variable.id}`}
                              type={showSecrets[variable.id] || !variable.isSecret ? "text" : "password"}
                              value={variable.value}
                              onChange={(e) => handleUpdateVariable(variable.id, e.target.value)}
                              className="flex-1"
                            />
                            {variable.isSecret && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleShowSecret(variable.id)}
                                className="ml-2"
                              >
                                {showSecrets[variable.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {variable.category}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveVariable(variable.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div>
                  <Label htmlFor="new-var-key">Key</Label>
                  <Input
                    id="new-var-key"
                    value={newVariable.key}
                    onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                    placeholder="VARIABLE_NAME"
                  />
                </div>
                <div>
                  <Label htmlFor="new-var-value">Value</Label>
                  <Input
                    id="new-var-value"
                    type={newVariable.isSecret ? "password" : "text"}
                    value={newVariable.value}
                    onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                    placeholder="value"
                  />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="new-var-category">Category:</Label>
                  <select
                    id="new-var-category"
                    value={newVariable.category}
                    onChange={(e) =>
                      setNewVariable({
                        ...newVariable,
                        category: e.target.value as "agent" | "integration" | "system",
                      })
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="agent">Agent</option>
                    <option value="integration">Integration</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <Button onClick={handleAddVariable}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variable
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
