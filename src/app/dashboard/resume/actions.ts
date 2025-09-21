"use server";

import { genkit } from "genkit";
import { googleAI } from '@genkit-ai/googleai';
import { z } from "zod";

// Define the schema for the expected AI output.
const ExtractSkillsSchema = z.object({
  isResume: z.boolean().describe('Whether the document is a resume or not.'),
  extractedSkills: z
    .array(z.string())
    .describe(
      'An array of skills extracted from the resume. This will be empty if isResume is false.'
    ),
});

export async function extractSkillsAction(prevState: any, formData: FormData) {
  const resumeFile = formData.get("resume") as File;
  
  if (!resumeFile || resumeFile.size === 0) {
    return { message: "Please select a resume file.", skills: [] };
  }

  if (resumeFile.type !== "application/pdf") {
    return { message: "Only PDF files are accepted. Please upload a valid PDF.", skills: [] };
  }

  try {
    const resumeFileBuffer = Buffer.from(await resumeFile.arrayBuffer());

    // Create a self-contained Genkit instance for this action
    const ai = genkit({
      plugins: [googleAI()],
    });

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: [
        {
          text: `You are an expert resume analyst AI. Your task is to analyze the provided resume.

1.  **Analyze the document**: Determine if the document is a professional resume or CV.
2.  **Extract Skills**:
    *   If it is a resume, extract a list of specific, marketable skills.
    *   Skills can be technical (e.g., "JavaScript", "Python", "React", "SQL", "Docker") or soft skills (e.g., "Team Leadership", "Agile Methodologies", "Public Speaking").
    *   **Crucially, only extract the names of the skills themselves.** Do not include sentences, descriptions, or years of experience. For example, if you see "5 years of experience with Python", you should only extract "Python".
    *   If the document is not a resume, return an empty array for the skills.
3.  **Format the Output**: Return a JSON object with two keys:
    *   \`isResume\`: A boolean that is true if the document is a resume, and false otherwise.
    *   \`extractedSkills\`: An array of strings, where each string is a single extracted skill. This will be empty if isResume is false.`,
        },
        {
          media: {
            url: `data:${resumeFile.type};base64,${resumeFileBuffer.toString('base64')}`,
            contentType: resumeFile.type,
          },
        },
      ],
      output: {
        schema: ExtractSkillsSchema,
      },
    });

    if (!output) {
      console.log("AI returned a null or undefined output, but did not throw an error.");
      return { message: "The AI failed to process the document. Please try again.", skills: [] };
    }

    if (!output.isResume) {
        return { message: "The uploaded PDF does not appear to be a resume. Please upload a valid resume.", skills: [] };
    }
    
    return { skills: output.extractedSkills, message: "Skills extracted successfully!" };

  } catch (error) {
    console.error("Detailed error in extractSkillsAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { message: `An error occurred while processing your resume: ${errorMessage}`, skills: [] };
  }
}
