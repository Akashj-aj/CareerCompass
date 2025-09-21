"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { analyzeSkillsGapAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader, Search } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";

const careerPaths = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
];

const initialState = {
  message: "",
  skillsGap: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader className="animate-spin" /> : <Search className="mr-2" />}
      {pending ? "Analyzing..." : "Analyze Skills Gap"}
    </Button>
  );
}

export default function SkillsGapPage() {
  const [state, formAction] = useActionState(analyzeSkillsGapAction, initialState);
  const { extractedSkills } = useResume();

  const missingSkills = state.skillsGap?.missingSkills || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-bold font-headline">Skills Gap Analysis</h1>
        <p className="text-muted-foreground">See how your current skills match up with your career goals.</p>
      </header>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-foreground">Select or Enter a Career Path</CardTitle>
          <CardDescription>
            {extractedSkills.length > 0
              ? `Analyzing based on ${extractedSkills.length} skills from your resume.`
              : "Choose a career to see which skills you might want to develop next. Please analyze a resume first."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="resumeSkills" value={JSON.stringify(extractedSkills)} />
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:flex-1">
                <Select name="careerPath" disabled={extractedSkills.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a career path..." />
                  </SelectTrigger>
                  <SelectContent>
                    {careerPaths.map(path => (
                      <SelectItem key={path} value={path}>{path}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-muted-foreground text-sm font-semibold">OR</p>

              <div className="w-full sm:flex-1">
                <Input
                  name="customCareerPath"
                  placeholder="Enter a custom role..."
                  disabled={extractedSkills.length === 0}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
          {state?.message && !state.skillsGap && <p className="text-destructive mt-4 text-sm">{state.message}</p>}
        </CardContent>
      </Card>

      {state.skillsGap && missingSkills.length > 0 ? (
        <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Identified Skill Gaps</CardTitle>
              <CardDescription>Here are some skills you might consider learning for your chosen career path.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {missingSkills.map((skill: string) => <Badge variant="secondary" key={skill} className="text-base py-1 px-3">{skill}</Badge>)}
            </CardContent>
          </Card>
      ) : state.skillsGap && missingSkills.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg bg-card">
              <BookOpen className="mx-auto h-12 w-12" />
              <p className="mt-4 text-lg">No skill gaps found! Your skills are a great match for this role.</p>
          </div>
      ) : (
        <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg bg-card">
            <BookOpen className="mx-auto h-12 w-12" />
            <p className="mt-4 text-lg">Your skills gap analysis will appear here.</p>
        </div>
      )}

    </div>
  );
}
