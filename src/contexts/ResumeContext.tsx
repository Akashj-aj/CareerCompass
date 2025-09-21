"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ResumeContextType {
  extractedSkills: string[];
  setExtractedSkills: (skills: string[]) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [extractedSkills, setExtractedSkillsState] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const skillsFromStorage = localStorage.getItem('extractedSkills');
      if (skillsFromStorage) {
        setExtractedSkillsState(JSON.parse(skillsFromStorage));
      }
    } catch (error) {
      console.error("Failed to parse skills from localStorage", error);
      localStorage.removeItem('extractedSkills');
    }
    setIsLoaded(true);
  }, []);

  const setExtractedSkills = (skills: string[]) => {
    setExtractedSkillsState(skills);
    try {
      localStorage.setItem('extractedSkills', JSON.stringify(skills));
    } catch (error) {
      console.error("Failed to save skills to localStorage", error);
    }
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <ResumeContext.Provider value={{ extractedSkills, setExtractedSkills }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
