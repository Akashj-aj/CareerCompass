"use server";

import { simulateMockInterview, type SimulateMockInterviewInput } from "@/ai/flows/simulate-mock-interview";

export async function simulateInterviewAction(input: SimulateMockInterviewInput) {
  // In a real app, resumeSummary would be fetched for the user
  const resumeSummary = input.resumeSummary || "Experienced in React, TypeScript, and Node.js. Passionate about building scalable web applications.";

  try {
    const result = await simulateMockInterview({ ...input, resumeSummary });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `An error occurred during the interview simulation: ${errorMessage}` };
  }
}
