# Saket's Portfolio & AI Digital Twin 

Welcome to the source code for my interactive developer portfolio.
## 🌟 Live Demo
[View Live Site](https://itsmesaket.vercel.app/)

## ✨ Features
- **AI Digital Twin**: A custom-prompted LLM built with Vercel AI SDK and Groq (Llama 3) that acts as my clone, answering questions about my projects, skills, and philosophy.
- **Neural Net Spiderweb Background**: A stunning, interactive HTML5 Canvas background that responds to your mouse.
- **Dynamic Animations**: Silky smooth scroll reveals, marquee strips, and interactive UI components powered by Framer Motion.
- **Fully Responsive**: Beautifully scales from ultra-wide monitors down to mobile devices.
- **Terminal UI**: A hacker-style terminal chat interface that feels like you're talking directly to my brain.

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: Vercel AI SDK + Groq API
- **Deployment**: Vercel

## 🚀 Getting Started Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/SakuDaku05/Me-.git
   cd Me-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your Groq API key (required for the AI chat to work):
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Architecture Overview
- `src/app/page.tsx`: The main landing page.
- `src/components/ui/ai-core.tsx`: The chat interface and terminal UI for the Digital Twin.
- `src/app/api/chat/route.ts`: The backend API route that connects to the Groq LLM.
- `src/components/ui/spiderweb-background.tsx`: The interactive canvas background.

## 🤝 Let's Connect
Feel free to reach out via [Email](mailto:seemar978@gmail.com), [LinkedIn](https://www.linkedin.com/in/saket-singh-b86109318/), or chat with my Digital Twin directly on the site!
