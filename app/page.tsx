import EmailAgent from "@/components/email-agent"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">AI Email Assistant</h1>
            <p className="mt-4 text-muted-foreground">
              Your intelligent email writing companion. Chat with our AI to create perfect emails for any situation.
            </p>
          </div>
          <EmailAgent />
        </div>
      </div>
    </div>
  )
}
