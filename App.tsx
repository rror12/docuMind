import React, { useState, useCallback, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChatWindow } from './components/ChatWindow';
import { processSourcesToText } from './services/documentProcessor';
import { generateAnswer } from './services/geminiService';
import type { Message } from './types';
import { DocStatus } from './types';

export default function App(): React.ReactElement {
  const [docStatus, setDocStatus] = useState<DocStatus>(DocStatus.IDLE);
  const [documentContext, setDocumentContext] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotReplying, setIsBotReplying] = useState<boolean>(false);

  const initialMessage = useMemo((): Message => ({
    id: 'initial-message',
    text: 'Hello! I am DocuMind. Please upload your documents or add URLs, and I will answer any questions you have about their content.',
    sender: 'bot',
  }), []);

  const handleProcessSources = useCallback(async (files: File[], urls: string[]) => {
    if (files.length === 0 && urls.length === 0) {
      return;
    }
    setDocStatus(DocStatus.PROCESSING);
    setMessages([]);
    try {
      const context = await processSourcesToText(files, urls);
      setDocumentContext(context);
      setDocStatus(DocStatus.READY);

      const fileCount = files.length;
      const urlCount = urls.length;
      let readyText = "I have finished processing your sources. What would you like to know?";
      if (fileCount > 0 && urlCount > 0) {
        readyText = `I have finished processing ${fileCount} document(s) and ${urlCount} URL(s). What would you like to know?`;
      } else if (fileCount > 0) {
        readyText = `I have finished processing ${fileCount} document(s). What would you like to know?`;
      } else if (urlCount > 0) {
        readyText = `I have finished processing ${urlCount} URL(s). What would you like to know?`;
      }

      setMessages([
        {
          id: 'ready-message',
          text: readyText,
          sender: 'bot',
        },
      ]);
    } catch (error) {
      console.error('Error processing sources:', error);
      setDocStatus(DocStatus.ERROR);
      setMessages([
        {
          id: 'error-message',
          text: 'I apologize, but there was an error processing your sources. Please try again.',
          sender: 'bot',
        },
      ]);
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (isBotReplying || !text.trim()) {
      return;
    }

    const userMessage: Message = { id: `user-${Date.now()}`, text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsBotReplying(true);

    try {
      const botResponse = await generateAnswer(documentContext, text);
      const botMessage: Message = { id: `bot-${Date.now()}`, text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try asking again.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsBotReplying(false);
    }
  }, [documentContext, isBotReplying]);

  const effectiveMessages = messages.length > 0 ? messages : [initialMessage];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans flex flex-col items-center p-4 selection:bg-emerald-500/30">
      <header className="w-full max-w-7xl mx-auto text-center py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
          DocuMind RAG Chatbot
        </h1>
        <p className="text-stone-400 mt-2 text-lg">Your intelligent document assistant</p>
      </header>
      <main className="w-full max-w-7xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
        <aside className="lg:col-span-1 h-full">
          <FileUpload
            onProcess={handleProcessSources}
            status={docStatus}
          />
        </aside>
        <section className="lg:col-span-2 h-full flex flex-col bg-stone-900/50 border border-stone-800 rounded-2xl shadow-2xl shadow-black/20">
          <ChatWindow
            messages={effectiveMessages}
            onSendMessage={handleSendMessage}
            isBotReplying={isBotReplying}
            isReady={docStatus === DocStatus.READY}
          />
        </section>
      </main>
    </div>
  );
}