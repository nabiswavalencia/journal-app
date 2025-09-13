export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedDates: string[];
  streak: number;
  bestStreak: number;
  category: 'health' | 'productivity' | 'wellness' | 'fitness' | 'other';
}

export interface CycleEntry {
  id: string;
  date: string;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  symptoms: string[];
  mood: number; // 1-5 scale
  flow?: 'light' | 'medium' | 'heavy';
  notes: string;
}

export interface BudgetEntry {
  id: string;
  date: string;
  amount: number;
  currency: 'KSH' | 'USD';
  category: string;
  type: 'income' | 'expense';
  description: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  emotions: string[];
  notes: string;
  gratitude?: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'career' | 'health' | 'relationships' | 'finance';
  deadline?: string;
  completed: boolean;
  progress: number; // 0-100
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    date?: string;
  }[];
}

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content: string;
  mood: number;
  tags: string[];
  weather?: string;
  highlights: string[];
}