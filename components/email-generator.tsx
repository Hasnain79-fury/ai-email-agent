"use client"

import { useState } from "react"
import { generateEmail } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, RefreshCw, Check, Clock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const emailPurposes = [
  { value: "follow-up", label: "Follow-Up" },
  { value: "apology", label: "Apology" },
  { value: "cold-email", label: "Cold Email" },
  { value: "thank-you", label: "Thank You" },
  { value: "promotion", label: "Promotion" },
  { value: "introduction", label: "Introduction" },
  { value: "request", label: "Request" },
  { value: "invitation", label: "Invitation" },
]

const toneOptions = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "humorous", label: "Humorous" },
  { value: "urgent", label: "Urgent" },
  { value: "casual", label: "Casual" },
]

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
]

interface EmailMetadata {
  wordCount: number
  estimatedReadTime: number
}

export default function EmailGenerator() {
  const { toast } = useToast()
  const [context, setContext] = useState("")
  const [purpose, setPurpose] = useState("follow-up")
  const [tone, setTone] = useState("professional")
  const [recipient, setRecipient] = useState("")
  const [language, setLanguage] = useState("english")
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [emailMetadata, setEmailMetadata] = useState<EmailMetadata | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (context.trim().length < 10) {
      setError("Please provide more context for your email (at least 10 characters)")
      return
    }

    if (context.trim().length > 2000) {
      setError("Context is too long. Please keep it under 2000 characters.")
      return
    }

    setError("")
    setIsGenerating(true)

    try {
      // Try server action first
      const email = await generateEmail({
        context,
        purpose,
        tone,
        recipient,
        language,
      })

      setGeneratedEmail(email)

      // Extract subject and body for better display
      const subjectMatch = email.match(/Subject:\s*(.+)/i)
      const subject = subjectMatch ? subjectMatch[1].trim() : ""
      const body = email.replace(/Subject:\s*.+\n*/i, "").trim()

      setEmailSubject(subject)
      setEmailBody(body)

      // Calculate metadata
      const wordCount = body.split(" ").filter((word) => word.length > 0).length
      setEmailMetadata({
        wordCount,
        estimatedReadTime: Math.ceil(wordCount / 200),
      })
    } catch (err) {
      console.error("Server action failed, trying API route:", err)

      // Fallback to API route
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context,
            purpose,
            tone,
            recipient,
            language,
          }),
        })

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        setGeneratedEmail(data.email)
        setEmailSubject(data.subject || "")
        setEmailBody(data.body || data.email)
        setEmailMetadata(data.metadata || null)
      } catch (apiError) {
        setError("Failed to generate email. Please try again.")
        console.error("API route also failed:", apiError)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Email content has been copied to your clipboard",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const characterCount = context.length
  const isContextValid = characterCount >= 10 && characterCount <= 2000

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="context" className="mb-2 block font-medium">
              Email Context <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="context"
              placeholder="Describe the situation or provide background information for your email..."
              className="min-h-[150px] resize-y"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <div className="mt-1 flex justify-between text-sm">
              <span className={!isContextValid && characterCount > 0 ? "text-red-500" : "text-muted-foreground"}>
                {characterCount}/2000 characters
                {!isContextValid && characterCount > 0 && characterCount < 10 && " (minimum 10)"}
                {characterCount > 2000 && " (maximum 2000)"}
              </span>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="purpose" className="mb-2 block font-medium">
                Email Purpose <span className="text-red-500">*</span>
              </label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {emailPurposes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="tone" className="mb-2 block font-medium">
                Tone (Optional)
              </label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="recipient" className="mb-2 block font-medium">
                Recipient Name (Optional)
              </label>
              <Input
                id="recipient"
                placeholder="e.g. John Smith"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="language" className="mb-2 block font-medium">
                Language (Optional)
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !isContextValid} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Email...
              </>
            ) : (
              "Generate Email"
            )}
          </Button>
        </div>
      </Card>

      {generatedEmail && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Generated Email</h2>
              {emailMetadata && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {emailMetadata.wordCount} words
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {emailMetadata.estimatedReadTime} min read
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
            </div>
          </div>

          {emailSubject && (
            <div className="mb-4">
              <h3 className="mb-2 font-medium text-sm text-muted-foreground">Subject Line</h3>
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
                <p className="font-medium">{emailSubject}</p>
              </div>
            </div>
          )}

          <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-900">
            <pre className="whitespace-pre-wrap font-sans text-sm">{emailBody || generatedEmail}</pre>
          </div>
        </Card>
      )}
    </div>
  )
}
