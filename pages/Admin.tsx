
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../store';
import { GlassCard } from '../components/GlassCard';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  BarChart2,
  CheckCircle,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const TEAM_DATA = [
  { name: 'Alex', completed: 12, efficiency: 94 },
  { name: 'Sarah', completed: 15, efficiency: 88 },
  { name: 'Kevin', completed: 8, efficiency: 76 },
  { name: 'Maria', completed: 18, efficiency: 92 },
];

export const Admin: React.FC = () => {
  const { tasks, drifts } = useApp();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingDrifts = drifts.filter(d => d.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manager Intelligence</h1>
          <p className="text-gray-400 font-mono text-sm">Team overview and system-wide bottleneck detection.</p>
        </div>
        <div className="flex gap-4">
          <GlassCard className="py-2 px-6 flex items-center gap-3" hover={false}>
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-bold">4 Contributors</span>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col items-center justify-center text-center">
          <Activity className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-xs text-gray-500 uppercase font-bold">Velocity</p>
          <p className="text-3xl font-bold">14.2/wk</p>
        </GlassCard>
        <GlassCard className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-xs text-gray-500 uppercase font-bold">Throughput</p>
          <p className="text-3xl font-bold">{((completedTasks/totalTasks)*100).toFixed(0)}%</p>
        </GlassCard>
        <GlassCard className="flex flex-col items-center justify-center text-center border-red-500/20">
          <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
          <p className="text-xs text-gray-500 uppercase font-bold">Risk Level</p>
          <p className="text-3xl font-bold text-red-400">{pendingDrifts > 0 ? 'HIGH' : 'LOW'}</p>
        </GlassCard>
        <GlassCard className="flex flex-col items-center justify-center text-center">
          <Target className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-xs text-gray-500 uppercase font-bold">Goal Alignment</p>
          <p className="text-3xl font-bold text-purple-400">98.4%</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            Team Performance Matrix
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEAM_DATA}>
                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {TEAM_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.efficiency > 90 ? '#3b82f6' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            AI Risk Detection
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm font-bold text-red-400">Bottleneck: Database Migration</p>
              <p className="text-xs text-gray-400 mt-1">High workload detected for Sarah. 3 critical blockers assigned.</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-sm font-bold text-yellow-400">Warning: Decision Conflict</p>
              <p className="text-xs text-gray-400 mt-1">Institutional memory drift (ID: #d1) is unresolved for 48h.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
