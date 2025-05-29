import { NextRequest, NextResponse } from "next/server"

const bannedKeywords = [
  "essay",
  "story",
  "joke",
  "code",
  "tweet",
  "poem",
  "rap",
  "blog",
  "novel",
  "drawing",
  "image",
  "picture",
  "paint",
  "art",
  "generate text",
  "linkedin post",
    "social media",
    "social media post",
    "social media content",
    "social media content",
    "code snippet",
    "code example",
    "code generation",
    "code generation",
    "code writing",
    "code writing",
    "code creation",
    "code creation",
    "code",
    "programming",
    "programming language",
    "programming languages",
    "programming languages",
    "programming code",
    "programming code",
    "programming example",
    "programming example"
]

/**
 * Middleware to ensure the request is only for email-related content.
 * Call this at the start of your POST API handler.
 */
export async function emailOnlyGuard(request: NextRequest): Promise<NextResponse | null> {
  try {
    const { context, purpose } = await request.clone().json()

    // Basic presence check
    if (!context || !purpose) {
      return NextResponse.json(
        { error: "Missing required fields: 'context' and 'purpose' are required." },
        { status: 400 }
      )
    }

    const lowerContext = context.toLowerCase()
    const unrelated = bannedKeywords.some((keyword) => lowerContext.includes(keyword))

    if (unrelated) {
      return NextResponse.json(
        {
          error:
            "This tool is only for generating professional emails. Please ensure your context is email-related.",
        },
        { status: 400 }
      )
    }

    return null // ✅ All good
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request format. Expecting JSON body with 'context' and 'purpose'." },
      { status: 400 }
    )
  }
}
