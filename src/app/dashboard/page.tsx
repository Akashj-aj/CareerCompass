import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  FileText,
  GitMerge,
  Lightbulb,
  CheckCircle,
  Target,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const quickActions = [
  {
    title: 'Analyze Your Resume',
    description: "Upload your resume and we'll help find your top skills.",
    href: '/dashboard/resume',
  },
  {
    title: 'Explore Career Roadmaps',
    description: 'Get personalized career suggestions based on your profile.',
    href: '/dashboard/roadmap',
  },
  {
    title: 'Practice a Mock Interview',
    description: 'Hone your interview skills with an AI-powered guide.',
    href: '/dashboard/interview',
  },
  {
    title: 'Get Project Ideas',
    description: 'Find coding projects to build out your portfolio.',
    href: '/dashboard/projects',
  },
];

const recentActivity = [
    {
        activity: "You finished a mock interview for a Data Scientist role.",
        time: "2 hours ago"
    },
    {
        activity: "Your resume analysis is done. We found 12 skills.",
        time: "1 day ago"
    },
    {
        activity: "We've added new project ideas for 'Data Science'.",
        time: "3 days ago"
    }
]

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 animate-fade-in">
       <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight font-headline text-foreground">Welcome back, Alex!</h1>
        <p className="text-lg text-muted-foreground">Here’s a look at your progress. Let’s keep up the great work!</p>
       </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Career Goal</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Data Scientist</div>
            <p className="text-xs text-muted-foreground">You've got 60% of the skills needed!</p>
            <Progress value={60} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Skills Identified</CardTitle>
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">From your latest resume scan</p>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Mock Interviews</CardTitle>
            <Bot className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Completed in the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Quick Actions</CardTitle>
                <CardDescription>Ready to take the next step in your career journey?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {quickActions.map(action => (
                    <Link
                      href={action.href}
                      key={action.title}
                      className="group rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:bg-muted/50 hover:scale-105"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold mb-2 font-headline">{action.title}</h3>
                            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                    {recentActivity.map((item, index) => (
                        <div className="flex items-start" key={index}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mr-4 mt-1 shrink-0">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.activity}</p>
                                <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
