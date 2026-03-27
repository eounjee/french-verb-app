import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Level = "A1" | "A2" | "B1" | "B2+";

export const LEVEL_CONFIG: Record<Level, { label: string; desc: string; tenseCount: number; emoji: string }> = {
  A1: { label: "A1 입문", desc: "현재시제만", tenseCount: 1, emoji: "🌱" },
  A2: { label: "A2 초급", desc: "현재·복합과거·단순미래", tenseCount: 3, emoji: "🌿" },
  B1: { label: "B1 중급", desc: "기본 4가지 시제", tenseCount: 4, emoji: "🌳" },
  "B2+": { label: "B2+ 고급", desc: "접속법·조건법 포함 전체", tenseCount: 6, emoji: "🏆" },
};

// tenseCount maps to TENSES array index slice (TENSES order: présent, passé composé, futur, imparfait, conditionnel, subjonctif)
// A1: [présent] A2: [présent, passé composé, futur] B1: all 4 basic B2+: all 6

interface Stats {
  totalAnswered: number;
  totalCorrect: number;
  xp: number;
  streak: number;
  lastPlayedDate: string;
  level: Level;
  verbStats: Record<string, { correct: number; total: number }>;
}

interface Store extends Stats {
  addXP: (amount: number) => void;
  recordAnswer: (verbInfinitive: string, correct: boolean) => void;
  checkAndUpdateStreak: () => void;
  setLevel: (level: Level) => void;
}

const today = () => new Date().toISOString().split("T")[0];

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      totalAnswered: 0,
      totalCorrect: 0,
      xp: 0,
      streak: 0,
      lastPlayedDate: "",
      level: "A1",
      verbStats: {},

      addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
      setLevel: (level) => set({ level }),

      recordAnswer: (verbInfinitive, correct) => {
        const prev = get().verbStats[verbInfinitive] || { correct: 0, total: 0 };
        set((s) => ({
          totalAnswered: s.totalAnswered + 1,
          totalCorrect: s.totalCorrect + (correct ? 1 : 0),
          xp: s.xp + (correct ? 10 : 0),
          verbStats: {
            ...s.verbStats,
            [verbInfinitive]: {
              correct: prev.correct + (correct ? 1 : 0),
              total: prev.total + 1,
            },
          },
        }));
      },

      checkAndUpdateStreak: () => {
        const todayStr = today();
        const last = get().lastPlayedDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (last === todayStr) return;
        if (last === yesterdayStr) {
          set((s) => ({ streak: s.streak + 1, lastPlayedDate: todayStr }));
        } else {
          set({ streak: 1, lastPlayedDate: todayStr });
        }
      },
    }),
    { name: "french-verb-store" }
  )
);
