"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { VERBS, PRONOUNS, getTensesForLevel, type Tense } from "@/lib/verbs";
import { useStore } from "@/lib/store";
import SpeakButton from "@/components/SpeakButton";

const GAME_DURATION = 60;

function getQ(level: string) {
  const availableTenses = getTensesForLevel(level);
  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
  const tense = availableTenses[Math.floor(Math.random() * availableTenses.length)];
  const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
  return { verb, tense, pronoun, answer: verb.conjugations[tense.id as Tense][pronoun] };
}

type Phase = "ready" | "playing" | "done";

export default function GameBomb() {
  const { addXP, level } = useStore();
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [q, setQ] = useState(() => getQ(level));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endGame = useCallback(() => {
    setPhase("done");
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { endGame(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, endGame]);

  const start = () => {
    setPhase("playing");
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCombo(0);
    setQ(getQ(level));
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const submit = () => {
    if (!input.trim() || phase !== "playing") return;
    const correct = input.trim().toLowerCase() === q.answer.toLowerCase();

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = Math.floor(newCombo / 3) * 5;
      const pts = 10 + bonus;
      setScore((s) => s + pts);
      addXP(pts);
      setFeedback("correct");
    } else {
      setCombo(0);
      setFeedback("wrong");
    }

    setTimeout(() => {
      setFeedback(null);
      setQ(getQ(level));
      setInput("");
      inputRef.current?.focus();
    }, 400);
  };

  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 20 ? "bg-green-500" : timeLeft > 10 ? "bg-yellow-500" : "bg-red-500";

  if (phase === "ready") {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-7xl">💣</div>
        <div>
          <h2 className="text-2xl font-black">동사 폭탄</h2>
          <p className="text-gray-500 mt-2">{GAME_DURATION}초 안에 최대한 많은 동사를 변형하세요!</p>
          <p className="text-gray-400 text-sm mt-1">3연속 정답 시 보너스 점수</p>
        </div>
        <button
          onClick={start}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-black py-4 px-10 rounded-2xl text-xl hover:shadow-lg transition-all active:scale-[0.98]"
        >
          시작!
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const rank = score >= 200 ? "🏆 전설" : score >= 100 ? "🥇 고수" : score >= 50 ? "🥈 중급" : "🥉 입문";
    return (
      <div className="text-center space-y-6 py-8 animate-bounce-in">
        <div className="text-6xl">🎊</div>
        <div>
          <p className="text-gray-400 text-sm">최종 점수</p>
          <p className="text-5xl font-black text-[#6c47ff]">{score}점</p>
          <p className="text-xl mt-2">{rank}</p>
        </div>
        <button
          onClick={start}
          className="bg-[#6c47ff] text-white font-black py-4 px-10 rounded-2xl text-lg hover:bg-[#5a38d6] transition-colors"
        >
          다시 도전!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Timer & Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
          <span className={`font-black text-3xl ${timeLeft <= 10 ? "text-red-500 animate-pop" : "text-gray-800"}`}>
            {timeLeft}
          </span>
        </div>
        <div className="text-right">
          <p className="font-black text-2xl text-[#6c47ff]">{score}점</p>
          {combo >= 3 && <p className="text-orange-500 text-sm font-bold">🔥 {combo} 콤보!</p>}
        </div>
      </div>

      {/* Timer bar */}
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`${timerColor} h-full rounded-full transition-all duration-1000`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-colors ${
        feedback === "correct" ? "border-green-400 bg-green-50" : feedback === "wrong" ? "border-red-400 bg-red-50" : "border-gray-100"
      }`}>
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{q.tense.label}</span>
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">{q.pronoun}</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <p className="text-4xl font-black">{q.verb.infinitive}</p>
          <SpeakButton text={q.verb.infinitive} size="md" />
        </div>
        <p className="text-gray-400 text-sm text-center">({q.verb.meaning})</p>

        <div className="flex items-center gap-2 mt-5">
          <span className="text-gray-500 w-16 text-right">{q.pronoun}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="입력 후 Enter..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-medium outline-none focus:border-[#6c47ff]"
          />
        </div>

        {feedback === "correct" && (
          <div className="flex items-center justify-center gap-2 mt-3 animate-bounce-in">
            <p className="text-green-600 font-bold">정답! ✓</p>
            <SpeakButton text={`${q.pronoun} ${q.answer}`} size="sm" />
          </div>
        )}
        {feedback === "wrong" && (
          <div className="flex items-center justify-center gap-2 mt-3 animate-shake">
            <p className="text-red-600 font-bold">오답! 정답: {q.answer}</p>
            <SpeakButton text={`${q.pronoun} ${q.answer}`} size="sm" />
          </div>
        )}
      </div>

      <button
        onClick={submit}
        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-black py-4 rounded-2xl text-lg hover:shadow-lg transition-all active:scale-[0.98]"
      >
        확인 (Enter)
      </button>
    </div>
  );
}
