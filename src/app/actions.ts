"use server";

import { generateExecutiveSummary } from "@/ai/flows/generate-executive-summary";
import { analyzeCustomerSentiment } from "@/ai/flows/analyze-customer-sentiment";
import { generateMarketingContent } from "@/ai/flows/generate-marketing-content";
import { generateMarketResearchData } from "@/ai/flows/generate-market-research-data";
import type { MarketReport, QuantitativeData, QualitativeData } from "@/types";

function createMarketReportText(quantitative: QuantitativeData[], qualitative: {review: string}[]): string {
    const quantText = quantitative.map(d => 
        `Brand: ${d.brand}, Market Share: ${d.marketShare}%, Price: ₹${d.price}, Avg. Rating: ${d.rating}/5`
    ).join('\n');

    const qualText = qualitative.map((r, i) => `Review ${i+1}: ${r.review}`).join('\n\n');

    return `
# Market Research Report: Wireless Headphones in India

## Quantitative Analysis
This section provides a numerical overview of the market.
${quantText}

## Qualitative Analysis
This section contains raw customer feedback.
${qualText}
`;
}

export async function getMarketResearchReport(
  topic: string
): Promise<MarketReport> {
  // Simulate network latency for a more realistic feel
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!topic) {
    throw new Error("A research topic must be provided.");
  }

  // 1. Research Agent: Generate dynamic, realistic data based on the topic
  const researchData = await generateMarketResearchData({ topic: `${topic} in India` });
  const quantitativeData = researchData.quantitativeData;
  const rawReviews = researchData.reviews;
  
  // 2. Analytics Agent: Analyze qualitative data (customer reviews)
  const qualitativeDataPromises = rawReviews.map(async (review) => {
    const analysis = await analyzeCustomerSentiment({ text: review });
    return { review, analysis };
  });
  const qualitativeData: QualitativeData[] = await Promise.all(qualitativeDataPromises);
  
  // Create a text-based report for other agents to use
  const reportText = createMarketReportText(quantitativeData, qualitativeData);

  // 3. Analytics Agent: Generate executive summary & key insights
  // We'll add some context to the report text for a better summary
  const summaryPromptText = `${reportText}\n\n## Summary of Findings\nBased on the data, provide a summary of key findings and market trends.`
  const summaryPromise = generateExecutiveSummary({ marketResearchReport: summaryPromptText });

  // 4. Content Agent: Generate marketing content
  const marketingPromise = generateMarketingContent({ marketResearchReport: reportText });
  
  // 5. Insights Agent: Generate key insights (using a separate prompt)
  const insightsPromise = ai.generate({
      prompt: `Based on the following market research report, extract 4 key, actionable insights for a business looking to enter or grow in this market.\n\n${reportText}`,
      output: {
          schema: z.object({
              insights: z.array(z.string()),
          }),
      },
  });


  const [summaryResult, marketingResult, insightsResult] = await Promise.all([summaryPromise, marketingPromise, insightsPromise]);
  
  const report: MarketReport = {
    executiveSummary: summaryResult.executiveSummary,
    quantitativeData: quantitativeData,
    qualitativeData: qualitativeData,
    keyInsights: insightsResult.output?.insights ?? [],
    marketingContent: marketingResult.marketingContentExamples,
  };

  return report;
}

// We need to import these for the insights generation
import { ai } from "@/ai/genkit";
import { z } from "genkit";
