
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../store';
import { GlassCard } from '../components/GlassCard';
import { UploadModal } from '../components/UploadModal';
import {
  Calendar,
  Users,
  Hash,
  ChevronRight,
  FileText,
  Bot,
  Sparkles,
  Send,
  MessageSquare,
  History,
  Search,
  Zap,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ChatMessage, Meeting } from '../types';

export const Meetings: React.FC = () => {
  const { searchTerm } = useApp();
  const [localMeetings, setLocalMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I am Sentinel's Institutional Memory core. I have indexed all historical meetings. Ask me anything.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Meetings
  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await api.getMeetings();

      const adapted: Meeting[] = data.map((m: any) => ({
        id: m._id,
        title: m.title,
        date: new Date(m.date).toLocaleDateString(),
        participants: m.attendees || [],
        summary: m.summary || 'No summary available.',
        tags: ['New'],
        mediaUrl: m.videoPath,
        transcription: m.transcript,
        decisions: [],
        actionItems: [],
        risks: [],
        technicalChoices: []
      }));
      setLocalMeetings(adapted);
    } catch (e) {
      console.error("Failed to fetch meetings", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const filteredMeetings = useMemo(() => {
    if (!searchTerm) return localMeetings;
    const term = searchTerm.toLowerCase();
    return localMeetings.filter(m =>
      m.title.toLowerCase().includes(term) ||
      m.summary.toLowerCase().includes(term) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(term)))
    );
  }, [localMeetings, searchTerm]);

  const handleGlobalChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: chatInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await api.askGlobal(chatInput);
      const assistantMsg: ChatMessage = { role: 'assistant', content: response.answer, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sentinel Core Unreachable", timestamp: new Date() }]);
    }

    setIsTyping(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={fetchMeetings}
      />

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Institutional Memory
          </h1>
          <p className="text-gray-400">Search across meeting history and indexed decisions with Sentinel AI.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUploadOpen(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Process New Meeting
        </motion.button>
      </div>

      {/* Full-Width Main Chatbot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Global Knowledge Base
          </h2>
          <div className="text-[10px] font-mono text-blue-400 flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Deep Semantic Indexing Active
          </div>
        </div>

        <GlassCard className="p-0 flex flex-col h-[500px] overflow-hidden border-blue-500/20 bg-gradient-to-b from-blue-900/5 to-transparent">
          {/* Chat area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/20">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-4 max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg ${m.role === 'user' ? 'bg-blue-600/20 border-blue-500/30' : 'bg-purple-600/20 border-purple-500/30'
                    }`}>
                    {m.role === 'user' ? <History className="w-5 h-5 text-blue-400" /> : <Bot className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xl ${m.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                    }`}>
                    {m.content}
                    <div className={`text-[10px] mt-2 opacity-40 font-mono ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGlobalChatSend()}
                placeholder="Ask about previous meetings, architectural drifts, or project outcomes..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-gray-500 transition-all shadow-inner"
              />
              <button
                onClick={handleGlobalChatSend}
                disabled={!chatInput.trim() || isTyping}
                className="absolute right-2 top-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:scale-100 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* History Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            Meeting History
          </h2>
          <div className="text-xs text-gray-500 font-mono">
            {filteredMeetings.length} Records found
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center gap-4 opacity-30">
            <Calendar className="w-12 h-12" />
            <p className="text-gray-500">No records found. Upload a meeting to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting, idx) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/meetings/${meeting.id}`}>
                  <GlassCard className="h-full flex flex-col group border border-white/5 hover:border-blue-500/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {meeting.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-3 group-hover:text-blue-400 transition-colors relative z-10">{meeting.title}</h3>

                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-6 relative z-10">
                      <div className="flex -space-x-2">
                        {meeting.participants && meeting.participants.slice(0, 3).map((p, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-black flex items-center justify-center text-[10px] font-bold ring-1 ring-white/10">
                            {p[0]}
                          </div>
                        ))}
                      </div>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {meeting.participants?.length || 0} present</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto mb-4 relative z-10">
                      {meeting.tags && meeting.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono">
                          <Hash className="w-2 h-2" /> {tag}
                        </span>
                      ))}
                    </div>

                    <div className="relative z-10 bg-white/5 rounded-xl p-3 mb-4">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Summary</p>
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-6">
                        {meeting.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1 text-xs text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
                      EXPLORE CONTEXT <ChevronRight className="w-3 h-3" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
