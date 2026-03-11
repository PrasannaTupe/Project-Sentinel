
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { GlassCard } from '../components/GlassCard';
import {
  Zap,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  BarChart3,
  Flame,
  MessageSquare,
  ListTodo,
  FileText,
  Calendar,
  Gavel,
  X,
  User,
  Bot,
  Video,
  FileUp,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { TaskStatus, Task, TodoItem } from '../types';

const CHART_DATA = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 7 },
  { name: 'Wed', tasks: 5 },
  { name: 'Thu', tasks: 9 },
  { name: 'Fri', tasks: 12 },
  { name: 'Sat', tasks: 3 },
  { name: 'Sun', tasks: 1 },
];

export const Dashboard: React.FC = () => {
  const { tasks, user, updateTaskStatus, addTask, deleteTask, searchTerm, todoItems, addTodoItem, removeTodoItem, meetings } = useApp();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Todo Modal State
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDesc, setNewTodoDesc] = useState('');

  // Meeting Upload Modal State
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingSource, setMeetingSource] = useState<'video' | 'transcript'>('video');
  const [transcriptText, setTranscriptText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const latestMeeting = meetings[0]; // Assuming sorted by date

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const columns: { label: string; status: TaskStatus; color: string }[] = [
    { label: 'Not Started', status: 'todo', color: 'bg-slate-500/20' },
    { label: 'In Progress', status: 'in-progress', color: 'bg-blue-500/20' },
    { label: 'Blocked', status: 'blocked', color: 'bg-red-500/20' },
    { label: 'Completed', status: 'completed', color: 'bg-green-500/20' },
  ];

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, status);
      setDraggedTaskId(null);
    } else if (draggedTodoId) {
      const todo = todoItems.find(t => t.id === draggedTodoId);
      if (todo) {
        addTask(todo.title, 'medium', todo.description);
        removeTodoItem(todo.id);
      }
      setDraggedTodoId(null);
    }
  };

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodoItem(newTodoTitle, newTodoDesc);
      setNewTodoTitle('');
      setNewTodoDesc('');
      setIsTodoModalOpen(false);
    }
  };

  const handleProcessMeeting = () => {
    setIsProcessing(true);
    // Simulate AI Indexing
    setTimeout(() => {
      setIsProcessing(false);
      setIsMeetingModalOpen(false);
      setTranscriptText('');
      alert("Institutional memory updated! Sentinel AI has indexed the new meeting data.");
    }, 2500);
  };

  const handleOffload = () => {
    alert("Sentinel AI is analyzing team capacity to offload task. Suggestion pending...");
  };

  const handleViewArchive = () => {
    alert("Opening indexed archives for similar technical patterns...");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 relative">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <span className="text-blue-400 font-mono">Sentinel AI</span> has identified 3 risk factors in the current sprint.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">XP Points</p>
            <p className="text-2xl font-bold text-blue-400">{user.xp}</p>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Streak</p>
            <div className="flex items-center gap-1 text-2xl font-bold text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
              {user.streak}d
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Left: Task Workspace (2 cols) */}
        <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between h-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Task Workspace
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[550px] overflow-hidden">
            {columns.map((col) => (
              <div
                key={col.status}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.status)}
                className={`rounded-2xl border border-white/5 flex flex-col p-3 transition-colors ${col.color} h-full`}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{col.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    {filteredTasks.filter(t => t.status === col.status).length}
                  </span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                  {filteredTasks.filter(t => t.status === col.status).map((task) => (
                    <motion.div
                      key={task.id}
                      draggable
                      onDragStart={() => { setDraggedTaskId(task.id); setDraggedTodoId(null); }}
                      layoutId={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="glass-dark p-4 rounded-xl border border-white/5 cursor-pointer hover:border-blue-500/50 transition-colors group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${task.priority === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          task.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                          {task.priority.toUpperCase()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                            title="Delete Task"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          <div className="relative group/avatar">
                            <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold shadow-sm ${task.assignedBy === 'AI' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'}`}>
                              {task.assignedBy === 'AI' ? <Bot className="w-3.5 h-3.5" /> : (task.assignedBy[0] || 'U')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">{task.title}</h4>

                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.dueDate}</span>
                        <MessageSquare className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Personal To-Do (1 col) */}
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between h-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-purple-400" />
              Personal To-Do
            </h2>
            <button
              onClick={() => setIsTodoModalOpen(true)}
              className="p-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <GlassCard className="flex-1 p-4 flex flex-col overflow-hidden bg-purple-500/5 border-purple-500/10">
            <p className="text-[10px] text-purple-400 font-bold uppercase mb-4 tracking-widest">Scratchpad (Drag to Workspace)</p>
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
              <AnimatePresence>
                {todoItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    draggable
                    onDragStart={() => { setDraggedTodoId(item.id); setDraggedTaskId(null); }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 cursor-grab active:cursor-grabbing transition-all group"
                  >
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-purple-300 transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {todoItems.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-8">
                  <ListTodo className="w-12 h-12 mb-2 text-purple-400" />
                  <p className="text-sm">No items.<br />Click + to add.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Bottom Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Meeting Summary (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Latest Meeting Breakdown
            </h2>
            {/* BIG NEW MEETING BUTTON */}
            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              NEW MEETING
            </button>
          </div>
          <GlassCard className="bg-gradient-to-br from-blue-600/5 to-transparent border-blue-500/10 h-full relative overflow-hidden">
            {latestMeeting ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{latestMeeting.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-mono text-blue-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {latestMeeting.date}</span>
                      <span className="flex items-center gap-1 uppercase tracking-tighter"><Gavel className="w-3 h-3" /> Institutional Record indexed</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {latestMeeting.participants.map((p, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-black flex items-center justify-center text-[10px] font-bold" title={p}>
                        {p[0]}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Synthesis</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {latestMeeting.summary}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Final Decisions</p>
                    <ul className="space-y-3">
                      {latestMeeting.decisions.map((d, i) => (
                        <li key={i} className="flex gap-3 text-sm text-blue-100">
                          <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    {latestMeeting.tags.map(t => (
                      <span key={t} className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">#{t}</span>
                    ))}
                  </div>
                  <Link
                    to={`/meetings/${latestMeeting.id}`}
                    className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                  >
                    OPEN CHAT <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
                <FileText className="w-12 h-12 mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">No Meetings Indexed</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Upload a video or transcript to start building your institutional memory.
                </p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* AI Intelligence & Chart (1 col) */}
        <div className="space-y-6 flex flex-col">
          <GlassCard className="border-blue-500/20 bg-blue-500/5">
            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              System Intelligence
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-3 bg-white/5 rounded-xl border border-white/10">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Capacitance Overflow</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    OAuth2.0 migration tracks 2.5d behind schedule.
                  </p>
                  <button onClick={handleOffload} className="text-[10px] text-blue-400 mt-2 font-bold hover:underline uppercase tracking-tight">
                    DELEGATE <ArrowRight className="w-3 h-3 inline" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 bg-white/5 rounded-xl border border-white/10">
                <Clock className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-400">Memory Match</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Distributed Lock pattern identified in Q1 archives.
                  </p>
                  <button onClick={handleViewArchive} className="text-[10px] text-blue-400 mt-2 font-bold hover:underline uppercase tracking-tight">
                    RESOLVE <ArrowRight className="w-3 h-3 inline" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col min-h-[200px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Team Flow</h3>
              <span className="text-2xl font-bold text-purple-400">{user.productivityScore}%</span>
            </div>
            <div className="flex-1 w-full min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="tasks" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTasks)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Todo Modal Overlay */}
      <AnimatePresence>
        {isTodoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTodoModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-400" />
                  New Scratchpad Item
                </h3>
                <button onClick={() => setIsTodoModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleCreateTodo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Heading</label>
                  <input
                    autoFocus
                    type="text"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="E.g. Refactor Auth Middleware"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500/50 text-white placeholder:text-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Small Description</label>
                  <textarea
                    rows={3}
                    value={newTodoDesc}
                    onChange={(e) => setNewTodoDesc(e.target.value)}
                    placeholder="Add some context for your future self..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500/50 text-white placeholder:text-gray-600 transition-colors resize-none text-sm"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all"
                  >
                    Add to Scratchpad
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Meeting Upload Modal */}
      <AnimatePresence>
        {isMeetingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMeetingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-2xl glass-dark p-10 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              {isProcessing && (
                <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 relative mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                    <div className="absolute inset-0 rounded-full border-t-4 border-blue-400 animate-spin" />
                    <Bot className="absolute inset-0 m-auto w-10 h-10 text-blue-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Sentinel AI Indexing...</h3>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">
                    Synthesizing meeting semantics and cross-referencing institutional memory for potential drifts.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    Expand Institutional Memory
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Add meeting artifact for indexing</p>
                </div>
                <button onClick={() => setIsMeetingModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl mb-8 border border-white/10">
                <button
                  onClick={() => setMeetingSource('video')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${meetingSource === 'video' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  <Video className="w-4 h-4" /> VIDEO SYNC
                </button>
                <button
                  onClick={() => setMeetingSource('transcript')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${meetingSource === 'transcript' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  <FileUp className="w-4 h-4" /> TRANSCRIPT INDEX
                </button>
              </div>

              <div className="space-y-6">
                {meetingSource === 'video' ? (
                  <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:border-blue-500/30 transition-colors group cursor-pointer">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="font-bold text-gray-200">Drop meeting video file here</p>
                    <p className="text-xs text-gray-500 mt-2">MP4, MOV up to 2GB. Sentinel will auto-transcribe.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Meeting Transcript</label>
                    <textarea
                      rows={8}
                      value={transcriptText}
                      onChange={(e) => setTranscriptText(e.target.value)}
                      placeholder="Paste the meeting raw text or key minutes here..."
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-purple-500/50 text-white placeholder:text-gray-600 transition-colors resize-none text-sm leading-relaxed"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setIsMeetingModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm border border-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessMeeting}
                    disabled={meetingSource === 'transcript' && !transcriptText.trim()}
                    className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    Index with Sentinel AI
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                    {selectedTask.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedTask.priority === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    selectedTask.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                    {selectedTask.priority.toUpperCase()}
                  </span>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Description</p>
                  <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedTask.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Assigned by: {selectedTask.assignedBy}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {selectedTask.dueDate}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
