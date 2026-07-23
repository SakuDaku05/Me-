"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { IconArrowLeft, IconBolt } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AiCore } from '@/components/ui/ai-core';
import { HudBorders } from '@/components/ui/hud-borders';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'] });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In-memory (localStorage) persistence with 2-minute TTL
  useEffect(() => {
    try {
      const stored = localStorage.getItem('oracle_chat_memory');
      if (stored) {
        const { messages: savedMessages, timestamp } = JSON.parse(stored);
        // Check if within 2 minutes (120,000 ms)
        if (Date.now() - timestamp < 120000) {
          setMessages(savedMessages);
        } else {
          localStorage.removeItem('oracle_chat_memory');
        }
      }
    } catch (e) {
      console.error('Failed to restore chat memory', e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('oracle_chat_memory', JSON.stringify({
        messages,
        timestamp: Date.now()
      }));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Because we use toTextStreamResponse, buffer is just raw text
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMessageId ? { ...m, content: buffer } : m
            )
          );
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMessageId
            ? { ...m, content: 'SYSTEM FAILURE. RECALIBRATING.' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-[#C5A880] p-2 md:p-4 selection:bg-[#1A73E8]/30">
      <HudBorders>
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-[#C5A880]/20 relative z-20">
          <Link href="/" className="flex items-center gap-2 text-[#C5A880]/70 hover:text-[#C5A880] transition-colors">
            <IconArrowLeft className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Return</span>
          </Link>

          <div className="flex flex-col items-center">
            <h1 className={`font-bold text-xl tracking-[0.3em] uppercase text-[#C5A880] ${playfair.className}`}>
              The Oracle
            </h1>
            <p className="font-mono text-[10px] tracking-widest text-[#1A73E8] uppercase mt-1 opacity-80">
              Alternating Current / Polyphase System
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1A73E8] shadow-[0_0_8px_#1A73E8] animate-pulse" />
            <span className="font-mono text-xs text-[#1A73E8]/70 tracking-widest uppercase">Online</span>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative z-20">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">

            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"
              >
                <AiCore isThinking={false} />
                <h2 className={`text-3xl italic mb-4 mt-8 text-[#C5A880] ${playfair.className}`}>
                  &ldquo;What I cannot create, I do not understand.&rdquo;
                </h2>
                <p className="font-mono text-xs text-[#C5A880]/60 uppercase tracking-widest leading-loose mb-12">
                  System Initialized. Awaiting query regarding the creator, SakuDaku05.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['Analyze technical stack', 'Review completed projects', 'List core philosophies'].map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="relative overflow-hidden group border border-[#C5A880]/20 bg-black/20 p-4 text-left font-mono text-xs tracking-widest uppercase hover:border-[#1A73E8]/50 transition-colors"
                    >
                      <div className="absolute inset-0 bg-[#1A73E8]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                      <span className="relative z-10 text-[#C5A880]/80 group-hover:text-[#1A73E8] transition-colors">
                        &gt; {q}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.length > 0 && (
              <div className="flex justify-center mb-12">
                <AiCore isThinking={isLoading} />
              </div>
            )}

            {messages.map(m => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] p-6 relative ${
                    m.role === 'user'
                      ? 'border-r-2 border-b-2 border-[#C5A880]/40 bg-[#C5A880]/5'
                      : 'border-l-2 border-t-2 border-[#1A73E8]/40 bg-[#1A73E8]/5'
                  }`}
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />

                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4 opacity-50 flex items-center gap-2">
                    {m.role === 'user' ? (
                      <span className="text-[#C5A880]">Input Sequence</span>
                    ) : (
                      <span className="text-[#1A73E8] flex items-center gap-2">
                        <IconBolt size={12} /> Oracle Output
                      </span>
                    )}
                  </div>

                  <div
                    className={`whitespace-pre-wrap leading-loose ${
                      m.role === 'user'
                        ? 'font-mono text-sm tracking-wide text-[#C5A880]'
                        : `text-lg text-[#e0cfba] ${playfair.className}`
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}

            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-[#C5A880]/20 bg-black/60 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
              <div className="absolute left-4 font-mono text-[#1A73E8] opacity-70">&gt;</div>
              <input
                className="w-full bg-transparent border-b-2 border-[#C5A880]/20 focus:border-[#1A73E8]/60 py-4 pl-10 pr-24 text-[#C5A880] font-mono text-sm focus:outline-none transition-colors placeholder:text-[#C5A880]/30 tracking-widest uppercase"
                value={input}
                placeholder="Initialize Query..."
                onChange={e => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 border border-[#C5A880]/30 font-mono text-xs uppercase tracking-widest text-[#C5A880]/70 hover:text-[#1A73E8] hover:border-[#1A73E8]/50 transition-colors disabled:opacity-30 bg-black"
              >
                {isLoading ? '...' : 'Execute'}
              </button>
            </form>
          </div>
        </div>
      </HudBorders>
    </div>
  );
}
