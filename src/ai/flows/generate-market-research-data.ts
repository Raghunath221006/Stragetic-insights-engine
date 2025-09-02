'use server';

/**
 * @fileOverview A flow for generating realistic market research data.
 *
 * - generateMarketResearchData - A function that generates market research data.
 * - GenerateMarketResearchDataInput - The input type for the generateMarketResearchData function.
 * - GenerateMarketResearchDataOutput - The return type for the generateMarketResearchData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuantitativeDataSchema = z.object({
  brand: z.string().describe('The brand name.'),
  marketShare: z.number().describe('The market share of the brand as a percentage.'),
  price: z.number().describe('The average price of the products in INR.'),
  rating: z.number().describe('The average customer rating out of 5.'),
});

const GenerateMarketResearchDataInputSchema = z.object({
  topic: z
    .string()
    .describe('The market research topic, e.g., "Wireless Headphones in India".'),
});
export type GenerateMarketResearchDataInput = z.infer<typeof GenerateMarketResearchDataInputSchema>;

const GenerateMarketResearchDataOutputSchema = z.object({
  quantitativeData: z.array(QuantitativeDataSchema).describe('A list of 5-6 top brands with their market data.'),
  reviews: z.array(z.string()).describe('A list of 5 realistic and varied customer reviews for the products.'),
});
export type GenerateMarketResearchDataOutput = z.infer<typeof GenerateMarketResearchDataOutputSchema>;

export async function generateMarketResearchData(
  input: GenerateMarketResearchDataInput
): Promise<GenerateMarketResearchDataOutput> {
  return generateMarketResearchDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketResearchDataPrompt',
  input: {schema: GenerateMarketResearchDataInputSchema},
  output: {schema: GenerateMarketResearchDataOutputSchema},
  prompt: `You are a market research expert with deep knowledge of the Indian market.
  
  Your task is to generate a realistic market research dataset for the following topic: {{{topic}}}.

  Please provide the following:
  1.  A list of the top 5-6 competing brands in the Indian market for this topic. For each brand, provide a realistic market share percentage, an average product price in Indian Rupees (₹), and an average customer rating out of 5. The market shares should not add up to exactly 100% to account for "Other" brands.
  2.  A list of 5 realistic, diverse, and insightful customer reviews. These reviews should reflect a range of opinions (positive, negative, neutral) and mention specific product features, issues, or experiences relevant to Indian consumers.
  
  Generate the output in the requested JSON format.
  `,
});

const generateMarketResearchDataFlow = ai.defineFlow(
  {
    name: 'generateMarketResearchDataFlow',
    inputSchema: GenerateMarketResearchDataInputSchema,
    outputSchema: GenerateMarketResearchDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
