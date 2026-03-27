import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다. Vercel 환경변수를 확인하세요." }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { sentence } = await req.json();

    if (!sentence || typeof sentence !== "string") {
      return NextResponse.json({ error: "문장을 입력해주세요." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `당신은 프랑스어 선생님입니다. 다음 프랑스어 문장을 분석하고 다양한 방식으로 패러프레이징해주세요.

입력 문장: "${sentence}"

다음 JSON 형식으로 정확히 응답해주세요 (JSON만, 다른 텍스트 없이):
{
  "original": "원래 문장",
  "correction": "문법 오류가 있다면 수정된 문장, 없으면 null",
  "correctionNote": "수정 이유 (한국어), 없으면 null",
  "tenseVariations": [
    {"tense": "시제 이름(한국어)", "sentence": "변환된 프랑스어 문장", "explanation": "한국어 설명"},
    {"tense": "시제 이름(한국어)", "sentence": "변환된 프랑스어 문장", "explanation": "한국어 설명"},
    {"tense": "시제 이름(한국어)", "sentence": "변환된 프랑스어 문장", "explanation": "한국어 설명"}
  ],
  "pronounVariations": [
    {"pronoun": "인칭대명사", "sentence": "변환된 프랑스어 문장"},
    {"pronoun": "인칭대명사", "sentence": "변환된 프랑스어 문장"},
    {"pronoun": "인칭대명사", "sentence": "변환된 프랑스어 문장"}
  ],
  "naturalExpressions": [
    {"expression": "자연스러운 표현", "explanation": "한국어 설명"},
    {"expression": "자연스러운 표현", "explanation": "한국어 설명"}
  ]
}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI 응답 파싱 오류" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Paraphrase error:", message);
    return NextResponse.json({ error: `서버 오류: ${message}` }, { status: 500 });
  }
}
