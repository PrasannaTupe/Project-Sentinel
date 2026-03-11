
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../store';
import { GlassCard } from '../components/GlassCard';
import { 
  User, 
  Mail, 
  Calendar, 
  Briefcase, 
  MapPin, 
  Award, 
  Zap, 
  Target, 
  Flame, 
  Hexagon,
  Shield,
  Brain,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { BADGES_MAP } from '../constants';

export const Profile: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-48 rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-50" />
        </div>
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-3xl border-4 border-[#050505] overflow-hidden shadow-2xl relative">
             <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
             <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
          </div>
          <div className="mb-4">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">{user.employmentType}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 pt-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Institutional ID</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">{user.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Joined {user.joinDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">Remote / Global</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-blue-600/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Efficiency Core</h3>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Productivity Score</span>
                  <span className="text-blue-400 font-bold">{user.productivityScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${user.productivityScore}%` }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-y border-white/5">
                <span className="text-xs text-gray-400">Active Streak</span>
                <span className="text-lg font-bold text-orange-400 flex items-center gap-1">
                  <Flame className="w-4 h-4" /> {user.streak}d
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Institutional XP</span>
                <span className="text-lg font-bold text-purple-400">{user.xp.toLocaleString()}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Bio & Badges */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Hexagon className="w-5 h-5 text-blue-400" />
              Profile Synthesis
            </h3>
            <p className="text-gray-300 leading-relaxed italic">
              "{user.bio}"
            </p>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Merit Badges
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {user.badges.map((badge) => {
                  const b = (BADGES_MAP as any)[badge] || { icon: Award, color: "text-gray-400" };
                  return (
                    <div key={badge} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group">
                      <b.icon className={`w-10 h-10 ${b.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-center">{badge}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="bg-purple-600/5">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Current Focus
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs font-bold text-blue-400 uppercase mb-1 tracking-widest">Active Sprint</p>
                  <p className="text-sm font-semibold text-white">OAuth2.0 Migration</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-60">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Upcoming</p>
                  <p className="text-sm font-semibold text-white">Kafka Event Mapping</p>
                </div>
                <button className="w-full text-xs font-bold text-gray-500 hover:text-white flex items-center justify-center gap-2 transition-colors uppercase pt-2">
                  View Roadmap <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </GlassCard>
          </div>
          
          {/* Level Progress */}
          <GlassCard className="border-purple-500/20 bg-purple-500/5">
             <div className="flex justify-between items-end mb-6">
                <div>
                   <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Rank Progression</p>
                   <h3 className="text-2xl font-bold">Level {user.level} Associate</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-500 uppercase font-bold">Next Rank</p>
                   <p className="text-sm font-bold text-white">Level {user.level + 1} Architect</p>
                </div>
             </div>
             <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 relative shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                >
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[pulse_2s_infinite]" />
                </motion.div>
             </div>
             <p className="text-[10px] text-center text-gray-500 mt-3 font-mono">750 XP REQUIRED UNTIL ASCENSION</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
