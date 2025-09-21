'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FileText,
  GitMerge,
  LayoutDashboard,
  Lightbulb,
  Bot,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MobileNav } from './mobile-nav';
import { CareerCompassIcon } from '../icons';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/resume', icon: FileText, label: 'Resume' },
  { href: '/dashboard/roadmap', icon: GitMerge, label: 'Roadmap' },
  { href: '/dashboard/skills', icon: BookOpen, label: 'Skills Gap' },
  { href: '/dashboard/interview', icon: Bot, label: 'Interview' },
  { href: '/dashboard/projects', icon: Lightbulb, label: 'Projects' },
];

export function Header() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-4">
      <div className="w-full mx-auto p-2 rounded-full border bg-background/60 backdrop-blur-xl shadow-lg border-border/20">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold px-3"
          >
            <CareerCompassIcon className="h-6 w-6 text-primary" />
            <span className="font-headline text-foreground hidden sm:inline-block">
              CareerCompass
            </span>
          </Link>

          {isMounted && <MobileNav />}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center text-sm font-medium">
            {isMounted && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-primary px-4 py-2 rounded-full',
                  pathname === item.href
                    ? 'text-primary-foreground bg-gradient-to-r from-primary/90 to-accent/90 shadow-inner'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center pr-2">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar className="h-9 w-9 border-2 border-border group-hover:border-primary transition-colors">
                    <AvatarImage
                      src="https://picsum.photos/seed/avatar3/100/100"
                      alt="Student"
                    />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
