export interface AgentInput {
  topic: string;
  audience: string;
  platform: string;
  contentType: string;
}

export interface ResearchResult {
  topicSummary: string;
  marketOpportunity: string;
  trendingQuestions: string[];
  audiencePainPoints: string[];
  competitorAnalysis: string;
  keywordSuggestions: string[];
  videoIdeas: string[];
  contentAngles: string[];
  recommendedTitles: string[];
}

export interface BaseAgent<TInput, TResult> {
  run(input: TInput): Promise<TResult>;
}
