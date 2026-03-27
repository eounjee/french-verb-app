"use client";

import { useState, useCallback } from "react";
import { useStore } from "@/lib/store";

const SENTENCES = [
  { fr: ["Je", "mange", "une", "pomme", "rouge."], kr: "나는 빨간 사과를 먹는다." },
  { fr: ["Tu", "parles", "français", "très", "bien."], kr: "너는 프랑스어를 매우 잘 말한다." },
  { fr: ["Il", "fait", "beau", "aujourd'hui."], kr: "오늘 날씨가 좋다." },
  { fr: ["Nous", "allons", "à", "Paris", "demain."], kr: "우리는 내일 파리에 간다." },
  { fr: ["Elle", "aime", "lire", "des", "livres."], kr: "그녀는 책 읽는 것을 좋아한다." },
  { fr: ["Vous", "pouvez", "partir", "maintenant."], kr: "당신은 지금 떠날 수 있습니다." },
  { fr: ["Ils", "ont", "une", "belle", "maison."], kr: "그들은 아름다운 집을 가지고 있다." },
  { fr: ["Je", "veux", "apprendre", "le", "français."], kr: "나는 프랑스어를 배우고 싶다." },
  { fr: ["Tu", "sais", "où", "est", "la", "gare?"], kr: "역이 어디 있는지 알아?" },
  { fr: ["Nous", "sommes", "étudiants", "en", "France."], kr: "우리는 프랑스에 있는 학생들이다." },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Round {
  sentence: (typeof SENTENCES)[number];
  available: string[];
  selected: string[];
}

function newRound(): Round {
  const sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  return { sentence, available: shuffle(sentence.fr), selected: [] };
}

type State = "idle" | "correct" | "wrong";

export default function GameShuffle() {
  const { addXP } = useStore();
  const [round, setRound] = useState<Round>(newRound);
  const [state, setState] = useState<State>("idle");
  const [score, setScore] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const { sentence, available, selected } = round;

  const init = useCallback(() => {
    setRound(newRound());
    setState("idle");
    setAnimKey((k) => k + 1);
  }, []);

  const pickWord = (idx: number) => {
    if (state !== "idle") return;
    setRound((r) => {
      const newAvailable = [...r.available];
      const [word] = newAvailable.splice(idx, 1);
      return { ...r, available: newAvailable, selected: [...r.selected, word] };
    });
  };

  const removeWord = (idx: number) => {
    if (state !== "idle") return;
    setRound((r) => {
      const newSelected = [...r.selected];
      const [word] = newSelected.splice(idx, 1);
      return { ...r, available: [...r.available, word], selected: newSelected };
    });
  };

  const resetWords = () => {
    setRound((r) => ({
      ...r,
      available: shuffle([...r.available, ...r.selected]),
      selected: [],
    }));
  };

  const check = () => {
    if (selected.length !== sentence.fr.length) return;
    const correct = selected.join(" ") === sentence.fr.join(" ");
    setState(correct ? "correct" : "wrong");
    if (correct) {
      addXP(15);
      setScore((s) => s + 15);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">단어를 순서대로 클릭하세요</p>
        <span className="font-black text-xl text-[#6c47ff]">{score}점</span>
      </div>

      {/* Korean hint */}
      <div key={animKey} className="bg-blue-50 border border-blue-200 rounded-2xl p-4 animate-bounce-in">
        <p className="text-xs text-blue-400 font-medium mb-1">한국어 힌트</p>
        <p className="text-blue-800 font-bold text-lg">{sentence.kr}</p>
      </div>

      {/* Selected words area */}
      <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-200 min-h-[80px] flex flex-wrap gap-2 items-center">
        {selected.length === 0 && (
          <p className="text-gray-300 text-sm w-full text-center">단어를 여기에 배열하세요</p>
        )}
        {selected.map((w, i) => (
          <button
            key={`sel-${i}`}
            onClick={() => removeWord(i)}
            className="bg-[#6c47ff] text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-[#5a38d6] transition-colors"
          >
            {w}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {available.map((w, i) => (
          <button
            key={`av-${i}`}
            onClick={() => pickWord(i)}
            disabled={state !== "idle"}
            className="bg-gray-100 text-gray-800 px-3 py-2 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {w}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {state === "correct" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 animate-bounce-in">
          <p className="text-green-700 font-bold">정답입니다! 🎉 +15 XP</p>
          <p className="text-green-600 text-sm mt-1">{sentence.fr.join(" ")}</p>
        </div>
      )}
      {state === "wrong" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 animate-shake">
          <p className="text-red-700 font-bold">다시 해보세요!</p>
          <p className="text-gray-500 text-sm mt-1">정답: {sentence.fr.join(" ")}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={resetWords}
          disabled={state !== "idle" || selected.length === 0}
          className="flex-1 border-2 border-gray-200 text-gray-500 font-bold py-4 rounded-2xl hover:border-gray-300 transition-colors disabled:opacity-40"
        >
          초기화
        </button>
        {state === "idle" ? (
          <button
            onClick={check}
            disabled={selected.length !== sentence.fr.length}
            className="flex-2 bg-[#6c47ff] text-white font-black py-4 px-8 rounded-2xl hover:bg-[#5a38d6] transition-colors disabled:opacity-40"
          >
            확인
          </button>
        ) : (
          <button
            onClick={init}
            className="flex-2 bg-[#6c47ff] text-white font-black py-4 px-8 rounded-2xl hover:bg-[#5a38d6] transition-colors"
          >
            다음 문장 →
          </button>
        )}
      </div>
    </div>
  );
}
