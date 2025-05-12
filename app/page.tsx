import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicChat from "@/components/basic-chat";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AgentDock</h1>
        <p className="text-muted-foreground">
          Multi-Agent MCP Server with Tool Integrations
        </p>
      </header>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full bg-black">
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-6">
          <BasicChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
