import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const CaseSchema = z.object({
  title: z.string().describe("Короткое название случая, 1-3 слова"),
  complaint: z.string().describe("Главная жалоба одной фразой"),
  summary: z.string().describe("Краткое резюме интервью, 2-3 предложения"),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  recommendations: z.array(z.string()).describe("Бытовые/общие рекомендации до приёма врача"),
  tests: z.array(z.string()).describe("Анализы, которые стоит сдать"),
  specialists: z.array(z.string()).describe("К каким врачам направить"),
});

export const generateIncidentCase = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ transcript: z.string().min(10) }).parse(input)
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      experimental_output: Output.object({ schema: CaseSchema }),
      system:
        "Ты — ИИ-врач Lify. На основе транскрипта интервью с пациентом сформируй структурированную карточку обращения на русском языке. Будь конкретен. Никаких рецептурных препаратов.",
      prompt: `Транскрипт интервью:\n\n${data.transcript}\n\nСформируй карточку обращения.`,
    });
    return experimental_output;
  });

export type IncidentCase = z.infer<typeof CaseSchema>;
