"use server";

import { generateExecutiveSummary } from "@/ai/flows/generate-executive-summary";
import { analyzeCustomerSentiment } from "@/ai/flows/analyze-customer-sentiment";
import { generateMarketingContent } from "@/ai/flows/generate-marketing-content";
import type { MarketReport, QuantitativeData, QualitativeData } from "@/types";

// Mock data and simulated agent workflow
const MOCK_QUANTITATIVE_DATA: QuantitativeData[] = [
  { brand: "Sony", marketShare: 30, price: 29990, rating: 4.8 },
  { brand: "Bose", marketShare: 20, price: 34900, rating: 4.7 },
  { brand: "boAt", marketShare: 25, price: 3999, rating: 4.2 },
  { brand: "Sennheiser", marketShare: 10, price: 24990, rating: 4.6 },
  { brand: "Other", marketShare: 15, price: 8000, rating: 4.0 },
];

const MOCK_REVIEWS_TEXT = [
  "Sony's new headphones are a game-changer! The noise cancellation is top-notch, and the sound quality is crisp and clear. Worth every rupee.",
  "I'm really impressed with the Bose headphones. They are incredibly comfortable for long listening sessions, and the audio is perfectly balanced. A premium product for sure.",
  "The battery life on my boAt headphones is amazing, easily lasts a week! They are so affordable and offer great value. Bass is a bit heavy sometimes, but I like it.",
  "Sennheiser delivers again. The build quality is excellent, and they feel very premium. The sound is detailed and great for audiophiles who value clarity.",
  "My boAt headphones are a style statement and sound great for the price. The battery life is also a huge plus. Can't complain at all for what I paid.",
];

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

## Summary of Findings
- Sony leads the premium market with a 30% share and the highest rating (4.8), indicating strong customer satisfaction.
- boAt is a dominant player in the budget segment with 25% market share, praised for battery life and value.
- Bose is a strong competitor in the premium space, known for comfort and balanced audio.
- There is a clear market segmentation between premium brands (Sony, Bose, Sennheiser) and value-for-money brands like boAt.
- Sennheiser appeals to a niche audiophile market that prioritizes audio fidelity.
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
        "Sony's premium market dominance is supported by superior product quality and user satisfaction.",
        "boAt's success hinges on aggressive pricing, long battery life, and bass-heavy sound signature that appeals to the local youth.",
        "A market opportunity exists for products that bridge the gap between budget and premium, offering premium features at a mid-range price point.",
        "High-end brands like Bose and Sennheiser compete on specific features like comfort and audio fidelity rather than price."
    ],
    marketingContent: marketingResult.marketingContentExamples,
  };

  return report;
}
