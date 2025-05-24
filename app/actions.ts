"use server"

import { generateText } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

type EmailParams = {
  context: string
  purpose: string
  tone: string
  recipient: string
  language: string
}

interface EmailResponse {
  subject: string
  body: string
  fullEmail: string
}

export async function generateEmail({ context, purpose, tone, recipient, language }: EmailParams): Promise<string> {
  const recipientText = recipient ? `to ${recipient}` : ""

  // Create OpenRouter provider instance
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  })

  // Enhanced system prompt with more specific instructions
  const systemPrompt = `You are a professional email writing expert with years of experience in business communication. Your task is to write a polished, well-structured email that follows best practices for professional correspondence.

  CRITICAL REQUIREMENTS:
  - Write in ${language} language
  - Use a ${tone} tone consistently throughout
  - Create a compelling and specific subject line
  - Use proper email structure with clear sections
  - Include appropriate greeting and professional sign-off
  - Be concise yet comprehensive
  - Use active voice when possible
  - Ensure proper spacing and formatting
  - Make the email scannable with clear paragraphs
  - Include a clear call-to-action when appropriate
  
  EMAIL STRUCTURE REQUIREMENTS:
  1. Subject Line: Specific, actionable, and under 50 characters
  2. Greeting: Professional and appropriate for the relationship
  3. Opening: Brief context or reference to previous interaction
  4. Body: Main message broken into digestible paragraphs
  5. Call-to-Action: Clear next steps (when applicable)
  6. Closing: Professional sign-off
  
  TONE GUIDELINES:
  - Formal: Use traditional business language, avoid contractions
  - Professional: Balance friendliness with professionalism
  - Friendly: Warm but still professional, use some contractions
  - Casual: Conversational but respectful
  - Urgent: Direct and action-oriented without being pushy
  - Humorous: Light and engaging while maintaining professionalism
  
  OUTPUT FORMAT:
  Return ONLY the complete email with proper formatting. Do not include any explanations, notes, or commentary outside the email content.`

  // Enhanced user prompt with better context analysis
  const userPrompt = `Write a ${purpose} email ${recipientText} with the following context:

  Context: ${context}
  
  Additional Instructions:
  - Analyze the context to understand the relationship dynamics
  - Tailor the level of formality to the situation
  - Include relevant details that show you understand the context
  - Make the email actionable with clear next steps
  - Ensure the subject line accurately reflects the email content
  - Use appropriate business email conventions for the ${purpose} purpose`

  try {
    const { text } = await generateText({
      model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1200,
    })

    // Post-process the email for better formatting
    const polishedEmail = postProcessEmail(text, tone, purpose)

    return polishedEmail
  } catch (error) {
    console.error("Error generating email:", error)
    throw new Error("Failed to generate email")
  }
}

// Post-processing function to enhance email formatting
function postProcessEmail(email: string, tone: string, purpose: string): string {
  let processed = email.trim()

  // Ensure proper line spacing
  processed = processed.replace(/\n{3,}/g, "\n\n")

  // Ensure subject line is properly formatted
  if (!processed.includes("Subject:")) {
    const lines = processed.split("\n")
    const firstLine = lines[0]
    if (firstLine && !firstLine.toLowerCase().includes("dear") && !firstLine.toLowerCase().includes("hi")) {
      processed = `Subject: ${firstLine}\n\n${lines.slice(1).join("\n")}`
    }
  }

  // Add professional spacing after greeting
  processed = processed.replace(/(Dear [^,\n]+,|Hi [^,\n]+,|Hello [^,\n]+,)/g, "$1\n")

  // Ensure proper paragraph spacing
  processed = processed.replace(/([.!?])\s*([A-Z])/g, "$1\n\n$2")

  // Add professional closing if missing
  if (!hasProperClosing(processed)) {
    processed = addProfessionalClosing(processed, tone)
  }

  return processed
}

function hasProperClosing(email: string): boolean {
  const closings = [
    "best regards",
    "sincerely",
    "thank you",
    "best",
    "regards",
    "kind regards",
    "warm regards",
    "yours truly",
    "respectfully",
  ]

  const lowerEmail = email.toLowerCase()
  return closings.some((closing) => lowerEmail.includes(closing))
}

function addProfessionalClosing(email: string, tone: string): string {
  const closingMap: Record<string, string> = {
    formal: "Sincerely",
    professional: "Best regards",
    friendly: "Warm regards",
    casual: "Best",
    urgent: "Thank you",
    humorous: "Best regards",
  }

  const closing = closingMap[tone] || "Best regards"
  return `${email}\n\n${closing}`
}

// Enhanced email generation with subject line extraction
export async function generateEnhancedEmail({
  context,
  purpose,
  tone,
  recipient,
  language,
}: EmailParams): Promise<EmailResponse> {
  const fullEmail = await generateEmail({ context, purpose, tone, recipient, language })

  // Extract subject line
  const subjectMatch = fullEmail.match(/Subject:\s*(.+)/i)
  const subject = subjectMatch ? subjectMatch[1].trim() : generateFallbackSubject(purpose, tone)

  // Extract body (everything after subject line)
  const body = fullEmail.replace(/Subject:\s*.+\n*/i, "").trim()

  return {
    subject,
    body,
    fullEmail,
  }
}

function generateFallbackSubject(purpose: string, tone: string): string {
  const subjectTemplates: Record<string, string[]> = {
    "follow-up": ["Following up on our conversation", "Quick follow-up", "Checking in"],
    apology: ["Sincere apologies", "My apologies for the inconvenience", "Sorry for the delay"],
    "cold-email": [
      "Introduction and collaboration opportunity",
      "Exploring potential partnership",
      "Quick introduction",
    ],
    "thank-you": ["Thank you for your time", "Grateful for your assistance", "Much appreciated"],
    promotion: ["Exciting news to share", "Special offer just for you", "Limited time opportunity"],
    introduction: ["Introduction and next steps", "Pleased to meet you", "Great connecting with you"],
    request: ["Request for assistance", "Quick favor to ask", "Your expertise needed"],
    invitation: ["You're invited", "Special invitation for you", "Join us for"],
  }

  const templates = subjectTemplates[purpose] || ["Important message"]
  return templates[0]
}
