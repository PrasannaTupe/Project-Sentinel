
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { 
  Database, 
  Code2, 
  TestTube2, 
  Rocket, 
  ChevronRight,
  Workflow,
  ShieldCheck,
  Cpu,
  Info
} from 'lucide-react';

const STEPS = [
  { icon: Database, label: 'Backlog', desc: 'AI-prioritized roadmap items based on meeting outcomes.', color: 'text-gray-400', details: 'Sentinel reviews transcript history from the last 6 months to weight backlog items based on developer velocity and technical debt mentions.' },
  { icon: Workflow, label: 'Planning', desc: 'Automated sprint scoping and drift check.', color: 'text-blue-400', details: 'Each planned ticket is run through the Drift Detection engine to verify it aligns with architectural precedents established in previous Design Review meetings.' },
  { icon: Code2, label: 'Development', desc: 'Active coding sync with real-time decision logging.', color: 'text-purple-400', details: 'CI hooks automatically index commit messages and PR discussions into the Institutional Memory database.' },
  { icon: TestTube2, label: 'Testing', desc: 'Automated QA cycles and performance benchmarking.', color: 'text-yellow-400', details: 'Test results are analyzed by AI to detect performance drifts that correlate with specific architectural changes.' },
  { icon: Rocket, label: 'Deployment', desc: 'Canary releases and active drift monitoring.', color: 'text-green-400', details: 'Post-deployment metrics are fed back into the next iteration of the Backlog for continuous refinement.' },
];

export const Lifecycle: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">The Sentinel Lifecycle</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A continuous loop of intelligence. Click any phase to see how Sentinel integrates with your engineering workflow.
        </p>
      </div>

      <div className="relative flex flex-col gap-8">
        {STEPS.map((step, idx) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-8 group"
          >
            <div className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:neon-border-purple transition-all cursor-pointer ${activeStep === step.label ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setActiveStep(activeStep === step.label ? null : step.label)}>
              <step.icon className={`w-10 h-10 ${step.color}`} />
            </div>

            <GlassCard 
              className={`flex-1 flex flex-col transition-all cursor-pointer ${activeStep === step.label ? 'border-blue-500/50' : ''}`}
              onClick={() => setActiveStep(activeStep === step.label ? null : step.label)}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-xl font-bold mb-1">{step.label}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
                <Info className={`w-5 h-5 transition-colors ${activeStep === step.label ? 'text-blue-400' : 'text-gray-600'}`} />
              </div>
              
              <AnimatePresence>
                {activeStep === step.label && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-white/5"
                  >
                    <p className="text-sm text-blue-100 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                      {step.details}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="bg-gradient-to-br from-blue-600/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <Cpu className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold">Institutional Guardrails</h3>
          </div>
          <p className="text-sm text-gray-400">
            Our AI engine runs continuous "Drift Checks" during the Planning and Development phases to ensure 
            no developer is working against historical architecture decisions without explicit manager override.
          </p>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-green-600/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold">Compliance Automations</h3>
          </div>
          <p className="text-sm text-gray-400">
            In the Testing and Deployment phases, Sentinel automatically generates audit logs, 
            connecting every line of code to a specific meeting minute and decision record.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
