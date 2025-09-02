"use server";

import { generateExecutiveSummary } from "@/ai/flows/generate-executive-summary";
import { analyzeCustomerSentiment } from "@/ai/flows/analyze-customer-sentiment";
import { generateMarketingContent } from "@/ai/flows/generate-marketing-content";
import { generateMarketResearchData } from "@/ai/flows/generate-market-research-data";
import { generateLaunchPlan } from "@/ai/flows/generate-launch-plan";
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

  // 3. Analytics Agent: Generate executive summary
  const summaryPromise = generateExecutiveSummary({ marketResearchReport: reportText });

  // 4. Content Agent: Generate marketing content
  const marketingPromise = generateMarketingContent({ marketResearchReport: reportText });
  
  // 5. Strategist Agent: Generate key insights and a full launch plan
  const launchPlanPromise = generateLaunchPlan({ marketResearchReport: reportText, topic });


  const [summaryResult, marketingResult, launchPlanResult] = await Promise.all([summaryPromise, marketingPromise, launchPlanPromise]);
  
  const report: MarketReport = {
    executiveSummary: summaryResult.executiveSummary,
    quantitativeData: quantitativeData,
    qualitativeData: qualitativeData,
    keyInsights: launchPlanResult.keyInsights,
    marketingContent: marketingResult.marketingContentExamples,
    launchStrategy: launchPlanResult.launchStrategy,
  };

  return report;
}
