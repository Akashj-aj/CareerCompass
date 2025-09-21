'use server';

/**
 * @fileOverview A skills gap analysis AI agent.
 *
 * - analyzeSkillsGap - A function that handles the skills gap analysis process.
 * - AnalyzeSkillsGapInput - The input type for the analyzeSkillsGap function.
 * - AnalyzeSkillsGapOutput - The return type for the analyzeSkillsGap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkillsGapInputSchema = z.object({
  resumeSkills: z
    .array(z.string())
    .describe('The skills extracted from the user\u2019s resume.'),
  careerPath: z.string().describe('The career path chosen by the user.'),
});
export type AnalyzeSkillsGapInput = z.infer<typeof AnalyzeSkillsGapInputSchema>;

const AnalyzeSkillsGapOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe('A list of skills required for the career path that are missing from the resume.'),
});
export type AnalyzeSkillsGapOutput = z.infer<typeof AnalyzeSkillsGapOutputSchema>;

export async function analyzeSkillsGap(
  input: AnalyzeSkillsGapInput
): Promise<AnalyzeSkillsGapOutput> {
  return analyzeSkillsGapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkillsGapPrompt',
  input: {schema: AnalyzeSkillsGapInputSchema},
  output: {schema: AnalyzeSkillsGapOutputSchema},
  prompt: `You are a career advisor. Compare the skills from the user's resume to the skills required for their desired career path and identify the skills that are missing.

Resume Skills:
{{#each resumeSkills}}- {{this}}\n{{/each}}

Career Path: {{{careerPath}}}

Return a JSON object containing a "missingSkills" property, which is an array of strings.
Example output format: {"missingSkills": ["Skill 1", "Skill 2", "Skill 3"]}`,
});

const analyzeSkillsGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillsGapFlow',
    inputSchema: AnalyzeSkillsGapInputSchema,
    outputSchema: AnalyzeSkillsGapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
