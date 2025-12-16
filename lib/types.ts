export interface SM2Data {
  ease: number;
  interval: number;
  repetitions: number;
  nextReview: number | null;
}

export interface Card {
  id: string;
  question: string;
  answer: string;
  type: 'definition' | 'multiple_choice' | 'cloze' | 'short_answer';
  options?: string[];
  sm2: SM2Data;
  topic: string;
}

export interface Topic {
  name: string;
  cards: Card[];
}

export interface Deck {
  title: string;
  topics: Topic[];
  totalCards: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
