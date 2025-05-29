import { streamText, tool } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { z } from "zod"

// Simple email-only context filter
function isEmailContextValid(messages: { content: string }[]): boolean {
  const content = messages.map(m => m.content).join(" ").toLowerCase()

  const mustIncludeAny = ["email", "write an email", "compose an email", "send an email","mail", "write an mail", "compose an mail", "send an mail"]
  const bannedKeywords = [
    "joke", "story", "essay", "poem", "tweet", "code", "blog", "art", "paint", "draw",
    "song", "lyrics", "novel", "video", "photo", "image"
  ]

  const isClearlyEmail = mustIncludeAny.some(keyword => content.includes(keyword))
  const isClearlyNotEmail = bannedKeywords.some(keyword => content.includes(keyword))

  return isClearlyEmail && !isClearlyNotEmail
}

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // ✅ Enforce email-only usage
  if (!isEmailContextValid(messages)) {
   return new Response(
  JSON.stringify({
    role: "assistant",
    content: "📧 This assistant only helps with writing emails. Please describe the email you want help with.",
  }),
  { status: 200, headers: { "Content-Type": "application/json" } }
)

  }

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  })

  const result = streamText({
    model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
    messages,
    system: `IMPORTANT: You ONLY assist users with composing or refining EMAILS. Do NOT respond to any requests that are not related to writing emails. If the user asks something unrelated, reply with: "Sorry, I can only help with writing professional emails."

You are an expert email writing assistant. You help users create professional, well-crafted emails for any situation.

CONVERSATION STYLE:
- Ask ONE question at a time to avoid overwhelming users
- Keep questions clear and specific
- Use a friendly, conversational tone
- Build context progressively through the conversation
- Only ask for information that's truly necessary for the current step

QUESTIONING APPROACH:
- Start with the most important question first
- Ask follow-up questions based on previous answers
- Don't ask all questions at once - this is overwhelming
- Use the information already provided to inform your next question
- When you have enough information, proceed to generate the email

EMAIL GENERATION RULES:
When you generate a complete email, you MUST:
1. Always wrap the email in the exact format: \`\`\`email ... \`\`\`
2. Always include a subject line starting with "Subject:"
3. Include proper greeting, body, and closing
4. Make sure the email is complete and ready to send`,
    tools: {
      generateEmail: tool({
        description: "Generate a professional email based on the provided context and requirements",
        parameters: z.object({
          context: z.string().describe("The background context for the email"),
          purpose: z.string().describe("The purpose of the email (follow-up, apology, cold-email, etc.)"),
          tone: z.string().describe("The desired tone (formal, professional, friendly, etc.)"),
          recipient: z.string().optional().describe("The name of the recipient"),
          additionalRequirements: z.string().optional().describe("Any additional specific requirements"),
        }),
        execute: async ({ context, purpose, tone, recipient, additionalRequirements }) => {
          const recipientText = recipient ? `to ${recipient}` : ""

          const emailPrompt = `Generate a professional ${purpose} email ${recipientText} with the following details:

Context: ${context}
Tone: ${tone}
${additionalRequirements ? `Additional Requirements: ${additionalRequirements}` : ""}

IMPORTANT: Format the email EXACTLY as follows:
Subject: [Create a compelling subject line under 50 characters]

[Appropriate greeting based on relationship and tone]

[Well-structured email body with clear paragraphs that address the context and purpose]

[Professional closing appropriate for the tone]
[Sender name placeholder]

Make it polished, actionable, and ready to send. Ensure proper spacing between sections.`

          try {
            const { text } = await streamText({
              model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
              prompt: emailPrompt,
              temperature: 0.7,
              maxTokens: 1000,
            })

            const emailContent = await text

            let formattedEmail = emailContent.trim()

            if (!formattedEmail.includes("Subject:")) {
              const lines = formattedEmail.split("\n")
              const firstLine = lines[0].trim()
              if (firstLine && !firstLine.toLowerCase().includes("dear") && !firstLine.toLowerCase().includes("hi")) {
                formattedEmail = `Subject: ${firstLine}\n\n${lines.slice(1).join("\n")}`
              } else {
                formattedEmail = `Subject: ${purpose.charAt(0).toUpperCase() + purpose.slice(1)} Email\n\n${formattedEmail}`
              }
            }

            return `Perfect! I've generated your email. Here it is:

\`\`\`email
${formattedEmail}
\`\`\`

You can copy this email and use it right away, or let me know if you'd like me to make any adjustments!`
          } catch (error) {
            return "I apologize, but I encountered an error while generating the email. Please try again."
          }
        },
      }),
      trackConversationContext: tool({
        description: "Track and analyze the conversation context to determine what information is still needed",
        parameters: z.object({
          gatheredInfo: z.object({
            purpose: z.string().optional(),
            recipient: z.string().optional(),
            tone: z.string().optional(),
            context: z.string().optional(),
            industry: z.string().optional(),
            deadline: z.string().optional(),
            specificRequirements: z.string().optional(),
          }),
          nextQuestionNeeded: z.string().describe("The next single question to ask the user"),
          readyToGenerate: z.boolean().describe("Whether we have enough information to generate the email"),
        }),
        execute: async ({ gatheredInfo, nextQuestionNeeded, readyToGenerate }) => {
          return readyToGenerate
            ? "Ready to generate email with gathered information."
            : `Next question to ask: ${nextQuestionNeeded}`
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
