'use server';

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export interface PRAnalysisInput {
  title: string;
  description: string;
  changedFiles: string;
  diffText: string;
  rules: string; // From DB AdrRules or Config
}

export interface RiskReport {
  riskLevel: 'High' | 'Medium' | 'Low';
  summary: string;
  riskyAreas: string[];
  possibleAdrConflicts: string[];
  missingTests: string[];
  newDependencies: string[];
  recommendedReviewers: string[];
  humanReviewRequired: boolean;
  markdownReport: string;
}

export async function analyzePR(input: PRAnalysisInput): Promise<RiskReport> {
  const systemPrompt = `
You are Falbor Guard, an expert Software Architect and Security Reviewer AI.
You are reviewing a GitHub Pull Request against a set of Architecture Decision Records (ADRs) and Rules provided by the repository owner.

Your goal is to detect any violations of these rules, flag risky areas (like auth, billing, DB migrations), and determine if human review is strictly required.

**Provided ADRs & Rules:**
${input.rules || 'No custom rules provided.'}

**Pull Request Information:**
Title: ${input.title}
Description: ${input.description}
Files Changed:
${input.changedFiles}

You must respond with a highly structured JSON object. 
Make sure your "markdownReport" property is a beautifully formatted Markdown string summarizing your findings. It should be written in a professional, authoritative tone, ready to be posted as a GitHub comment.
  `;

  const diffPrompt = `
Here is the PR Diff:
\`\`\`diff
${input.diffText.substring(0, 50000)} // Truncate to prevent token limits
\`\`\`
  `;

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: diffPrompt,
      schema: z.object({
        riskLevel: z.enum(['High', 'Medium', 'Low']).describe('Overall risk level of the PR based on the changes and rules.'),
        summary: z.string().describe('A 1-2 sentence summary of the architectural impact.'),
        riskyAreas: z.array(z.string()).describe('List of specific risky areas touched (e.g. "billing logic", "auth middleware", "package.json").'),
        possibleAdrConflicts: z.array(z.string()).describe('List of potential violations of the provided ADRs.'),
        missingTests: z.array(z.string()).describe('List of testing concerns, such as deleted tests or logic added without tests.'),
        newDependencies: z.array(z.string()).describe('List of new npm packages or dependencies introduced.'),
        recommendedReviewers: z.array(z.string()).describe('List of teams or roles that should review this (e.g. "Security Team", "Database Admins").'),
        humanReviewRequired: z.boolean().describe('True if the PR touches critical paths or violates ADRs and requires manual approval.'),
        markdownReport: z.string().describe('A complete, formatted Markdown report representing these findings. Include emojis for visual hierarchy.')
      }),
    });

    return object;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to run AI architecture analysis. Ensure OPENAI_API_KEY is configured.");
  }
}
