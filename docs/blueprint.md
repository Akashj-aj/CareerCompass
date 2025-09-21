# **App Name**: SkillMapper

## Core Features:

- Resume Parsing: Upload a resume (PDF) and use Vertex AI to parse the text and extract skills.
- Career Roadmap Generation: Use Gemini to suggest career paths based on parsed skills and user input, providing required skills and a learning plan. It will also use a tool to determine time-to-readiness and average salaries for the different career paths.
- Skills Gap Analysis: Compare the skills extracted from the resume to the skills required for a chosen career path and show missing skills ranked by priority.
- Mock Interview Simulator: Provide a chat-like UI powered by Gemini to conduct mock interviews, providing behavioral and technical questions. After the mock interview it provides scores on clarity, technical depth, and communication.
- Student Dashboard: Display a summary of the student's resume, career roadmap(s), skills gap report, mock interview history, and linked GitHub projects.

## Style Guidelines:

- Primary color: Light periwinkle (#C3B1E1) to convey intellect and modernity, referencing the learning goals of the app.
- Background color: Pale lavender (#F5F3F9), a desaturated version of the primary color, creating a soft and unobtrusive background.
- Accent color: Dusty rose (#D199AD), analogous to the primary hue but with different saturation and brightness levels to add emphasis.
- Headline font: 'Space Grotesk', a sans-serif for a computerized, techy feel. Body text: 'Inter', a grotesque-style sans-serif with a modern, neutral look.
- Use simple, line-based icons to represent different skills, career paths, and dashboard sections, maintaining a consistent and clean aesthetic.
- Employ a card-based layout for displaying information on the dashboard, with clear sections for each feature (resume, roadmap, skills gap, etc.).