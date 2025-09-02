'use server';

/**
 * @fileOverview This flow analyzes customer reviews and social media comments to determine sentiment and identify key topics.
 *
 * - analyzeCustomerSentiment - A function that handles the analysis of customer sentiment.
 * - AnalyzeCustomerSentimentInput - The input type for the analyzeCustomerSentiment function.
 * - AnalyzeCustomerSentimentOutput - The return type for the analyzeCustomerSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCustomerSentimentInputSchema = z.object({
  text: z.string().describe('Customer review or social media comment.'),
});
export type AnalyzeCustomerSentimentInput = z.infer<typeof AnalyzeCustomerSentimentInputSchema>;

const AnalyzeCustomerSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe('Overall sentiment of the text (positive, negative, or neutral).'),
  keyTopics: z
    .array(z.string())
    .describe('Key topics discussed in the text, such as product features or issues.'),
  summary: z.string().describe('A short summary of the provided text.'),
});
export type AnalyzeCustomerSentimentOutput = z.infer<typeof AnalyzeCustomerSentimentOutputSchema>;

export async function analyzeCustomerSentiment(input: AnalyzeCustomerSentimentInput): Promise<AnalyzeCustomerSentimentOutput> {
  return analyzeCustomerSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerSentimentPrompt',
  input: {schema: AnalyzeCustomerSentimentInputSchema},
  output: {schema: AnalyzeCustomerSentimentOutputSchema},
  prompt: `Analyze the following customer review or social media comment:

Text: {{{text}}}

Determine the overall sentiment (positive, negative, or neutral) and identify the key topics discussed. Also generate a short summary of the text.

Output the sentiment, key topics, and summary in JSON format. Make sure the key topics do not include the sentiment itself.
`,
});

const analyzeCustomerSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerSentimentFlow',
    inputSchema: AnalyzeCustomerSentimentInputSchema,
    outputSchema: AnalyzeCustomerSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
