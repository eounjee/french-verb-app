"use client";

import { useState, useCallback } from "react";
import { VERBS, PRONOUNS, TENSES, getTensesForLevel, type Tense } from "@/lib/verbs";
import { useStore } from "@/lib/store";
import SpeakButton from "@/components/SpeakButton";

function getRandomQuestion(level: string) {
  const availableTenses = getTensesForLevel(level);
  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
  const tense = availableTenses[Math.floor(Math.random() * availableTenses.length)];
  const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
  const answer = verb.conjugations[tense.id as Tense][pronoun];
  return { verb, tense, pronoun, answer };
}

type State = "idle" | "correct" | "wrong";

export default function QuizMode() {
  const { recordAnswer, addXP, level } = useStore();
  const [q, setQ] = useState(() => getRandomQuestion(level));
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>("idle");
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const next = useCallback(() => {
    setQ(getRandomQuestion(level));
    setInput("");
    setState("idle");
    setShowTable(false);
    setAnimKey((k) => k + 1);
  }, []);

  const check = () => {
    if (!input.trim() || state !== "idle") return;
    const correct = input.trim().toLowerCase() === q.answer.toLowerCase();
    setState(correct ? "correct" : "wrong");
    recordAnswer(q.verb.infinitive, correct);

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 3 ? 5 : 0;
      addXP(10 + bonus);
      setScore((s) => s + 10 + bonus);
    } else {
      setCombo(0);
    }
  };

  const allConjugations = q.verb.conjugations[q.tense.id as Tense];

  return (
    <div className="space-y-5">
      {/* Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl text-[#6c47ff]">{score}</span>
          <span className="text-gray-400 text-sm">점</span>
        </div>
        {combo >= 2 && (
          <div className="bg-orange-100 text-orange-600 text-sm font-black px-3 py-1 rounded-full animate-bounce-in">
            🔥 {combo} 콤보!
          </div>
        )}
      </div>

      {/* Question Card */}
      <div key={animKey} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-bounce-in">
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {q.tense.label}
          </span>
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
            {q.pronoun}
          </span>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm mb-1">다음 동사를 변형하세요</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-4xl font-black text-[#1a1a2e]">{q.verb.infinitive}</p>
            <SpeakButton text={q.verb.infinitive} size="lg" />
          </div>
          <p className="text-gray-400 text-sm mt-1">({q.verb.meaning})</p>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-500 font-medium w-16 text-right">{q.pronoun}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (state === "idle" ? check() : next())}
            placeholder="동사 변형 입력..."
            disabled={state !== "idle"}
            className={`flex-1 border-2 rounded-xl px-4 py-3 text-lg font-medium outline-none transition-colors ${
              state === "correct"
                ? "border-green-400 bg-green-50 text-green-700"
                : state === "wrong"
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-gray-200 focus:border-[#6c47ff]"
            }`}
            autoFocus
          />
        </div>

        {/* Feedback */}
        {state === "correct" && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 animate-bounce-in">
            <div className="flex items-center justify-between">
              <p className="text-green-700 font-bold">정답입니다! 🎉 +10 XP{combo >= 3 ? " +5 콤보 보너스" : ""}</p>
              <SpeakButton text={`${q.pronoun} ${q.answer}`} size="sm" />
            </div>
          </div>
        )}
        {state === "wrong" && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 animate-shake">
            <div className="flex items-center justify-between">
              <p className="text-red-700 font-bold">오답! 정답: <span className="underline">{q.answer}</span></p>
              <SpeakButton text={`${q.pronoun} ${q.answer}`} size="sm" />
            </div>
            <button
              onClick={() => setShowTable(!showTable)}
              className="text-red-500 text-sm mt-1 underline"
            >
              {showTable ? "변형표 닫기" : "전체 변형표 보기"}
            </button>
          </div>
        )}

        {/* Conjugation table on wrong */}
        {showTable && state === "wrong" && (
          <div className="mt-3 bg-gray-50 rounded-xl p-4 animate-bounce-in">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">{q.verb.infinitive} — {q.tense.label}</p>
            <div className="grid grid-cols-2 gap-1">
              {PRONOUNS.map((p) => (
                <div key={p} className={`flex gap-2 py-1 px-2 rounded-lg text-sm ${p === q.pronoun ? "bg-purple-100" : ""}`}>
                  <span className="text-gray-400 w-14">{p}</span>
                  <span className="font-medium">{allConjugations[p]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={state === "idle" ? check : next}
        className="w-full bg-[#6c47ff] text-white font-black py-4 rounded-2xl text-lg hover:bg-[#5a38d6] transition-colors active:scale-[0.98]"
      >
        {state === "idle" ? "확인" : "다음 문제 →"}
      </button>
    </div>
  );
}
