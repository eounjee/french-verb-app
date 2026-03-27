"use client";

import { useState } from "react";
import { VERBS, PRONOUNS, TENSES, type Tense } from "@/lib/verbs";
import SpeakButton from "@/components/SpeakButton";

export default function VerbTable() {
  const [search, setSearch] = useState("");
  const [selectedVerb, setSelectedVerb] = useState(VERBS[0]);
  const [selectedTense, setSelectedTense] = useState<Tense>("présent");

  const filtered = VERBS.filter(
    (v) =>
      v.infinitive.toLowerCase().includes(search.toLowerCase()) ||
      v.meaning.includes(search)
  );

  const groupColor = (g: 1 | 2 | 3) =>
    g === 1 ? "bg-blue-100 text-blue-700" : g === 2 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700";

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="동사 검색 (예: être, 가다)..."
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#6c47ff] text-base"
      />

      {/* Verb list */}
      <div className="flex gap-2 flex-wrap">
        {filtered.map((v) => (
          <button
            key={v.infinitive}
            onClick={() => setSelectedVerb(v)}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedVerb.infinitive === v.infinitive
                ? "bg-[#6c47ff] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-[#6c47ff]"
            }`}
          >
            <span>{v.infinitive}</span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${groupColor(v.group)}`}>{v.group}군</span>
          </button>
        ))}
      </div>

      {/* Selected verb header */}
      <div className="bg-gradient-to-r from-[#6c47ff] to-[#9c6fff] text-white rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-2xl font-black">{selectedVerb.infinitive}</p>
              <p className="text-purple-200 text-sm">{selectedVerb.meaning}</p>
            </div>
            <SpeakButton text={selectedVerb.infinitive} size="md" className="!bg-white/20 !text-white hover:!bg-white/30" />
          </div>
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/20">
            {selectedVerb.group}군 동사
          </span>
        </div>
      </div>

      {/* Tense selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TENSES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTense(t.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all flex-shrink-0 ${
              selectedTense === t.id
                ? "bg-[#6c47ff] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#6c47ff]"
            }`}
          >
            {t.label}
            {t.level === "advanced" && <span className="ml-1 text-xs opacity-70">고급</span>}
          </button>
        ))}
      </div>

      {/* Conjugation table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {PRONOUNS.map((p, i) => (
          <div
            key={p}
            className={`flex items-center px-5 py-4 gap-4 ${i < PRONOUNS.length - 1 ? "border-b border-gray-50" : ""}`}
          >
            <span className="text-gray-400 text-sm w-20 flex-shrink-0">{p}</span>
            <span className="font-black text-lg text-[#1a1a2e] flex-1">
              {selectedVerb.conjugations[selectedTense][p]}
            </span>
            <SpeakButton
              text={`${p} ${selectedVerb.conjugations[selectedTense][p]}`}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
