"use client";

import { useState } from "react";
import { simulateInterviewAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader, Send, User, BrainCircuit, MessageSquare, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SimulateMockInterviewOutput } from "@/ai/flows/simulate-mock-interview";
import { Input } from "@/components/ui/input";

type Message = {
  sender: "user" | "bot";
  text: string;
  feedback?: SimulateMockInterviewOutput["feedback"];
};

const careerPaths = [
  "Frontend Developer", "Backend Developer", "Product Manager", "Data Scientist",
];

export default function InterviewPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>('');
  const [customCareerPath, setCustomCareerPath] = useState<string>('');
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | null>(null);

  const finalCareerPath = customCareerPath || selectedCareerPath;

  const handleStartInterview = async () => {
    if (!finalCareerPath || !interviewType) return;
    
    setIsLoading(true);
    setError(null);
    setMessages([]);
    
    const res = await simulateInterviewAction({
      interviewType: interviewType,
      careerPath: finalCareerPath,
    });

    if (res.success && res.data) {
      setMessages([{ sender: "bot", text: res.data.question }]);
      setInterviewStarted(true);
    } else {
        setError(res.message || "An unknown error occurred.");
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || !finalCareerPath || !interviewType) return;

    const userMessage: Message = { sender: "user", text: currentAnswer };
    const previousQuestionsAndAnswers = messages.reduce((acc, msg, i) => {
        if(msg.sender === 'bot') {
            const userAnswer = messages[i+1];
            if(userAnswer && userAnswer.sender === 'user') {
                acc.push({question: msg.text, answer: userAnswer.text});
            }
        }
        return acc;
    }, [] as {question: string, answer: string}[]);

    setMessages(prev => [...prev, userMessage]);
    setCurrentAnswer("");
    setIsLoading(true);
    setError(null);

    const res = await simulateInterviewAction({
      interviewType: interviewType,
      careerPath: finalCareerPath,
      previousQuestionsAndAnswers: previousQuestionsAndAnswers,
      currentAnswer: currentAnswer,
    });
    
    if (res.success && res.data) {
      const botMessage: Message = { sender: "bot", text: res.data.question, feedback: res.data.feedback };
      setMessages(prev => [...prev, botMessage]);
    } else {
        setError(res.message || "An unknown error occurred.");
        // Optional: remove the user's message if the API call fails
        setMessages(prev => prev.slice(0, -1));
    }
    setIsLoading(false);
  };
  
  if (!interviewStarted) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-8rem)] animate-fade-in">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Interview Setup</CardTitle>
            <CardDescription>Let's get your practice session ready.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Career Path</Label>
               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:flex-1">
                    <Select onValueChange={setSelectedCareerPath} value={selectedCareerPath}>
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
                      value={customCareerPath}
                      onChange={(e) => setCustomCareerPath(e.target.value)}
                    />
                  </div>
                </div>
            </div>
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <RadioGroup onValueChange={(v) => setInterviewType(v as any)} className="grid grid-cols-2 gap-4">
                <Label htmlFor="technical" className="flex flex-col items-center justify-center gap-2 border p-4 rounded-md cursor-pointer hover:bg-accent/10 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary transition-all">
                  <RadioGroupItem value="technical" id="technical" className="sr-only"/>
                  <BrainCircuit className="w-8 h-8 text-primary" /> Technical
                </Label>
                <Label htmlFor="behavioral" className="flex flex-col items-center justify-center gap-2 border p-4 rounded-md cursor-pointer hover:bg-accent/10 has-[input:checked]:bg-accent/20 has-[input:checked]:border-accent transition-all">
                  <RadioGroupItem value="behavioral" id="behavioral" className="sr-only"/>
                  <MessageSquare className="w-8 h-8 text-accent"/> Behavioral
                </Label>
              </RadioGroup>
            </div>
            <Button onClick={handleStartInterview} className="w-full" size="lg" disabled={isLoading || !finalCareerPath || !interviewType}>Start Interview</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold font-headline">Mock Interview</h1>
        <p className="text-muted-foreground">You're practicing for a <span className="font-semibold text-primary">{interviewType}</span> interview for a <span className="font-semibold text-accent">{finalCareerPath}</span> role.</p>
      </header>

      <Card className="flex-1 flex flex-col shadow-lg">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && <Avatar className="bg-primary text-primary-foreground"><AvatarFallback className="bg-transparent"><Bot/></AvatarFallback></Avatar>}
              <div className={`max-w-xl rounded-lg px-4 py-3 ${msg.sender === 'user' ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <p className="text-base">{msg.text}</p>
                {msg.feedback && (
                  <Card className={`mt-3 bg-background/50 border-border ${!msg.feedback.isSufficient ? 'border-destructive' : ''}`}>
                    <CardHeader className="p-3">
                      <CardTitle className={`text-sm font-headline flex items-center gap-2 ${!msg.feedback.isSufficient ? 'text-destructive' : ''}`}>
                        {!msg.feedback.isSufficient && <AlertCircle className="w-4 h-4"/>}
                        Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-3 text-xs">
                        <p className="text-card-foreground/80">{msg.feedback.summary}</p>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label>Clarity: {msg.feedback.clarity}/10</Label>
                                <Progress value={msg.feedback.clarity * 10} className="h-2"/>
                            </div>
                             <div className="space-y-1">
                                <Label>Technical Depth: {msg.feedback.technicalDepth}/10</Label>
                                <Progress value={msg.feedback.technicalDepth * 10} className="h-2"/>
                             </div>
                             <div className="space-y-1">
                                <Label>Communication: {msg.feedback.communication}/10</Label>
                                <Progress value={msg.feedback.communication * 10} className="h-2"/>
                            </div>
                        </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              {msg.sender === 'user' && <Avatar className="border-2 border-border"><AvatarFallback><User /></AvatarFallback></Avatar>}
            </div>
          ))}
          {isLoading && <div className="flex justify-center p-4"><Loader className="animate-spin text-primary" /></div>}
        </CardContent>
        <div className="p-4 border-t">
          {error && <p className="text-sm text-destructive flex items-center gap-2 pb-2"><AlertCircle className="w-4 h-4" />{error}</p>}
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !currentAnswer.trim()}>
              <Send />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
