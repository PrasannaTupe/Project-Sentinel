
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../store';
import { GlassCard } from '../components/GlassCard';
import {
  AlertCircle,
  History,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Hash
} from 'lucide-react';
import { DriftAlert } from '../types';

type FilterStatus = 'all' | DriftAlert['status'];

export const DriftCenter: React.FC = () => {
  const { drifts, resolveDrift, deleteDrift } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const filteredDrifts = useMemo(() => {
    if (activeFilter === 'all') return drifts;
    return drifts.filter(d => d.status === activeFilter);
  }, [drifts, activeFilter]);

  const filterButtons: { label: string; value: FilterStatus; icon: any }[] = [
    { label: 'All Drifts', value: 'all', icon: Filter },
    { label: 'Pending', value: 'pending', icon: Clock },
    { label: 'Confirmed', value: 'confirmed', icon: CheckCircle },
    { label: 'False Alarms', value: 'false-alarm', icon: XCircle },
    { label: 'Escalated', value: 'escalated', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Drift Detection Center</h1>
          <p className="text-gray-400">Institutional memory audit system. Identifying contradictions in technical decisions.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl border border-red-500/20 text-sm font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            {drifts.filter(d => d.status === 'pending').length} ACTIVE DRIFTS
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setActiveFilter(btn.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeFilter === btn.value
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <btn.icon className="w-3.5 h-3.5" />
            {btn.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDrifts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 bg-white/5 rounded-3xl border border-white/10"
            >
              <div className="flex flex-col items-center gap-4 opacity-30">
                <Filter className="w-12 h-12" />
                <p className="text-gray-500 font-medium">No {activeFilter === 'all' ? '' : activeFilter} drifts found.</p>
              </div>
            </motion.div>
          ) : (
            filteredDrifts.map((drift, idx) => (
              <motion.div
                key={drift.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className={`border-l-4 ${drift.status === 'pending' ? 'border-l-red-500' :
                  drift.status === 'confirmed' ? 'border-l-green-500' :
                    drift.status === 'false-alarm' ? 'border-l-gray-500 opacity-60' :
                      'border-l-orange-500'
                  }`}>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Category Display */}
                    <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl min-w-[150px] text-center">
                      <span className="p-3 rounded-full bg-blue-500/10 mb-3 border border-blue-500/20">
                        <Hash className="w-6 h-6 text-blue-400" />
                      </span>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Category</p>
                      <h3 className="text-sm font-bold text-white leading-tight">{drift.category}</h3>
                    </div>

                    {/* The Contradiction */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                          <History className="w-3 h-3" /> PREVIOUS DECISION ({drift.date})
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl italic text-gray-400 border border-white/5 text-sm">
                          "{drift.oldDecision}"
                        </div>
                      </div>

                      <div className="flex items-center justify-center md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
                        <div className="bg-black/80 p-2 rounded-full border border-white/20 shadow-xl">
                          <Zap className="w-6 h-6 text-yellow-400" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                          <AlertCircle className="w-3 h-3" /> NEW STATEMENT DETECTED
                        </div>
                        <div className="p-4 bg-blue-500/10 rounded-xl font-medium border border-blue-500/20 text-sm">
                          "{drift.newStatement}"
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-center gap-3 min-w-[180px]">
                      {drift.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => resolveDrift(drift.id, 'confirmed')}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" /> CONFIRM CHANGE
                          </button>
                          <button
                            onClick={() => resolveDrift(drift.id, 'false-alarm')}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold border border-white/10 transition-colors"
                          >
                            <XCircle className="w-4 h-4 text-gray-400" /> FALSE ALARM
                          </button>

                          <button
                            onClick={() => deleteDrift(drift.id)}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-bold border border-red-500/20 transition-colors mt-2"
                          >
                            <XCircle className="w-4 h-4" /> DELETE
                          </button>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                            <p className={`text-sm font-bold ${drift.status === 'confirmed' ? 'text-green-400' :
                              drift.status === 'false-alarm' ? 'text-gray-400' :
                                'text-orange-400'
                              }`}>
                              {drift.status.toUpperCase().replace('-', ' ')}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteDrift(drift.id)}
                            className="flex items-center justify-center gap-2 w-full py-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg text-xs font-bold transition-all"
                          >
                            DELETE ALERT
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
