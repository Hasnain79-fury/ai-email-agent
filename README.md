# AI Email Agent 🤖✉️

An intelligent email writing assistant that helps you create professional, well-crafted emails through natural conversation. No overwhelming forms - just chat with the AI and get perfect emails in seconds.

![AI Email Agent](https://img.shields.io/badge/AI-Email%20Agent-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **Conversational Interface**: Chat naturally with the AI - no complex forms
- **Smart Question Flow**: AI asks one question at a time to avoid overwhelming users
- **Multiple Email Types**: Follow-ups, apologies, cold emails, thank you notes, proposals, and more
- **Tone Customization**: Formal, professional, friendly, casual, urgent, or humorous
- **Multi-language Support**: Generate emails in English, Spanish, French, German, Chinese, and Japanese
- **Real-time Generation**: Powered by Meta's Llama 3.3 model via OpenRouter
- **Copy & Regenerate**: Easy copying and regeneration of emails
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode Support**: Beautiful UI that adapts to your preference

## 🚀 Live Demo

[Try the AI Email Agent](https://your-app-name.vercel.app)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Provider**: OpenRouter (Meta Llama 3.3)
- **Deployment**: Vercel
- **State Management**: React hooks + AI SDK

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- An OpenRouter account and API key
- Git installed (optional, for cloning)

## 🔧 Installation

### Option 1: Clone from GitHub

```bash
git clone https://github.com/yourusername/ai-email-agent.git
cd ai-email-agent
npm install
```

### Option 2: Download from v0

1. Download the code from the v0 block
2. Extract the ZIP file
3. Navigate to the project directory
4. Run `npm install`

## ⚙️ Environment Setup

1. **Create a `.env.local` file** in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2. **Get your OpenRouter API Key**:
   - Visit [openrouter.ai](https://openrouter.ai)
   - Sign up or log in
   - Navigate to the "Keys" section
   - Create a new API key
   - Copy and paste it into your `.env.local` file

## 🏃‍♂️ Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser and visit
# http://localhost:3000
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `NEXT_PUBLIC_BASE_URL`: Your Vercel app URL
   - Click "Deploy"

3. **Update Base URL**:
   - After deployment, update `NEXT_PUBLIC_BASE_URL` with your actual Vercel URL

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📁 Project Structure

```
ai-email-agent/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Chat API endpoint
│   │   └── generate/route.ts      # Email generation API
│   ├── about/page.tsx             # About page
│   ├── actions.ts                 # Server actions
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── robots.ts                  # SEO robots
│   └── sitemap.ts                 # SEO sitemap
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── email-agent.tsx            # Main chat interface
│   ├── email-generator.tsx        # Form-based generator
│   ├── structured-data.tsx        # SEO structured data
│   └── theme-provider.tsx         # Dark mode provider
├── hooks/
│   └── use-toast.ts               # Toast notifications
├── lib/
│   └── utils.ts                   # Utility functions
├── public/
│   └── googled46718dca16667f1.html # Google verification
├── .env.local                     # Environment variables
├── next.config.mjs                # Next.js configuration
├── package.json                   # Dependencies
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🎯 Usage

### Basic Usage

1. **Start a Conversation**: Type what kind of email you need
2. **Answer Questions**: The AI will ask clarifying questions one at a time
3. **Get Your Email**: Receive a professionally crafted email
4. **Copy & Use**: Copy the email and use it immediately

### Example Conversations

**User**: "I need to follow up after a job interview"

**AI**: "I'd be happy to help you write a follow-up email! What position did you interview for?"

**User**: "Software Engineer at TechCorp"

**AI**: "Great! When did the interview take place?"

### Supported Email Types

- **Follow-up emails**: After meetings, interviews, proposals
- **Apology emails**: For delays, mistakes, or misunderstandings
- **Cold outreach**: To potential clients, partners, or contacts
- **Thank you notes**: After meetings, favors, or collaborations
- **Proposals**: Business proposals, project pitches
- **Introductions**: Self-introductions or connecting others
- **Invitations**: Meeting invites, event invitations
- **Requests**: Asking for help, information, or favors


### Modifying AI Behavior

Update the system prompt in `app/api/chat/route.ts` to change how the AI behaves:

```typescript
system: `Your custom instructions here...`
```

### Styling Changes

The app uses Tailwind CSS and shadcn/ui. Modify styles in:
- `app/globals.css` for global styles
- Component files for specific styling
- `tailwind.config.ts` for theme customization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for AI model access
- [Vercel](https://vercel.com) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Meta](https://ai.meta.com) for the Llama 3.3 model

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Contact: [hf235799@gmail.com]

## 🔮 Roadmap

- [ ] Email templates library
- [ ] Email scheduling integration
- [ ] Multiple AI model support

---

**Made with ❤️ using Next.js and AI**

⭐ If you found this project helpful, please give it a star on GitHub!
```
