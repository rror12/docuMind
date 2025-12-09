
import React, { useState, useRef, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { Message as MessageType } from '../types';
import { Message } from './Message';
import { SendIcon } from './icons/SendIcon';

interface ChatWindowProps {
  messages: MessageType[];
  onSendMessage: (text: string) => void;
  isBotReplying: boolean;
  isReady: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isBotReplying, isReady }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isBotReplying]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isBotReplying && isReady) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const placeholderText = !isReady 
    ? 'Please process documents to begin.' 
    : isBotReplying 
    ? 'DocuMind is thinking...' 
    : 'Ask a question about your documents...';

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isBotReplying && <Message key="thinking" message={{id: 'thinking', sender: 'bot', text: '...'}} isTyping={true} />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-stone-800 bg-stone-900/50 rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={placeholderText}
            disabled={!isReady || isBotReplying}
            className="flex-grow bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isReady || isBotReplying || !input.trim()}
            className="bg-emerald-600 text-white rounded-lg p-3 hover:bg-emerald-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
