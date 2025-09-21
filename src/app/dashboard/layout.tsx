import { Header } from '@/components/layout/header';
import { AppProviders } from '@/contexts/providers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-24 md:gap-8 md:p-8 md:pt-28">
          <div className="container mx-auto max-w-6xl">
           {children}
          </div>
        </main>
      </div>
    </AppProviders>
  );
}
