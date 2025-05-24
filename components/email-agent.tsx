"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Copy, Check, Mail, MessageCircle, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailResult {
  subject: string
  body: string
  fullEmail: string
  timestamp: string
}

export default function EmailAgent() {
  const { toast } = useToast()
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [generatedEmails, setGeneratedEmails] = useState<EmailResult[]>([])

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    maxSteps: 5,
    onFinish: (message) => {
      // Enhanced email extraction with multiple fallback methods
      extractEmailsFromMessage(message.content)
    },
  })

  const extractEmailsFromMessage = (content: string) => {
    // Method 1: Look for \`\`\`email blocks
    const emailMatches = content.match(/```email\n([\s\S]*?)\n```/g)

    if (emailMatches) {
      emailMatches.forEach((match) => {
        const emailContent = match
          .replace(/```email\n/, "")
          .replace(/\n```/, "")
          .trim()
        processExtractedEmail(emailContent)
      })
      return
    }

    // Method 2: Look for Subject: pattern (fallback)
    const subjectMatch = content.match(/Subject:\s*(.+?)(?:\n\n|\n)([\s\S]*?)(?=\n\n---|\n\nLet me know|$)/i)

    if (subjectMatch) {
      const emailContent = `Subject: ${subjectMatch[1]}\n\n${subjectMatch[2]}`.trim()
      processExtractedEmail(emailContent)
      return
    }

    // Method 3: Look for any structured email-like content
    const emailPattern = /(Dear|Hi|Hello)[\s\S]*?(Best regards|Sincerely|Best|Thank you|Regards)/i
    const emailMatch = content.match(emailPattern)

    if (emailMatch) {
      const emailContent = emailMatch[0].trim()
      // Add a generic subject if none exists
      const finalEmail = emailContent.includes("Subject:")
        ? emailContent
        : `Subject: Professional Email\n\n${emailContent}`
      processExtractedEmail(finalEmail)
    }
  }

  const processExtractedEmail = (emailContent: string) => {
    const subjectMatch = emailContent.match(/Subject:\s*(.+)/i)
    const subject = subjectMatch ? subjectMatch[1].trim() : "Professional Email"
    const body = emailContent.replace(/Subject:\s*.+\n*/i, "").trim()

    const emailResult: EmailResult = {
      subject,
      body,
      fullEmail: emailContent,
      timestamp: new Date().toLocaleString(),
    }

    setGeneratedEmails((prev) => {
      // Avoid duplicates
      const isDuplicate = prev.some((email) => email.fullEmail === emailResult.fullEmail)
      if (isDuplicate) return prev
      return [...prev, emailResult]
    })

    // Auto-scroll to the new email
    setTimeout(() => {
      const emailSection = document.getElementById("generated-emails")
      if (emailSection) {
        emailSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    toast({
      title: "Email copied!",
      description: "The email has been copied to your clipboard",
    })

    setTimeout(() => {
      setCopiedEmail(null)
    }, 2000)
  }

  const handleDownloadEmail = (email: EmailResult) => {
    const blob = new Blob([email.fullEmail], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `email-${email.subject.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Email downloaded!",
      description: "The email has been saved as a text file",
    })
  }

  const quickPrompts = [
    "Help me write a follow-up email after a job interview",
    "I need to apologize for a delayed response",
    "Write a cold email to a potential client",
    "Create a thank you email for a business meeting",
    "Help me decline a meeting politely",
    "Write a professional introduction email",
    "I need a proposal email for funding",
    "Help me write a networking email",
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>

    setTimeout(() => {
      handleSubmit(syntheticEvent)
    }, 100)
  }

  const quickResponses = [
    "Yes, that's correct",
    "No, let me clarify",
    "I'm not sure",
    "Can you give me an example?",
    "That works for me",
    "I need help with this",
  ]

  const handleQuickResponse = (response: string) => {
    setInput(response)
  }

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">AI Email Assistant</h3>
              <p className="text-sm text-muted-foreground">
                I'll ask you one question at a time to create the perfect email
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Hi! I'm your AI Email Assistant</h3>
                <p className="text-muted-foreground mb-4">
                  I'll help you write the perfect email by asking you simple questions, one at a time. No overwhelming
                  forms - just a natural conversation!
                </p>
                <div className="grid gap-2 max-w-md mx-auto">
                  {quickPrompts.slice(0, 4).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickPrompt(prompt)}
                      className="text-left justify-start h-auto p-3 whitespace-normal"
                    >
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                  {/* Render any tool results */}
                  {message.toolInvocations?.map((toolInvocation) => (
                    <div key={toolInvocation.toolCallId} className="mt-2 p-2 bg-slate-100 rounded dark:bg-slate-800">
                      <div className="text-xs text-muted-foreground mb-1">
                        {toolInvocation.toolName === "generateEmail" && "🔧 Generating email..."}
                        {toolInvocation.toolName === "trackConversationContext" && "🧠 Analyzing conversation..."}
                      </div>
                      {toolInvocation.result && (
                        <div className="text-sm">
                          {typeof toolInvocation.result === "string"
                            ? toolInvocation.result
                            : JSON.stringify(toolInvocation.result, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Response Buttons */}
        {messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && !isLoading && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickResponse(response)}
                  className="text-xs"
                >
                  {response}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your response here..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">More Email Types</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {quickPrompts.slice(4).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleQuickPrompt(prompt)}
                className="text-left justify-start h-auto p-3 whitespace-normal"
              >
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                {prompt}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Generated Emails Display */}
      {generatedEmails.length > 0 && (
        <Card className="p-6" id="generated-emails">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Generated Emails ({generatedEmails.length})
          </h3>
          <div className="space-y-6">
            {generatedEmails.map((email, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">Email #{index + 1}</h4>
                    <p className="text-sm text-muted-foreground">Generated on {email.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadEmail(email)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCopyEmail(email.fullEmail)}
                      className="flex items-center gap-1"
                    >
                      {copiedEmail === email.fullEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedEmail === email.fullEmail ? "Copied!" : "Copy Email"}
                    </Button>
                  </div>
                </div>

                {/* Subject Line */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Subject Line:
                  </div>
                  <div className="bg-white p-3 rounded-md border-l-4 border-blue-500 dark:bg-slate-800">
                    <p className="font-medium text-blue-700 dark:text-blue-300">{email.subject}</p>
                  </div>
                </div>

                {/* Email Body */}
                <div className="bg-white rounded-md border dark:bg-slate-900">
                  <div className="p-4 border-b bg-gray-50 dark:bg-slate-800">
                    <p className="text-sm font-medium">Email Content</p>
                  </div>
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{email.body}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
