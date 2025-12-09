
import React from 'react';
import type { Message as MessageType } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface MessageProps {
  message: MessageType;
  isTyping?: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isTyping = false }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isBot ? 'bg-stone-700' : 'bg-emerald-800'}`}>
        {isBot ? <BotIcon className="w-6 h-6 text-stone-300" /> : <UserIcon className="w-6 h-6 text-emerald-300" />}
      </div>
      <div className={`max-w-xl p-4 rounded-2xl ${isBot ? 'bg-stone-800 text-stone-300 rounded-tl-none' : 'bg-emerald-900/80 text-emerald-100 rounded-tr-none'}`}>
        {isTyping ? (
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-stone-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-stone-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-stone-500 rounded-full animate-pulse"></span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.text}</p>
        )}
      </div>
    </div>
  );
};
