"use client";

import { useSpeech } from "@/lib/useSpeech";

interface Props {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function SpeakButton({ text, size = "md", className = "" }: Props) {
  const { speak, speaking, supported } = useSpeech();

  if (!supported) return null;

  const sizeClass = size === "sm" ? "text-base p-1.5" : size === "lg" ? "text-2xl p-3" : "text-lg p-2";

  return (
    <button
      onClick={() => speak(text)}
      title={`"${text}" 발음 듣기`}
      className={`rounded-full transition-all ${sizeClass} ${
        speaking
          ? "bg-purple-100 text-[#6c47ff] animate-pulse"
          : "bg-gray-100 text-gray-500 hover:bg-purple-100 hover:text-[#6c47ff]"
      } ${className}`}
    >
      {speaking ? "🔊" : "🔈"}
    </button>
  );
}
