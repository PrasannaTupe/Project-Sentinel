
import React from 'react';
import { Task, Meeting, DriftAlert, UserProfile } from './types';
import { 
  Shield, 
  Target, 
  Flame, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  User,
  LayoutDashboard,
  Calendar,
  Layers,
  Activity,
  Settings
} from 'lucide-react';

export const MOCK_USER: UserProfile = {
  name: "Alex Rivera",
  productivityScore: 88,
  streak: 12,
  xp: 4250,
  level: 5,
  badges: ["Drift Slayer", "Meeting Master", "Sprint King"],
  employmentType: "Senior Lead Developer",
  email: "alex.rivera@sentinel.ai",
  joinDate: "January 2023",
  department: "Core Intelligence",
  bio: "Architecting the future of distributed team coordination. Expert in event-driven systems and institutional memory optimization.",
  avatarUrl: "https://picsum.photos/id/64/200/200"
};

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Migrate legacy Auth to OAuth2.0',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-05-20',
    assignedBy: 'AI',
    meetingSource: 'Security Sync #4',
    description: 'Update the identity provider to support modern standards and improve security posture.'
  },
  {
    id: '2',
    title: 'Design System Polish: Cards',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-05-22',
    assignedBy: 'Manager',
    meetingSource: 'UI/UX Weekly',
    description: 'Implement glassmorphism effects across all dashboard cards.'
  },
  {
    id: '3',
    title: 'Fix race condition in Task Sync',
    priority: 'critical',
    status: 'blocked',
    dueDate: '2024-05-18',
    assignedBy: 'AI',
    meetingSource: 'Post-mortem 05-15',
    description: 'Investigation needed: Distributed locking is failing under high concurrency.'
  },
  {
    id: '4',
    title: 'API Documentation Update',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-05-15',
    assignedBy: 'Manager',
    description: 'Ensure Swagger/OpenAPI reflects the latest V3 endpoints.'
  }
];

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Architecture Review: Micro-services',
    date: '2024-05-15',
    participants: ['Alex', 'Sarah', 'Sentinel AI'],
    tags: ['Architecture', 'Tech-Debt'],
    summary: 'Decided to move from monolith to domain-driven micro-services to handle scale.',
    decisions: [
      'Adopt NestJS for new services',
      'Use Kafka for event-driven communication',
      'Phase out old PHP monolith by Q4'
    ],
    actionItems: [
      'Alex to draft initial service boundaries',
      'Sarah to setup CI/CD for Nest templates'
    ],
    risks: [
      'High latency during transition phase',
      'Initial overhead for smaller features'
    ],
    technicalChoices: ['Redis for caching', 'Postgres for primary storage']
  },
  {
    id: 'm2',
    title: 'Weekly UI/UX Alignment',
    date: '2024-05-14',
    participants: ['Alex', 'Kevin'],
    tags: ['Design', 'UX'],
    summary: 'Focused on the "Institutional Memory" feature set.',
    decisions: ['Implement Glassmorphism globally', 'AI should be a persistent float'],
    actionItems: ['Kevin to provide figma tokens'],
    risks: ['Performance impact of excessive blurs'],
    technicalChoices: ['Tailwind CSS', 'Framer Motion']
  }
];

export const MOCK_DRIFTS: DriftAlert[] = [
  {
    id: 'd1',
    oldDecision: "We will use MongoDB for all data persistence.",
    newStatement: "Postgres is now the primary standard for structured data.",
    confidence: 0.94,
    status: 'pending',
    date: '2024-05-16'
  },
  {
    id: 'd2',
    oldDecision: "Frontend deployment happens manually via Jenkins.",
    newStatement: "All frontend builds are automated through Vercel triggers.",
    confidence: 0.88,
    status: 'confirmed',
    date: '2024-05-15'
  }
];

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Meetings', path: '/meetings' },
  { icon: Target, label: 'Drift Center', path: '/drift' },
  { icon: Layers, label: 'Lifecycle', path: '/lifecycle' },
  { icon: Activity, label: 'Manager View', path: '/admin' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const BADGES_MAP = {
  "Drift Slayer": { icon: Shield, color: "text-blue-400" },
  "Meeting Master": { icon: Brain, color: "text-purple-400" },
  "Sprint King": { icon: Zap, color: "text-yellow-400" },
  "Task Finisher": { icon: CheckCircle, color: "text-green-400" }
};
