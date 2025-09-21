"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Upload, Loader, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { extractSkillsAction } from "./actions";
import { useResume } from "@/contexts/ResumeContext";
import { useEffect } from "react";

const initialState = {
  message: "",
  skills: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader className="animate-spin" /> : <Upload className="mr-2" />}
      {pending ? "Analyzing..." : "Analyze Resume"}
    </Button>
  );
}

export default function ResumePage() {
  const [state, formAction] = useActionState(extractSkillsAction, initialState);
  const { extractedSkills, setExtractedSkills } = useResume();

  useEffect(() => {
    if (state?.skills && state.skills.length > 0) {
      setExtractedSkills(state.skills);
    }
  }, [state, setExtractedSkills]);

  const skillsToDisplay = state.skills && state.skills.length > 0 ? state.skills : extractedSkills;

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-bold font-headline">Resume Analysis</h1>
        <p className="text-muted-foreground">Let's find the skills in your resume to get started.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Upload Your Resume</CardTitle>
            <CardDescription>Upload your resume (PDF only) to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume File</Label>
                <Input id="resume" name="resume" type="file" accept=".pdf" required className="file:text-primary file:font-semibold"/>
              </div>
              <SubmitButton />
              {state?.message && !state.skills?.length && (
                <p className="text-sm text-destructive flex items-center gap-2 pt-2"><AlertCircle className="w-4 h-4" />{state.message}</p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Extracted Skills</CardTitle>
            <CardDescription>
              {skillsToDisplay && skillsToDisplay.length > 0 
                ? "Here are the skills we found. These will be used to generate your career roadmap." 
                : "Your skills will appear here once you upload a resume."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {skillsToDisplay && skillsToDisplay.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillsToDisplay.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-base py-1 px-3">{skill}</Badge>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg border-border">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-2">Waiting for you to upload a resume</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
