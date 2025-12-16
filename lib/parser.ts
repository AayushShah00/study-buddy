import { Deck, Topic, Card, initialSM2 } from './types';

export const parseInputToFlashcards = async (text: string, inputType: string): Promise<Deck> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const timestamp = Date.now();

  const mockCards: Card[] = [
    {
      id: `c_${timestamp}_1`,
      question: "What is the primary function of the Mitochondria?",
      answer: "The powerhouse of the cell, responsible for generating ATP through cellular respiration.",
      type: "definition",
      topic: "Cell Biology",
      sm2: { ...initialSM2 }
    },
    {
      id: `c_${timestamp}_2`,
      question: "Which process occurs in the cytoplasm?",
      answer: "Glycolysis",
      type: "multiple_choice",
      options: ["Glycolysis", "Krebs Cycle", "Electron Transport Chain", "Oxidative Phosphorylation"],
      topic: "Cell Biology",
      sm2: { ...initialSM2 }
    },
    {
      id: `c_${timestamp}_3`,
      question: "During mitosis, chromosomes align at the _______ plate.",
      answer: "Metaphase",
      type: "cloze",
      topic: "Cell Division",
      sm2: { ...initialSM2 }
    }
  ];

  const topics: Topic[] = [
    { name: "Cell Biology", cards: mockCards.filter(c => c.topic === "Cell Biology") },
    { name: "Cell Division", cards: mockCards.filter(c => c.topic === "Cell Division") }
  ];

  return { title: "Generated Study Set: " + inputType, topics, totalCards: mockCards.length };
};
