
import React, { createContext, useContext, useState, useMemo } from 'react';
import { Task, Meeting, DriftAlert, UserProfile, TodoItem } from './types';
import { MOCK_TASKS, MOCK_MEETINGS, MOCK_DRIFTS, MOCK_USER } from './constants';
import { api } from './services/api';

interface AppContextType {
  tasks: Task[];
  meetings: Meeting[];
  drifts: DriftAlert[];
  user: UserProfile;
  todoItems: TodoItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addTask: (title: string, priority: Task['priority'], description?: string) => void;
  deleteTask: (taskId: string) => void;
  addTodoItem: (title: string, description: string) => void;
  removeTodoItem: (id: string) => void;
  resolveDrift: (driftId: string, status: DriftAlert['status']) => void;
  deleteDrift: (driftId: string) => void;
  getMeetingById: (id: string) => Meeting | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [drifts, setDrifts] = useState<DriftAlert[]>([]);
  const [user] = useState<UserProfile>(MOCK_USER);
  const [searchTerm, setSearchTerm] = useState('');
  const [todoItems, setTodoItems] = useState<TodoItem[]>([
    { id: 't1', title: 'Review Auth PR', description: 'Check for potential race conditions.' },
    { id: 't2', title: 'Update dependencies', description: 'Need to bump react-router-dom.' }
  ]);

  // Fetch real data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTasks, fetchedMeetings, fetchedDrifts] = await Promise.all([
          api.getTasks(),
          api.getMeetings(),
          api.getDrift()
        ]);

        // Adapt Tasks
        // Backend Task: { title, assignee, priority, status, meetingId, ... }
        // Frontend Task: { id, title, status, priority, dueDate, assignedBy, description }
        const adaptedTasks: Task[] = fetchedTasks.map((t: any) => ({
          id: t._id,
          title: t.title,
          status: t.status === 'pending' ? 'todo' : (t.status || 'todo'),
          priority: (t.priority?.toLowerCase() as any) || 'medium',
          dueDate: new Date().toISOString().split('T')[0], // Default to today if missing
          assignedBy: t.assignee || 'AI',
          description: `From meeting: ${t.meetingId?.title || 'Unknown'}`
        }));
        setTasks(adaptedTasks);

        // Adapt Meetings (if needed, but Meetings page handles its own currently. 
        // We should unify this, but for now lets popuplate store's meetings too for dashboard)
        const adaptedMeetings: Meeting[] = fetchedMeetings.map((m: any) => ({
          id: m._id,
          title: m.title,
          date: new Date(m.createdAt || Date.now()).toLocaleDateString(),
          participants: m.attendees && m.attendees.length > 0 ? m.attendees : ['You', 'AI'],
          summary: m.summary || "No summary available.",
          decisions: m.decisions || [],
          actionItems: m.actionItems || [],
          risks: m.risks || [],
          technicalChoices: m.technicalChoices || [],
          tags: m.tags || ['Synced'],
          transcript: m.transcript || ""
        }));
        setMeetings(adaptedMeetings);

        // Adapt Drifts from Decisions
        // Only consider decisions with a proposed change as "drifts"
        const adaptedDrifts: DriftAlert[] = fetchedDrifts
          .filter((d: any) => d.proposedValue)
          .map((d: any) => ({
            id: d._id,
            category: d.category || 'General Strategy', // Default category
            oldDecision: d.currentValue,
            newStatement: d.proposedValue,
            confidence: 0.85, // Mock confidence for now or store in DB
            status: 'pending', // Force pending initially as requested
            date: new Date(d.createdAt).toLocaleDateString()
          }));
        setDrifts(adaptedDrifts);

      } catch (e) {
        console.error("Failed to fetch initial data", e);
      }
    };
    fetchData();
  }, []);

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTask = (title: string, priority: Task['priority'], description?: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      priority,
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
      assignedBy: 'Manager',
      description: description || 'Newly created task.'
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error("Failed to delete task", e);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const addTodoItem = (title: string, description: string) => {
    const newItem: TodoItem = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description
    };
    setTodoItems(prev => [newItem, ...prev]);
  };

  const removeTodoItem = (id: string) => {
    setTodoItems(prev => prev.filter(item => item.id !== id));
  };

  const resolveDrift = (driftId: string, status: DriftAlert['status']) => {
    setDrifts(prev => prev.map(d => d.id === driftId ? { ...d, status } : d));
  };

  const deleteDrift = (driftId: string) => {
    setDrifts(prev => prev.filter(d => d.id !== driftId));
  };

  const getMeetingById = (id: string) => meetings.find(m => m.id === id);

  return (
    <AppContext.Provider value={{
      tasks,
      meetings,
      drifts,
      user,
      todoItems,
      searchTerm,
      setSearchTerm,
      // setTasks, // This was not in the original AppContextType, so it's removed from here.
      updateTaskStatus,
      addTask,
      deleteTask,
      addTodoItem,
      removeTodoItem,
      resolveDrift,
      deleteDrift,
      getMeetingById
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
