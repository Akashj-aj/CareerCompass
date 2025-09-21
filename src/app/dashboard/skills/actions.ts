"use server";

import { analyzeSkillsGap } from "@/ai/flows/analyze-skills-gap";

export async function analyzeSkillsGapAction(prevState: any, formData: FormData) {
  const careerPathFromSelect = formData.get("careerPath") as string;
  const customCareerPath = formData.get("customCareerPath") as string;
  const resumeSkills = JSON.parse(formData.get("resumeSkills") as string || '[]');

  const careerPath = customCareerPath || careerPathFromSelect;

  if (!resumeSkills || resumeSkills.length === 0) {
    return {
      message: "Please upload and analyze a resume on the Resume page first.",
      skillsGap: null,
    };
  }

  if (!careerPath) {
    return {
      message: "Please select or enter a career path.",
      skillsGap: null,
    };
  }

  try {
    const result = await analyzeSkillsGap({
      careerPath,
      resumeSkills,
    });
    return {
      message: "Skills gap analysis complete!",
      skillsGap: result,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `An error occurred during analysis: ${errorMessage}`,
      skillsGap: null,
    };
  }
}
