import type { GenerateCareerRoadmapOutput } from '@/ai/flows/generate-career-roadmap';
import type { AnalyzeSkillsGapOutput } from '@/ai/flows/analyze-skills-gap';
import type { SimulateMockInterviewOutput } from '@/ai/flows/simulate-mock-interview';

export type User = {
  uid: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: Date;
  interests?: string;
  resumeSummary?: string;
};

export type Resume = {
  userId: string;
  fileUrl: string;
  extractedSkills: string[];
  education: string;
  experience: string;
  parsedAt: Date;
};

export type RoadmapSuggestion = GenerateCareerRoadmapOutput['careerPathSuggestions'][0];

export type Roadmap = RoadmapSuggestion & {
  userId: string;
  createdAt: Date;
};

export type SkillsGap = AnalyzeSkillsGapOutput & {
  userId: string;
  targetPath: string;
  createdAt: Date;
};

export type Interview = {
  userId: string;
  careerPath: string;
  interviewType: 'technical' | 'behavioral';
  history: {
    question: string;
    answer: string;
    feedback?: SimulateMockInterviewOutput['feedback'];
  }[];
  attemptedAt: Date;
};

export type Project = {
  userId: string;
  title: string;
  description: string;
  repoUrl: string;
  createdAt: Date;
};
