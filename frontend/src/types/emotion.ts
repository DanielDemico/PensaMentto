export interface EmotionRecord {
  analise: {
    sentimento: string;
    pontuation: number;
    key_words: string[];
  };
  key_words: string[];
  pontuation: number;
  sentimento: string;
  createdAt: string;
  tags: string[];
  text: string;
}
