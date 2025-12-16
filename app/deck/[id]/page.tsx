"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, Deck, ChatMessage } from "@/lib/types";
import { calculateSM2 } from "@/lib/sm2";
import { FaArrowLeft, FaLightbulb, FaRobot, FaPaperPlane, FaRedo } from "react-icons/fa";

export default function DeckPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm your AI Tutor. Stuck on a card? Ask me anything!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedDeck = localStorage.getItem(`deck_${params.id}`);
    if (savedDeck) setDeck(JSON.parse(savedDeck));
    else router.push("/");
  }, [params.id, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showTutor]);

  if (!deck) return <div className="p-10 text-center">Loading Deck...</div>;

  const allCards = deck.topics.flatMap((t) => t.cards);
  const currentCard = allCards[activeCardIndex];

  const handleRating = (quality: number) => {
    const updatedSm2 = calculateSM2(currentCard.sm2, quality);
    const newCards = [...allCards];
    newCards[activeCardIndex] = { ...currentCard, sm2: updatedSm2 };

    if (quality < 3) setWeaknesses((prev) => Array.from(new Set([...prev, currentCard.topic])));

    setIsFlipped(false);
    setTimeout(() => {
      if (activeCardIndex < allCards.length - 1) setActiveCardIndex((prev) => prev + 1);
      else {
        alert("Session Complete!");
        setActiveCardIndex(0);
      }
    }, 300);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, context: currentCard, weaknesses }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <header className="bg-white shadow-sm p-4 flex items-center justify-between z-10">
        <button onClick={() => router.push("/")} className="text-slate-500 hover:text-slate-900 flex items-center gap-2">
          <FaArrowLeft /> Back
        </button>
        <h1 className="font-bold text-lg truncate max-w-md">{deck.title}</h1>
        <div className="text-sm text-slate-500">
          Card {activeCardIndex + 1} / {allCards.length}
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Flashcard Section */}
        <section className={`flex-grow flex flex-col items-center justify-center p-6 transition-all duration-300 ${showTutor ? "md:w-2/3" : "w-full"}`}>
          <div className="w-full max-w-2xl perspective-1000 h-[400px] relative cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? "rotate-y-180" : ""}`}>
              {/* Front */}
              <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center justify-center backface-hidden">
                <span className="absolute top-6 left-6 text-xs font-bold text-brand-blue uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                  {currentCard.topic}
                </span>
                <h2 className="text-2xl font-bold text-center">{currentCard.question}</h2>
                <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
                  <FaRedo /> Click to flip
                </div>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full bg-slate-50 rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180">
                <h2 className="text-xl text-center text-slate-700">{currentCard.answer}</h2>
                {currentCard.options && (
                  <ul className="mt-4 space-y-2 w-full">
                    {currentCard.options.map((opt, i) => (
                      <li key={i} className={`p-2 rounded border ${opt === currentCard.answer ? "bg-green-100 border-green-300" : "bg-white border-slate-200"}`}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Rating Controls */}
          <div className={`mt-8 flex gap-4 transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {[
              { label: "Again", color: "bg-red-500", val: 0 },
              { label: "Hard", color: "bg-orange-500", val: 3 },
              { label: "Good", color: "bg-blue-500", val: 4 },
              { label: "Easy", color: "bg-green-500", val: 5 },
            ].map((btn) => (
              <button key={btn.label} onClick={(e) => { e.stopPropagation(); handleRating(btn.val); }} className={`${btn.color} text-white px-6 py-2 rounded-lg font-bold shadow-md btn-animate hover:brightness-110`}>
                {btn.label}
              </button>
            ))}
          </div>
        </section>

        {/* AI Tutor Sidebar */}
        <aside className={`${showTutor ? "translate-x-0" : "translate-x-full hidden md:flex md:translate-x-0 md:w-1/3"} fixed md:relative top-0 right-0 h-full w-full md:w-1/3 bg-white border-l border-slate-200 shadow-2xl md:shadow-none z-30 transition-transform duration-300 flex flex-col`}>
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <FaRobot className="text-brand-green" /> AI Tutor
            </div>
            <button onClick={() => setShowTutor(false)} className="md:hidden text-slate-400">Close</button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === "user" ? "bg-brand-blue text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatLoading && <div className="text-xs text-slate-400 p-2">AI is thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            {weaknesses.length > 0 && (
              <div className="text-xs text-orange-500 mb-2 flex items-center gap-1">
                <FaLightbulb /> Focusing on: {weaknesses.slice(-2).join(", ")}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask for a hint or explanation..."
                className="flex-grow p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-brand-blue"
              />
              <button onClick={handleSendMessage} disabled={isChatLoading} className="bg-brand-blue text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
