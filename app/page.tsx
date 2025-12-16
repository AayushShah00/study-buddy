"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaYoutube, FaFilePdf, FaImage, FaGlobe, FaPen, FaBrain, FaClock, FaChalkboardTeacher, FaChartLine } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputValue) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputValue, type: inputType }),
      });

      const data = await res.json();
      if (data.deck) {
        const deckId = Date.now().toString();
        localStorage.setItem(`deck_${deckId}`, JSON.stringify(data.deck));
        router.push(`/deck/${deckId}`);
      }
    } catch (error) {
      console.error("Error generating deck", error);
    } finally {
      setLoading(false);
    }
  };

  const inputOptions = [
    { id: "text", icon: FaPen, label: "Text" },
    { id: "youtube", icon: FaYoutube, label: "YouTube" },
    { id: "file", icon: FaFilePdf, label: "File" },
    { id: "image", icon: FaImage, label: "Image" },
    { id: "web", icon: FaGlobe, label: "Webpage" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="w-full py-6 text-center bg-white shadow-sm border-b border-slate-200">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-brand-gradient tracking-tight">
          STUDY BUDDY
        </h1>
        <p className="text-slate-500 mt-2">AI-Powered Flashcards & Personal Tutor</p>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-4xl px-4 mt-12 flex-grow">
        {/* Input Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {inputOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setInputType(opt.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all btn-animate ${
                  inputType === opt.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <opt.icon />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="mb-8">
            <textarea
              className="w-full h-40 p-4 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none text-lg"
              placeholder={inputType === "text" ? "Paste your notes here..." : "Enter URL here..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-brand-gradient text-white text-xl font-bold shadow-lg shadow-blue-500/30 btn-animate disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Knowledge...
              </span>
            ) : (
              "Generate Flashcards"
            )}
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-16 mb-12">
          {[
            { icon: FaBrain, title: "AI Flashcards", desc: "Instant concepts" },
            { icon: FaClock, title: "Spaced Repetition", desc: "SM-2 Algorithm" },
            { icon: FaChalkboardTeacher, title: "AI Tutor", desc: "Personalized Help" },
            { icon: FaChartLine, title: "Weakness Tracking", desc: "Smart Analytics" },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <feature.icon className="text-3xl text-brand-blue mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
