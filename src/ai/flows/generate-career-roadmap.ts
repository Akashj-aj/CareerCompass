'use server';

/**
 * @fileOverview Career roadmap generation AI agent.
 *
 * - generateCareerRoadmap - A function that generates a personalized career roadmap.
 * - GenerateCareerRoadmapInput - The input type for the generateCareerRoadmap function.
 * - GenerateCareerRoadmapOutput - The return type for the generateCareerRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareerRoadmapInputSchema = z.object({
  extractedSkills: z
    .array(z.string())
    .describe('A list of skills extracted from the student\'s resume.'),
  interests: z.string().describe('The interests of the student.'),
});
export type GenerateCareerRoadmapInput = z.infer<
  typeof GenerateCareerRoadmapInputSchema
>;

const GenerateCareerRoadmapOutputSchema = z.object({
  careerPathSuggestions: z.array(
    z.object({
      careerPath: z.string().describe('The suggested career path.'),
      justification: z.string().describe("The justification for why this career path is a good fit based on the user's skills."),
      requiredSkills: z.array(z.string()).describe('The list of required skills.'),
      learningPlan: z
        .array(
          z.object({
            week: z.number().describe('The week number.'),
            steps: z.string().describe('The learning steps for the week.'),
          })
        )
        .describe('The learning plan with week-by-week steps.'),
      estimatedTime: z.string().describe('The estimated time to readiness.'),
    })
  ).describe('A list of career path suggestions.'),
});
export type GenerateCareerRoadmapOutput = z.infer<
  typeof GenerateCareerRoadmapOutputSchema
>;

export async function generateCareerRoadmap(
  input: GenerateCareerRoadmapInput
): Promise<GenerateCareerRoadmapOutput> {
  return generateCareerRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCareerRoadmapPrompt',
  input: {schema: GenerateCareerRoadmapInputSchema},
  output: {schema: GenerateCareerRoadmapOutputSchema},
  prompt: `You are a career advisor specializing in creating personalized career roadmaps for students.

  Based on the student's skills and interests, suggest 2-3 career paths. For each path, provide:
  1. A justification explaining why it's a good fit, directly referencing their existing skills.
  2. A list of additional required skills for the role.
  3. A week-by-week learning plan to acquire those skills.
  4. An estimated time to readiness.

  Student's Skills:
  {{#each extractedSkills}}
  - {{this}}
  {{/each}}
  
  Student's Interests: {{{interests}}}
  
  Format the learning plan in the following way:
  learningPlan: [
  {
  week: 1,
  steps: "Step 1: Do this"
  },
  {
  week: 2,
  steps: "Step 1: Do this"
  }
  ]
  `,
});

const generateCareerRoadmapFlow = ai.defineFlow(
  {
    name: 'generateCareerRoadmapFlow',
    inputSchema: GenerateCareerRoadmapInputSchema,
    outputSchema: GenerateCareerRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
