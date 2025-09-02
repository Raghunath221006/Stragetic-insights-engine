'use server';

/**
 * @fileOverview A flow for generating a product launch plan based on a market research report.
 *
 * - generateLaunchPlan - A function that generates a product launch plan.
 * - GenerateLaunchPlanInput - The input type for the generateLaunchPlan function.
 * - GenerateLaunchPlanOutput - The return type for the generateLaunchPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLaunchPlanInputSchema = z.object({
  marketResearchReport: z
    .string()
    .describe('The market research report to base the launch plan on.'),
  topic: z.string().describe('The product/market topic.'),
});
export type GenerateLaunchPlanInput = z.infer<typeof GenerateLaunchPlanInputSchema>;

const LaunchPhaseSchema = z.object({
  phaseName: z.string().describe("Name of the launch phase (e.g., 'Pre-Launch', 'Launch', 'Post-Launch')."),
  recommendations: z.array(z.string()).describe("A list of actionable recommendations for this phase."),
})

const GenerateLaunchPlanOutputSchema = z.object({
  keyInsights: z.array(z.string()).describe("A list of 4 key, actionable insights for a business looking to enter or grow in this market."),
  launchStrategy: z.array(LaunchPhaseSchema).describe("A phased product launch strategy."),
});
export type GenerateLaunchPlanOutput = z.infer<typeof GenerateLaunchPlanOutputSchema>;

export async function generateLaunchPlan(
  input: GenerateLaunchPlanInput
): Promise<GenerateLaunchPlanOutput> {
  return generateLaunchPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLaunchPlanPrompt',
  input: {schema: GenerateLaunchPlanInputSchema},
  output: {schema: GenerateLaunchPlanOutputSchema},
  prompt: `You are a master strategist, an expert in product launches in the Indian market.
  
  Your task is to create a detailed, actionable product launch plan for a new product in the "{{topic}}" market, based on the provided market research report.

  First, extract 4 key, actionable insights from the report that will inform the launch strategy.

  Then, develop a comprehensive launch strategy divided into three phases:
  1.  **Pre-Launch:** Activities to build anticipation and prepare for market entry.
  2.  **Launch:** The main event and initial market push.
  3.  **Post-Launch:** Actions to sustain momentum, gather feedback, and grow market share.

  For each phase, provide at least 3-4 specific, creative, and actionable recommendations tailored to the Indian context revealed in the report.

  Market Research Report:
  {{{marketResearchReport}}}
  `,
});

const generateLaunchPlanFlow = ai.defineFlow(
  {
    name: 'generateLaunchPlanFlow',
    inputSchema: GenerateLaunchPlanInputSchema,
    outputSchema: GenerateLaunchPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
