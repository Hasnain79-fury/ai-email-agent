import Link from "next/link"

export const metadata = {
  title: "About Our AI Email Generator | Professional Email Writing Tool",
  description: "Learn about our AI-powered email generator that helps professionals create perfect emails in seconds.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">About Our AI Email Generator</h1>

      <div className="prose max-w-none dark:prose-invert">
        <p>
          Our AI Email Generator is designed to help professionals save time and create more effective email
          communications. Using advanced AI technology, our tool can generate professional, contextually appropriate
          emails for various purposes.
        </p>

        <h2>How It Works</h2>
        <p>
          Simply provide some context about what you want to communicate, select the purpose and tone of your email, and
          our AI will generate a professionally written email that you can use immediately or customize further.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe that effective communication shouldn't be time-consuming. Our mission is to help professionals
          communicate more efficiently while maintaining the quality and personal touch in their emails.
        </p>

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            Try our AI Email Generator now
          </Link>
        </div>
      </div>
    </div>
  )
}
