"use client";

import { useState } from "react";

interface ParaphraseResult {
  original: string;
  correction: string | null;
  correctionNote: string | null;
  tenseVariations: { tense: string; sentence: string; explanation: string }[];
  pronounVariations: { pronoun: string; sentence: string }[];
  naturalExpressions: { expression: string; explanation: string }[];
}

const EXAMPLES = [
  "Je mange une pomme.",
  "Tu parles français.",
  "Nous allons à Paris.",
  "Elle aime la musique.",
  "Il fait son travail.",
];

export default function ParaphraseStudio() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ParaphraseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<string[]>([]);

  const analyze = async (sentence?: string) => {
    const text = sentence ?? input;
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const saveExpression = (expr: string) => {
    setSaved((s) => (s.includes(expr) ? s : [...s, expr]));
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <label className="text-sm font-bold text-gray-500 block mb-2">프랑스어 문장 입력</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: Je mange une pomme."
          rows={3}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6c47ff] resize-none text-base"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setInput(ex); analyze(ex); }}
              className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium hover:bg-purple-100 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => analyze()}
        disabled={!input.trim() || loading}
        className="w-full bg-gradient-to-r from-[#6c47ff] to-[#9c6fff] text-white font-black py-4 rounded-2xl text-lg hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "AI 분석 중..." : "✨ AI 패러프레이징 분석"}
      </button>

      {loading && (
        <div className="text-center py-8 space-y-3">
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-[#6c47ff] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm">Claude AI가 분석하고 있습니다...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-red-400 text-xs mt-1">ANTHROPIC_API_KEY 환경변수가 설정되어 있는지 확인하세요.</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-bounce-in">
          {/* Correction */}
          {result.correction && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-yellow-600 mb-2">✏️ 문법 교정</p>
              <p className="text-yellow-800 font-bold text-lg">{result.correction}</p>
              {result.correctionNote && (
                <p className="text-yellow-600 text-sm mt-1">{result.correctionNote}</p>
              )}
            </div>
          )}

          {/* Tense variations */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50">
              <p className="font-black text-gray-700">⏰ 시제 변환</p>
            </div>
            {result.tenseVariations.map((v, i) => (
              <div key={i} className={`px-5 py-4 ${i < result.tenseVariations.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{v.tense}</span>
                    <p className="font-bold text-gray-900 mt-2">{v.sentence}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{v.explanation}</p>
                  </div>
                  <button
                    onClick={() => saveExpression(v.sentence)}
                    className={`flex-shrink-0 text-lg transition-all ${saved.includes(v.sentence) ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                  >
                    {saved.includes(v.sentence) ? "⭐" : "☆"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pronoun variations */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50">
              <p className="font-black text-gray-700">👥 인칭 변환</p>
            </div>
            <div className="grid grid-cols-1 divide-y divide-gray-50">
              {result.pronounVariations.map((v, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-16 flex-shrink-0">{v.pronoun}</span>
                  <p className="font-medium text-gray-900">{v.sentence}</p>
                  <button
                    onClick={() => saveExpression(v.sentence)}
                    className={`ml-auto flex-shrink-0 text-lg transition-all ${saved.includes(v.sentence) ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                  >
                    {saved.includes(v.sentence) ? "⭐" : "☆"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Natural expressions */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-5">
            <p className="font-black text-purple-700 mb-3">💡 자연스러운 표현</p>
            <div className="space-y-3">
              {result.naturalExpressions.map((e, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900">{e.expression}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{e.explanation}</p>
                    </div>
                    <button
                      onClick={() => saveExpression(e.expression)}
                      className={`flex-shrink-0 text-lg transition-all ${saved.includes(e.expression) ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                    >
                      {saved.includes(e.expression) ? "⭐" : "☆"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved */}
          {saved.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="font-black text-yellow-700 mb-2">⭐ 저장된 표현 ({saved.length})</p>
              <div className="space-y-1">
                {saved.map((s, i) => (
                  <p key={i} className="text-yellow-800 text-sm font-medium">{s}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
