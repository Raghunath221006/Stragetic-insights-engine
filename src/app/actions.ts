"use server";

import { generateExecutiveSummary } from "@/ai/flows/generate-executive-summary";
import { analyzeCustomerSentiment } from "@/ai/flows/analyze-customer-sentiment";
import { generateMarketingContent } from "@/ai/flows/generate-marketing-content";
import type { MarketReport, QuantitativeData, QualitativeData } from "@/types";

// Mock data and simulated agent workflow
const MOCK_QUANTITATIVE_DATA: QuantitativeData[] = [
  { brand: "Sony", marketShare: 35, price: 349, rating: 4.8 },
  { brand: "Bose", marketShare: 25, price: 399, rating: 4.7 },
  { brand: "Brand C (Generic)", marketShare: 15, price: 199, rating: 3.5 },
  { brand: "Sennheiser", marketShare: 10, price: 299, rating: 4.6 },
  { brand: "Other", marketShare: 15, price: 150, rating: 4.0 },
];

const MOCK_REVIEWS_TEXT = [
  "Sony's new headphones are a game-changer! The noise cancellation is top-notch, and the sound quality is crisp and clear. Worth every penny.",
  "I'm really impressed with the Bose headphones. They are incredibly comfortable for long listening sessions, and the audio is perfectly balanced.",
  "The battery life on my Brand C headphones is terrible. They die after just a few hours of use, which is incredibly frustrating. I would not recommend them.",
  "Sennheiser delivers again. The build quality is excellent, and they feel very premium. The sound is detailed and great for audiophiles.",
  "My Brand C headphones broke after a month. The plastic feels cheap and they just stopped charging. Very disappointed with the poor battery life and overall quality.",
];

function createMarketReportText(quantitative: QuantitativeData[], qualitative: {review: string}[]): string {
    const quantText = quantitative.map(d => 
        `Brand: ${d.brand}, Market Share: ${d.marketShare}%, Price: $${d.price}, Avg. Rating: ${d.rating}/5`
    ).join('\n');

    const qualText = qualitative.map((r, i) => `Review ${i+1}: ${r.review}`).join('\n\n');

    return `
# Market Research Report: Wireless Headphones

## Quantitative Analysis
This section provides a numerical overview of the market.
${quantText}

## Qualitative Analysis
This section contains raw customer feedback.
${qualText}

## Summary of Findings
- Sony leads the market with a 35% share and the highest rating (4.8), indicating strong customer satisfaction.
- Bose is a strong competitor, known for comfort and balanced audio.
- Brand C has a significant market share (15%) but suffers from a very low rating (3.5). Customer reviews frequently mention 'poor battery life' and 'cheap quality'. This suggests a gap in the market for a reliable, mid-range product.
- Sennheiser appeals to a niche audiophile market.
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

  // 1. Simulate Research Agent: Gather data (using mock data here)
  const quantitativeData = MOCK_QUANTITATIVE_DATA;
  const rawReviews = MOCK_REVIEWS_TEXT;
  
  // 2. Simulate Analytics Agent: Analyze qualitative data
  const qualitativeDataPromises = rawReviews.map(async (review) => {
    const analysis = await analyzeCustomerSentiment({ text: review });
    return { review, analysis };
  });
  const qualitativeData: QualitativeData[] = await Promise.all(qualitativeDataPromises);
  
  // Create a text-based report for other agents to use
  const reportText = createMarketReportText(quantitativeData, qualitativeData);

  // 3. Simulate Analytics Agent: Generate executive summary & key insights
  const summaryPromise = generateExecutiveSummary({ marketResearchReport: reportText });

  // 4. Simulate Content Agent: Generate marketing content
  const marketingPromise = generateMarketingContent({ marketResearchReport: reportText });

  const [summaryResult, marketingResult] = await Promise.all([summaryPromise, marketingPromise]);

  const report: MarketReport = {
    executiveSummary: summaryResult.executiveSummary,
    quantitativeData: quantitativeData,
    qualitativeData: qualitativeData,
    keyInsights: [
        "Sony's market dominance is supported by superior product quality and user satisfaction.",
        "Brand C's low 3.5/5 rating is directly correlated with a high volume of negative comments (40%) specifically about 'poor battery life'.",
        "There is a market opportunity for a mid-priced headphone ($200-$250) that offers reliable battery life and build quality.",
        "High-end brands like Bose and Sennheiser compete on specific features like comfort and audio fidelity rather than price."
    ],
    marketingContent: marketingResult.marketingContentExamples,
  };

  return report;
}
