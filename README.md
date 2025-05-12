# AgentDock

AgentDock is a Model Context Protocol (MCP) server with a clean UI to register, manage, and interact with intelligent agents. It enables multi-agent orchestration, tool integrations, and LLM-powered interactions.

## Features

- **Agent Management**: Register/deregister agents with code, description, and configuration
- **Chat Interface**: Ask questions and get responses from AI models
- **Monitoring & Logs**: View recent agent actions and outputs
- **Environment Variable Management**: Securely manage environment variables for agents and integrations

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or pnpm

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/agent-dock.git
cd agent-dock
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install or (npm install --force)

# or

pnpm install
\`\`\`

3. Create a `.env.local` file in the root directory with the following variables:

\`\`\`

# Required for Groq integration

AGENT_GROQ_KEY=your_groq_api_key

# Optional for GitHub integration

GITHUB_TOKEN=your_github_token
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev

# or

pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

AgentDock uses the following environment variables:

| Variable       | Description                                         | Required |
| -------------- | --------------------------------------------------- | -------- |
| AGENT_GROQ_KEY | API key for Groq LLM integration                    | Yes      |
| GITHUB_TOKEN   | GitHub personal access token for GitHub integration | No       |

You can manage these environment variables through the Environment Variables tab in the application.

## Troubleshooting

If you encounter any issues with the application, try the following:

1. **Validate Groq API Key**: Visit `/api/validate-groq` to check if your Groq API key is valid.

2. **Check Environment Variables**: Make sure your environment variables are set correctly. You can check if they're being read by visiting `/api/check-env`.

3. **API Test**: Verify that the API routes are working by visiting `/api/test`.

4. **Restart the Development Server**: Sometimes, restarting the development server can resolve issues:
   \`\`\`bash

   # Press Ctrl+C to stop the server

   npm run dev
   \`\`\`

5. **Clear Browser Cache**: Try clearing your browser cache or opening the application in an incognito/private window.

6. **Check Console Logs**: Open your browser's developer tools (F12) and check the console for any error messages.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components for the UI
- `/lib` - Utility functions, tools, and MCP implementation
  - `/lib/mcp` - Model Context Protocol server implementation
  - `/lib/tools` - Tool implementations for agents

## License

This project is licensed under the MIT License - see the LICENSE file for details.
