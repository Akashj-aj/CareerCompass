'use client';

import { ResumeProvider } from './ResumeContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ResumeProvider>{children}</ResumeProvider>;
}
