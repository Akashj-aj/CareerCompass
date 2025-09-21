"use server";

import { generateCareerRoadmap, GenerateCareerRoadmapInput } from "@/ai/flows/generate-career-roadmap";

export async function generateRoadmapAction(input: GenerateCareerRoadmapInput) {
  const { extractedSkills } = input;
  
  if (!extractedSkills || extractedSkills.length === 0) {
    return {
      message: "Please upload and analyze a resume first to generate a roadmap.",
      roadmap: null,
    };
  }
  
  try {
    const result = await generateCareerRoadmap({ extractedSkills, interests: input.interests || "" });
    return {
      message: "Roadmap generated successfully!",
      roadmap: result,
    };
  } catch (error) {
    console.error("Detailed error in generateRoadmapAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `An error occurred while generating your roadmap: ${errorMessage}`,
      roadmap: null,
    };
  }
}
