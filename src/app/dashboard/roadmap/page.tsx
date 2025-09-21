"use client";

import { useState } from "react";
import { generateRoadmapAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { GitMerge, Loader, Wand2, Clock, ListChecks, Info } from "lucide-react";
import type { GenerateCareerRoadmapOutput } from "@/ai/flows/generate-career-roadmap";
import { useResume } from "@/contexts/ResumeContext";

function GenerateButton({ onClick, isLoading, disabled }: { onClick: () => void; isLoading: boolean, disabled: boolean }) {
  return (
    <Button onClick={onClick} disabled={isLoading || disabled}>
      {isLoading ? <Loader className="animate-spin" /> : <Wand2 className="mr-2" />}
      {isLoading ? "Generating..." : "Generate Roadmap"}
    </Button>
  );
}

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<GenerateCareerRoadmapOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { extractedSkills } = useResume();

  const handleGenerateRoadmap = async () => {
    if (!extractedSkills || extractedSkills.length === 0) {
      setError("Please analyze a resume on the Resume page first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await generateRoadmapAction({ extractedSkills, interests: "" });
    if (result.roadmap) {
      setRoadmap(result.roadmap);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-bold font-headline">Career Roadmap Generator</h1>
        <p className="text-muted-foreground">Not sure where to start? We'll suggest some paths for you based on your resume.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Generate Your Roadmap</CardTitle>
          <CardDescription>
            {extractedSkills.length > 0 
              ? `Using ${extractedSkills.length} skills from your resume to generate career paths.`
              : "Click the button below to generate career paths. Please analyze a resume first."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenerateButton 
            onClick={handleGenerateRoadmap} 
            isLoading={isLoading} 
            disabled={extractedSkills.length === 0}
          />
          {error && <p className="text-destructive mt-4">{error}</p>}
        </CardContent>
      </Card>

      {roadmap ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Suggested Career Paths</CardTitle>
            <CardDescription>Based on your resume, here are a few paths that might be a great fit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {roadmap.careerPathSuggestions.map((path, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-headline text-xl hover:no-underline hover:text-primary transition-colors">{path.careerPath}</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h4 className="font-semibold text-lg flex items-center gap-2 mb-2 font-headline"><Info className="text-primary"/> Why it's a good fit</h4>
                      <p className="text-muted-foreground">{path.justification}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg"><Clock className="w-6 h-6 text-primary"/> <div><p className="text-muted-foreground">Time to Readiness</p><strong className="text-lg">{path.estimatedTime}</strong></div></div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg flex items-center gap-2 mb-3 font-headline"><ListChecks className="text-primary"/> Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {path.requiredSkills.map(skill => <Badge variant="secondary" key={skill} className="text-base py-1 px-3">{skill}</Badge>)}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4 font-headline">Weekly Learning Plan</h4>
                      <div className="relative pl-8">
                        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border rounded-full"></div>
                        {path.learningPlan.map((week, weekIndex) => (
                          <div key={weekIndex} className="relative mb-8">
                            <div className="absolute -left-5 top-1.5 h-5 w-5 rounded-full bg-primary ring-8 ring-background"></div>
                            <p className="font-semibold text-lg ml-4">Week {week.week}</p>
                            <p className="text-muted-foreground text-sm ml-4">{week.steps}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : !isLoading && (
         <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg border-border">
            <GitMerge className="mx-auto h-12 w-12" />
            <p className="mt-4 text-lg">Your personalized roadmaps will appear here.</p>
        </div>
      )}
    </div>
  );
}
