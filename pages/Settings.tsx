
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { 
  Shield, 
  Cpu, 
  Bell, 
  Eye, 
  Lock,
  ChevronRight,
  Bot
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    driftDetection: true,
    autoTaskAssignment: false,
    aiNoiseFiltering: true,
    realTimeTranscription: true,
    privacyMode: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
        <p className="text-gray-400">Manage Sentinel's cognitive thresholds and integration endpoints.</p>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            AI Intelligence Engine
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Institutional Drift Detection</p>
                <p className="text-xs text-gray-500">Enable real-time auditing of technical decisions.</p>
              </div>
              <button 
                onClick={() => toggle('driftDetection')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.driftDetection ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.driftDetection ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Auto Task Assignment</p>
                <p className="text-xs text-gray-500">Allow Sentinel to create and assign tasks based on meeting context.</p>
              </div>
              <button 
                onClick={() => toggle('autoTaskAssignment')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoTaskAssignment ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoTaskAssignment ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            Communication & Privacy
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">High-Fidelity Transcription</p>
                <p className="text-xs text-gray-500">Index raw audio streams for deep semantic search.</p>
              </div>
              <button 
                onClick={() => toggle('realTimeTranscription')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.realTimeTranscription ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.realTimeTranscription ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Deep Privacy Mode</p>
                <p className="text-xs text-gray-500">Redact PII from institutional memory logs.</p>
              </div>
              <button 
                onClick={() => toggle('privacyMode')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.privacyMode ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.privacyMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Lock className="w-6 h-6 text-gray-500" />
              <div>
                <p className="font-bold">Security Audit Log</p>
                <p className="text-xs text-gray-500">Review all AI access and decision overrides.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
