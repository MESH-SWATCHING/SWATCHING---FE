import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOODS } from "../constants/Moods";
import { getKeywords } from "../api/swatching";
import swatchDeckLogo from "../assets/swatchDeckLogo.svg";

const MAX_SELECT = 3;

export default function BoardDeckPage() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<string[]>([...MOODS]);
  const [selected, setSelected] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);

  useEffect(() => {
    getKeywords()
      .then(({ data }) => {
        const keywords = data.data ?? data;
        if (Array.isArray(keywords) && keywords.length) {
          setKeywords(keywords.map((k: { name: string }) => k.name));
        }
      })
      .catch(() => { /* fallback to MOODS */ });
  }, []);

  const toggle = (mood: string) => {
    if (selected.includes(mood)) {
      setSelected((prev) => prev.filter((m) => m !== mood));
    } else if (selected.length >= MAX_SELECT) {
      setShaking(mood);
      setTimeout(() => setShaking(null), 200);
    } else {
      setSelected((prev) => [...prev, mood]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-24">
      <div className="max-w-md mx-auto px-5 pt-2">
        <div className="mb-8">
          <img src={swatchDeckLogo} alt="Swatch Deck" className="h-14 block" />
        </div>

        <h2 className="text-base font-bold text-[#1a1a1a] mb-4">무드 선택</h2>

        <div className="flex flex-wrap gap-2 mb-8">
          {keywords.map((mood) => (
            <button
              key={mood}
              onClick={() => toggle(mood)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-colors duration-200 active:scale-95 border
                ${selected.includes(mood) ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-[#1a1a1a] border-[#e0ddd8]"}
                ${shaking === mood ? "animate-shake" : ""}`}
            >
              {mood}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const params = selected.length > 0 ? `?moods=${selected.join(",")}` : "";
            navigate(`/boardDeck${params}`);
          }}
          className="w-full bg-[#1a1a1a] text-left rounded-2xl px-6 py-6 active:scale-[0.98] transition-transform duration-100"
        >
          <p className="text-white text-lg font-bold mb-1">Enter the Deck</p>
          <p className="text-white/50 text-sm">
            2~3개의 무드를 고르고 브랜드를 넘겨보세요.
          </p>
        </button>
      </div>
    </div>
  );
}
