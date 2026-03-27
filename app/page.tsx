"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { LEVEL_CONFIG, type Level } from "@/lib/store";
import QuizMode from "@/components/QuizMode";
import GameBomb from "@/components/GameBomb";
import GameShuffle from "@/components/GameShuffle";
import VerbTable from "@/components/VerbTable";
import ParaphraseStudio from "@/components/ParaphraseStudio";

type Tab = "home" | "quiz" | "bomb" | "shuffle" | "table" | "paraphrase";

const DAILY_XP_GOAL = 100;

export default function Home() {
  const { xp, streak, totalAnswered, totalCorrect, checkAndUpdateStreak, level, setLevel } = useStore();
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const dailyXP = xp % DAILY_XP_GOAL;
  const xpProgress = Math.min((dailyXP / DAILY_XP_GOAL) * 100, 100);

  if (tab !== "home") {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setTab("home")}
              className="text-[#6c47ff] hover:bg-purple-50 rounded-lg p-2 transition-colors"
            >
              ← 홈
            </button>
            <span className="font-bold text-gray-700">
              {tab === "quiz" && "변형 퀴즈"}
              {tab === "bomb" && "동사 폭탄"}
              {tab === "shuffle" && "문장 조립"}
              {tab === "table" && "변형표 사전"}
              {tab === "paraphrase" && "AI 패러프레이징"}
            </span>
          </div>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          {tab === "quiz" && <QuizMode />}
          {tab === "bomb" && <GameBomb />}
          {tab === "shuffle" && <GameShuffle />}
          {tab === "table" && <VerbTable />}
          {tab === "paraphrase" && <ParaphraseStudio />}
        </main>
        <nav className="bg-white border-t border-gray-200 sticky bottom-0">
          <div className="max-w-2xl mx-auto flex">
            {[
              { icon: "🏠", label: "홈", id: "home" as Tab },
              { icon: "📝", label: "퀴즈", id: "quiz" as Tab },
              { icon: "📖", label: "사전", id: "table" as Tab },
              { icon: "✨", label: "AI", id: "paraphrase" as Tab },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                  tab === n.id ? "text-[#6c47ff]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="text-lg">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#6c47ff]">🇫🇷 FrenchVerb</h1>
            <p className="text-xs text-gray-400">프랑스어 동사 마스터</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
              <span>🔥</span>
              <span className="font-bold text-orange-500 text-sm">{streak}일</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
              <span>⭐</span>
              <span className="font-bold text-yellow-600 text-sm">{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Daily Quest */}
        <div className="bg-gradient-to-r from-[#6c47ff] to-[#9c6fff] rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-purple-200 text-sm font-medium">오늘의 목표</p>
              <p className="text-2xl font-black">{dailyXP} / {DAILY_XP_GOAL} XP</p>
            </div>
            <div className="text-4xl">{dailyXP >= DAILY_XP_GOAL ? "🏆" : "🎯"}</div>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          {dailyXP >= DAILY_XP_GOAL && (
            <p className="text-purple-100 text-sm mt-2 font-medium">오늘의 목표 달성! 🎉</p>
          )}
        </div>

        {/* Level Selector */}
        <section>
          <h2 className="text-lg font-black text-gray-700 mb-3">📊 내 레벨</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(LEVEL_CONFIG) as Level[]).map((lv) => {
              const cfg = LEVEL_CONFIG[lv];
              const active = level === lv;
              return (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`rounded-2xl p-4 text-left border-2 transition-all ${
                    active
                      ? "border-[#6c47ff] bg-purple-50"
                      : "border-gray-100 bg-white hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{cfg.emoji}</span>
                    {active && <span className="text-xs font-bold text-[#6c47ff] bg-purple-100 px-2 py-0.5 rounded-full">선택됨</span>}
                  </div>
                  <p className="font-black text-gray-800 mt-1">{cfg.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cfg.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "총 문제", value: totalAnswered, icon: "📝" },
            { label: "정답률", value: `${accuracy}%`, icon: "🎯" },
            { label: "획득 XP", value: xp, icon: "⭐" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-xl text-[#1a1a2e]">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mini Games */}
        <section>
          <h2 className="text-lg font-black text-gray-700 mb-3">🎮 미니게임</h2>
          <div className="grid grid-cols-1 gap-3">
            <GameCard
              icon="📝"
              title="변형 퀴즈"
              desc="시제와 인칭에 맞는 동사를 입력하세요"
              color="from-blue-500 to-blue-600"
              xpText="+10 XP/정답"
              onClick={() => setTab("quiz")}
            />
            <GameCard
              icon="💣"
              title="동사 폭탄"
              desc="제한 시간 안에 쏟아지는 문제를 해결하세요!"
              color="from-red-500 to-orange-500"
              xpText="+콤보 보너스"
              onClick={() => setTab("bomb")}
            />
            <GameCard
              icon="🔀"
              title="문장 조립"
              desc="뒤섞인 단어를 올바른 순서로 배열하세요"
              color="from-green-500 to-teal-500"
              xpText="+15 XP/정답"
              onClick={() => setTab("shuffle")}
            />
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="text-lg font-black text-gray-700 mb-3">🛠️ 학습 도구</h2>
          <div className="grid grid-cols-2 gap-3">
            <ToolCard
              icon="📖"
              title="변형표 사전"
              desc="동사 전체 변형표 조회"
              onClick={() => setTab("table")}
            />
            <ToolCard
              icon="✨"
              title="AI 패러프레이징"
              desc="내 문장을 AI가 변환"
              onClick={() => setTab("paraphrase")}
              highlight
            />
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex">
          {[
            { icon: "🏠", label: "홈", id: "home" as Tab },
            { icon: "📝", label: "퀴즈", id: "quiz" as Tab },
            { icon: "📖", label: "사전", id: "table" as Tab },
            { icon: "✨", label: "AI", id: "paraphrase" as Tab },
          ].map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                tab === n.id ? "text-[#6c47ff]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-lg">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function GameCard({
  icon, title, desc, color, xpText, onClick,
}: {
  icon: string; title: string; desc: string; color: string; xpText: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${color} text-white rounded-2xl p-5 text-left shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{icon}</span>
            <span className="font-black text-lg">{title}</span>
          </div>
          <p className="text-white/80 text-sm">{desc}</p>
        </div>
        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
          {xpText}
        </span>
      </div>
    </button>
  );
}

function ToolCard({
  icon, title, desc, onClick, highlight,
}: {
  icon: string; title: string; desc: string; onClick: () => void; highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-4 text-left shadow-sm border transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
        highlight
          ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
          : "bg-white border-gray-100"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <p className="font-black text-gray-800 mt-2">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
    </button>
  );
}
