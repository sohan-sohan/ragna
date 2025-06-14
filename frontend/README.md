# RAG Chatbot Frontend

A React frontend for a RAG (Retrieval-Augmented Generation) chatbot that allows users to upload PDF documents and ask questions about their content.

## Features

- 📄 PDF file upload with drag & drop support
- 💬 Real-time chat interface
- 🔄 Integration with FastAPI/Flask backend
- 📱 Responsive design
- ⚡ Static site deployment ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- Your RAG backend API running (FastAPI/Flask)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Update `NEXT_PUBLIC_API_BASE_URL` to point to your backend API.

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Backend API Requirements

Your backend should provide these endpoints:

#### POST /upload
Upload PDF files
- Content-Type: multipart/form-data
- Body: file (PDF file)
- Response: `{ "file_id": "string" }`

#### POST /chat
Send chat messages
- Content-Type: application/json
- Body: `{ "message": "string", "file_ids": ["string"] }`
- Response: `{ "response": "string" }`

## Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

This creates an optimized production build in the `out` directory (configured for static export).

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `out` directory to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Other Static Hosts

The `out` directory contains all static files needed for deployment to any static hosting service (GitHub Pages, AWS S3, etc.).

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: URL of your RAG backend API

## Tech Stack

- **React 18** - UI framework
- **Next.js 14** - React framework with static export
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **react-dropzone** - File upload
- **axios** - HTTP client
- **Lucide React** - Icons

## License

MIT
\`\`\`

Let's also add the Next.js configuration for static export:
