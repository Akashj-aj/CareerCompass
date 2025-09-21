'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FileText,
  GitMerge,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Bot,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { CareerCompassIcon } from '../icons';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/resume', icon: FileText, label: 'Resume' },
  { href: '/dashboard/roadmap', icon: GitMerge, label: 'Roadmap' },
  { href: '/dashboard/skills', icon: BookOpen, label: 'Skills Gap' },
  { href: '/dashboard/interview', icon: Bot, label: 'Interview' },
  { href: '/dashboard/projects', icon: Lightbulb, label: 'Projects' },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden ml-auto"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-background/95 backdrop-blur-lg">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold mb-4"
          >
            <CareerCompassIcon className="h-6 w-6 text-primary" />
            <span className="font-headline">CareerCompass</span>
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
