import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Ты — внимательный ИИ-врач первичного приёма платформы Lify. Твоя задача — провести структурированное интервью с пациентом, чтобы понять, что произошло, и подготовить материал для создания карточки обращения.

Стиль:
— Тёплый, ясный, без медицинского жаргона.
— Один короткий вопрос за раз, иногда два связанных.
— Сначала уточни главную жалобу, затем по схеме OPQRST: с чего началось, характер, локализация, интенсивность (0–10), длительность, что усиливает/облегчает, сопутствующие симптомы.
— Спроси про хронические заболевания, аллергии, текущие препараты, было ли подобное раньше.
— Если есть красные флаги (боль в груди, одышка, нарушение сознания, кровотечение, температура >39, онемение конечностей и т.п.) — немедленно посоветуй вызвать 112/103 и пометь срочность как "критично".
— Веди интервью 6–10 сообщений. Когда информации достаточно — напиши короткое резюме и фразу: "Готов создать карточку обращения — нажмите кнопку «Создать карточку» ниже."

Никогда не ставь окончательный диагноз. Не выписывай рецептурные препараты. Все рекомендации — предварительные, для уточнения с врачом.`;

export const Route = createFileRoute("/api/incident-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("Messages required", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
