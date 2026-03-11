
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'completed';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  assignedBy: 'AI' | 'Manager' | string;
  meetingSource?: string;
  description: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  participants: string[];
  tags: string[];
  summary: string;
  decisions: string[];
  actionItems: string[];
  risks: string[];
  technicalChoices: string[];
}

export interface DriftAlert {
  id: string;
  category: string; // New field
  oldDecision: string;
  newStatement: string;
  confidence: number;
  status: 'pending' | 'confirmed' | 'false-alarm' | 'escalated';
  date: string;
}

export interface UserProfile {
  name: string;
  productivityScore: number;
  streak: number;
  xp: number;
  level: number;
  badges: string[];
  employmentType: string;
  email: string;
  joinDate: string;
  department: string;
  bio: string;
  avatarUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
