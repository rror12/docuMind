# DocuMind RAG Chatbot

An intelligent document assistant that uses Retrieval-Augmented Generation (RAG) to answer questions based on uploaded documents and URLs. Built with React, TypeScript, and powered by Google's Gemini AI.

## Features

- 📄 Support for multiple document formats (PDF, DOCX, TXT)
- 🔗 Extract content from URLs and YouTube videos
- 💬 Interactive chat interface
- 🤖 Context-aware responses using Gemini AI
- 🎨 Modern, responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- A Gemini API key (get one at [ai.google.dev](https://ai.google.dev/))

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd documind-rag-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Upload one or more documents (PDF, DOCX, or TXT) or add URLs
2. Wait for the processing to complete
3. Ask questions about the content
4. Get accurate, context-aware answers

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash
- **PDF Processing**: PDF.js

## License