'use server';

/**
 * @fileOverview This file defines a Genkit flow for simulating mock interviews.
 *
 * - simulateMockInterview - A function that simulates a mock interview and provides feedback.
 * - SimulateMockInterviewInput - The input type for the simulateMockInterview function.
 * - SimulateMockInterviewOutput - The return type for the simulateMockInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateMockInterviewInputSchema = z.object({
  careerPath: z.string().describe('The target career path for the interview.'),
  resumeSummary: z.string().describe("A summary of the student's resume."),
  interviewType: z
    .enum(['technical', 'behavioral'])
    .describe('The type of mock interview.'),
  previousQuestionsAndAnswers: z
    .array(z.object({question: z.string(), answer: z.string()}))
    .optional()
    .describe('Previous questions and answers in the interview.'),
  currentAnswer: z.string().optional().describe('The student submitted answer to the prior question, if any.'),
});
export type SimulateMockInterviewInput = z.infer<
  typeof SimulateMockInterviewInputSchema
>;

const FeedbackSchema = z.object({
    isSufficient: z.boolean().describe("Whether the user's answer was a sufficient and serious attempt."),
    clarity: z.number().min(1).max(10).describe('A score for clarity (1-10).'),
    technicalDepth: z.number().min(1).max(10).describe('A score for technical depth (1-10).'),
    communication: z.number().min(1).max(10).describe('A score for communication skills (1-10).'),
    summary: z.string().describe('Overall feedback on the answer. If the answer was insufficient, explain why.'),
});

const SimulateMockInterviewOutputSchema = z.object({
  question: z.string().describe('The interview question to ask the user. If the previous answer was insufficient, this should be the SAME question as before.'),
  feedback: FeedbackSchema.optional()
    .describe('Feedback on the previous answer.'),
});
export type SimulateMockInterviewOutput = z.infer<
  typeof SimulateMockInterviewOutputSchema
>;

export async function simulateMockInterview(
  input: SimulateMockInterviewInput
): Promise<SimulateMockInterviewOutput> {
  return simulateMockInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateMockInterviewPrompt',
  input: {schema: SimulateMockInterviewInputSchema},
  output: {schema: SimulateMockInterviewOutputSchema},
  prompt: `You are an expert mock interview simulator, acting as a senior hiring manager for the career path: {{{careerPath}}}.

You are conducting a {{{interviewType}}} interview with a student. Their resume summary is: {{{resumeSummary}}}.

Your primary goal is to provide a realistic and challenging interview experience.

{{#if currentAnswer}}
  The student just answered: "{{currentAnswer}}".

  First, evaluate their answer. Is it a serious attempt, or is it silly, irrelevant, or extremely short (e.g., "idk", "pass")?

  - **If the answer is NOT a serious attempt:**
    1. Set \`isSufficient\` in your feedback to \`false\`.
    2. Provide a \`summary\` in your feedback explaining why the answer is not good enough (e.g., "This answer is too short, please provide a more detailed response.").
    3. Set scores for clarity, technicalDepth, and communication to 1.
    4. **Crucially, for the \`question\` field in your output, ask the EXACT SAME question again** to give the student another chance.

  - **If the answer IS a serious attempt:**
    1. Set \`isSufficient\` in your feedback to \`true\`.
    2. Provide constructive feedback on their answer by scoring them on clarity, technical depth, and communication from 1 to 10.
    3. Provide a helpful \`summary\` of your feedback.
    4. Ask the **next** relevant interview question based on their career path, resume, and previous answers.

{{else}}
  This is the beginning of the interview.
  - Ask the first relevant interview question for a {{{interviewType}}} interview for a {{{careerPath}}} role.
  - Do not provide any feedback yet.
{{/if}}

  {{#if previousQuestionsAndAnswers}}
  For context, here are the previous questions and answers in this interview:
  {{#each previousQuestionsAndAnswers}}
  Interviewer: {{this.question}}
  Student: {{this.answer}}
  {{/each}}
  {{/if}}
  `,
});

const simulateMockInterviewFlow = ai.defineFlow(
  {
    name: 'simulateMockInterviewFlow',
    inputSchema: SimulateMockInterviewInputSchema,
    outputSchema: SimulateMockInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Received no output from the AI");
    }
    return output;
  }
);
