import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../hooks/useUtils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const systemPrompt = `You are a helpful assistant for GDG On Campus IAR (Google Developer Groups On Campus - Institute of Aeronautical Research). 
You help students with:
- Information about upcoming events and workshops
- Technical questions related to Google technologies (Android, Flutter, Firebase, Cloud, AI/ML, etc.)
- Guidance on joining the community and participating in activities
- General programming and development questions

Keep your responses concise, friendly, and helpful. Use emojis occasionally to make conversations engaging.`;

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! 👋 I\'m the GDG On Campus assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useThemeStore((s) => s.theme);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later. 😕'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg bg-[#4285F4] text-white hover:bg-[#3367D6] hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "fixed bottom-24 right-6 z-50 w-[380px] h-[500px] rounded-2xl overflow-hidden",
              "flex flex-col",
              theme === 'dark' 
                ? 'bg-[#0d1b2a]/95 border border-white/10 shadow-2xl' 
                : 'bg-white border border-[#DADCE0] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)]'
            )}
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 bg-[#4285F4] text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-semibold">GDG Assistant</h3>
                <p className="text-xs opacity-80">Powered by Groq</p>
              </div>
            </div>

            {/* Messages */}
            <div className={cn(
              "flex-1 overflow-y-auto p-4 space-y-4",
              theme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'
            )}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'user'
                      ? 'bg-[#4285F4] text-white'
                      : theme === 'dark' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-[#E8F5E9] text-[#34A853]'
                  )}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "max-w-[75%] px-3 py-2 rounded-2xl text-sm",
                    message.role === 'user'
                      ? 'bg-[#4285F4] text-white rounded-tr-sm'
                      : theme === 'dark'
                        ? 'bg-white/10 text-gray-200 rounded-tl-sm'
                        : 'bg-[#F1F3F4] text-[#202124] rounded-tl-sm'
                  )}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    theme === 'dark' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-[#E8F5E9] text-[#34A853]'
                  )}>
                    <Bot size={16} />
                  </div>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl rounded-tl-sm",
                    theme === 'dark' ? 'bg-white/10' : 'bg-[#F1F3F4]'
                  )}>
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={cn(
              "p-3 border-t",
              theme === 'dark' ? 'border-white/10' : 'border-[#E8EAED] bg-[#F8F9FA]'
            )}>
              <div className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2",
                theme === 'dark' ? 'bg-white/5' : 'bg-white border border-[#DADCE0]'
              )}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className={cn(
                    "flex-1 bg-transparent outline-none text-sm",
                    theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-[#202124] placeholder-[#5F6368]'
                  )}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-2 rounded-full transition-all duration-200",
                    input.trim() && !isLoading
                      ? 'bg-[#4285F4] text-white hover:bg-[#3367D6]'
                      : theme === 'dark' 
                        ? 'bg-white/10 text-gray-500' 
                        : 'bg-[#F1F3F4] text-[#80868B]'
                  )}
                  whileHover={input.trim() && !isLoading ? { scale: 1.05 } : {}}
                  whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
