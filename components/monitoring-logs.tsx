"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

type LogEntry = {
  id: string
  timestamp: Date
  agent: string
  action: string
  status: "success" | "error" | "pending"
  details: string
}

export default function MonitoringLogs() {
  const [filter, setFilter] = useState("all")
  const [logs, setLogs] = useState<LogEntry[]>([
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
  ])

  const refreshLogs = () => {
    // In a real app, this would fetch logs from the server
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      agent: "github",
      action: "Check repository status",
      status: "success",
      details: "Repository status: 3 open PRs, 12 open issues",
    }
    setLogs([newLog, ...logs])
  }

  const filteredLogs =
    filter === "all"
      ? logs
      : filter === "success"
        ? logs.filter((log) => log.status === "success")
        : logs.filter((log) => log.status === "error")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Agent Activity Logs</h2>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter logs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Logs</SelectItem>
              <SelectItem value="success">Success Only</SelectItem>
              <SelectItem value="error">Errors Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Showing {filteredLogs.length} log entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.status === "success" ? "default" : "destructive"}>{log.status}</Badge>
                      <span className="font-medium">{log.agent} Agent</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{log.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="font-medium mb-1">{log.action}</p>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
