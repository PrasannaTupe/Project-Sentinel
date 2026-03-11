
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../store';
import { GlassCard } from '../components/GlassCard';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  AlertCircle,
  Gavel,
  Cpu,
  MessageSquare,
  Hash,
  Send,
  Sparkles,
  Bot,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage } from '../types';

export const MeetingDetail: React.FC = () => {
  const { id } = useParams();
  const { getMeetingById } = useApp();
  const meeting = getMeetingById(id || '');

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!meeting) {
    // If we have no meetings in store yet, we are likely still loading
    const { meetings } = useApp();
    if (meetings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-blue-500 animate-spin" />
          <p className="text-gray-400">Loading meeting context...</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-4">Meeting Not Found</h2>
        <Link to="/meetings" className="text-blue-400 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
      </div>
    );
  }

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: chatInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Use backend RAG/Context
      const response = await api.askMeeting(id || '', chatInput);
      const assistantMsg: ChatMessage = { role: 'assistant', content: response.answer, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Failed to reach Sentinel Core.", timestamp: new Date() }]);
    }

    setIsTyping(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/meetings" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{meeting.title}</h1>
          <p className="text-gray-400 font-mono text-sm">{meeting.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <GlassCard className="bg-blue-500/5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              Executive Summary
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {meeting.summary}
            </p>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Decisions */}
            <GlassCard>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-purple-400" />
                Decisions
              </h3>
              <ul className="space-y-3">
                {meeting.decisions?.map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Action Items */}
            <GlassCard>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Action Items
              </h3>
              <ul className="space-y-3">
                {meeting.actionItems?.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                    {a}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Technical Choices */}
          <GlassCard className="bg-purple-500/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              Technical Specifications
            </h3>
            <div className="flex flex-wrap gap-3">
              {meeting.technicalChoices?.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-mono">
                  {c}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Meeting Specific Chatbot */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold flex items-center gap-2 px-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Ask about this Meeting
            </h3>
            <GlassCard className="bg-black/20 p-0 flex flex-col h-[400px] overflow-hidden">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2 opacity-50">
                    <Bot className="w-12 h-12 mb-2" />
                    <p className="text-sm">I have indexed this meeting's context.<br />Ask me why decisions were made or who is responsible for what.</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-blue-600/20 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
                        {m.role === 'user' ? <User className="w-4 h-4 text-blue-400" /> : <Bot className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                        ? 'bg-blue-600/20 border border-blue-500/30 text-white'
                        : 'bg-white/5 border border-white/10 text-gray-200'
                        }`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-3 rounded-2xl animate-pulse flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/5 bg-black/40">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="E.g. What were the main risks identified for NestJS?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-gray-600"
                  />
                  <button
                    onClick={handleSendChat}
                    className="absolute right-3 top-2.5 p-1.5 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="space-y-6">
          {/* Participants */}
          <GlassCard>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              Participants
            </h3>
            <div className="space-y-3">
              {meeting.participants?.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-xs">
                    {p[0]}
                  </div>
                  <span className="text-sm text-gray-300">{p}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Risks */}
          <GlassCard className="border-red-500/20">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Identified Risks
            </h3>
            <ul className="space-y-3">
              {meeting.risks?.map((r, i) => (
                <li key={i} className="text-xs text-gray-400 bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                  {r}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Tags */}
          <GlassCard>
            <h3 className="font-bold mb-4">Metadata</h3>
            <div className="flex flex-wrap gap-2">
              {meeting.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 italic">
                  <Hash className="w-2 h-2" /> {tag}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
