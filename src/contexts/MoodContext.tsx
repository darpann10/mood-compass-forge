import React, { createContext, useContext, useState, useEffect } from 'react';

export type MoodType = 'happy' | 'sad' | 'stressed' | 'calm' | 'neutral';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  score: number;
  date: string;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
  mood?: MoodType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAnonymous: boolean;
}

interface MoodContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  moods: MoodEntry[];
  journals: JournalEntry[];
  addMoodEntry: (mood: MoodType, score: number, notes?: string) => void;
  addJournalEntry: (content: string, sentiment: 'positive' | 'negative' | 'neutral') => void;
  isAuthenticated: boolean;
  currentStreak: number;
  totalEntries: number;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('moodmitra-user');
    const savedMoods = localStorage.getItem('moodmitra-moods');
    const savedJournals = localStorage.getItem('moodmitra-journals');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedMoods) {
      setMoods(JSON.parse(savedMoods));
    }
    if (savedJournals) {
      setJournals(JSON.parse(savedJournals));
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('moodmitra-user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('moodmitra-moods', JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem('moodmitra-journals', JSON.stringify(journals));
  }, [journals]);

  const addMoodEntry = (mood: MoodType, score: number, notes?: string) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      score,
      date: new Date().toISOString(),
      notes,
    };
    setMoods(prev => [newEntry, ...prev]);
  };

  const addJournalEntry = (content: string, sentiment: 'positive' | 'negative' | 'neutral') => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      sentiment,
      date: new Date().toISOString(),
    };
    setJournals(prev => [newEntry, ...prev]);
  };

  const isAuthenticated = user !== null;

  const calculateStreak = () => {
    if (moods.length === 0) return 0;
    
    const sortedMoods = [...moods].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const mood of sortedMoods) {
      const moodDate = new Date(mood.date);
      const diffTime = Math.abs(currentDate.getTime() - moodDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= streak + 1) {
        streak++;
        currentDate = moodDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();
  const totalEntries = moods.length + journals.length;

  const value = {
    user,
    setUser,
    moods,
    journals,
    addMoodEntry,
    addJournalEntry,
    isAuthenticated,
    currentStreak,
    totalEntries,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};