import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Lightbulb } from "lucide-react";

const projectIdeas = [
  {
    title: "E-commerce Recommendation Engine",
    description: "Build a system that suggests products to users on an e-commerce site. You can use techniques like collaborative or content-based filtering.",
    tags: ["Machine Learning", "Python", "Data Science", "API"],
    difficulty: "Advanced",
  },
  {
    title: "Interactive Data Dashboard",
    description: "Create a tool that lets users upload a CSV file and generate different interactive charts and graphs to explore their data.",
    tags: ["Data Viz", "D3.js", "React", "Data Analysis"],
    difficulty: "Intermediate",
  },
  {
    title: "Customer Churn Prediction Model",
    description: "Develop a model that predicts when customers might leave a subscription service, helping the business find ways to keep them.",
    tags: ["Classification", "Scikit-learn", "Pandas", "Data Science"],
    difficulty: "Intermediate",
  },
  {
    title: "Automated Code Reviewer Bot",
    description: "Build a chatbot that can automatically review code pull requests, check for style issues, and suggest improvements.",
    tags: ["LLM", "Fine-tuning", "Node.js", "GitHub API"],
    difficulty: "Advanced",
  },
];

const difficultyColors: { [key: string]: string } = {
    Beginner: "bg-green-500/20 text-green-700 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-700 border-red-500/30",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-bold font-headline">Project Ideas</h1>
        <p className="text-muted-foreground">Looking for some inspiration? Here are a few ideas to help you build out your portfolio.</p>
      </header>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectIdeas.map((project, index) => (
          <Card key={index} className="flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-foreground">{project.title}</CardTitle>
                    <Badge className={difficultyColors[project.difficulty]}>{project.difficulty}</Badge>
                </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                    <p className="text-sm font-semibold mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>

                <Button className="w-full mt-6" disabled>
                    <Github className="mr-2 h-4 w-4" />
                    Create Repo (Coming Soon)
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
