# CareerCompass

CareerCompass is a personalized AI career and skills advisor for students, built with Next.js and Firebase.

## Core Features

- **Resume Parsing**: Upload a resume (PDF) and use Vertex AI to parse the text and extract skills.
- **Career Roadmap Generation**: Get AI-powered career path suggestions based on your skills and interests, complete with a learning plan.
- **Skills Gap Analysis**: Compare your skills against a desired career path to identify what you need to learn.
- **Mock Interview Simulator**: Practice for behavioral and technical interviews with an AI simulator and get instant feedback.
- **Student Dashboard**: A central hub to view your resume summary, career roadmaps, skills gap report, and more.

## Getting Started

To get started, run the development server:

```bash
npm run dev
```

Then, open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The main application pages are located in `src/app/dashboard/`. The entry point is `src/app/page.tsx`, which serves as the login page.
