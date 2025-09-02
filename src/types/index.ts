export type SentimentAnalysis = {
  sentiment: string;
  keyTopics: string[];
  summary: string;
};

export type QuantitativeData = {
  brand: string;
  marketShare: number;
  price: number;
  rating: number;
};

export type QualitativeData = {
  review: string;
  analysis: SentimentAnalysis;
};

export type MarketReport = {
  executiveSummary: string;
  quantitativeData: QuantitativeData[];
  qualitativeData: QualitativeData[];
  keyInsights: string[];
  marketingContent: string[];
};
