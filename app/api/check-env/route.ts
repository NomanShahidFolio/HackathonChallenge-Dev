export async function GET() {
  const hasGroqKey = !!process.env.AGENT_GROQ_KEY
  const hasGithubToken = !!process.env.GITHUB_TOKEN

  return new Response(
    JSON.stringify({
      status: "ok",
      environment: {
        AGENT_GROQ_KEY: hasGroqKey ? "Present" : "Missing",
        GITHUB_TOKEN: hasGithubToken ? "Present" : "Missing",
      },
    }),
    { headers: { "Content-Type": "application/json" } },
  )
}
