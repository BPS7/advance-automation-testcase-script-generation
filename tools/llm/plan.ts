import OpenAI from "openai";
import { TestPlanSchema } from "./schema.js";
import "dotenv/config";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateTestPlan(route: string, html: string) {
  const prompt = `
You are a QA engineer specializing in Playwright E2E testing.

Analyze this Next.js page's HTML and propose realistic Playwright tests for functional, visual, and negative paths.

Return JSON matching this schema strictly:
${TestPlanSchema.toString()}

Route: ${route}

HTML snippet:
${html.slice(0, 2000)}

Important: produce actionable Playwright steps such as:
- "await page.fill('input[name=username]', 'admin')"
- "await page.click('button:has-text("Login")')"
- "await expect(page).toHaveURL('/dashboard')"
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  let text = res.choices[0].message?.content ?? "";

  // 🧹 Clean Markdown formatting if present (```json ... ```)
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

   try {
    let parsed = JSON.parse(text);

    // Normalize if it has "tests" array instead of "cases"
    if (parsed.tests && !parsed.cases) {
      parsed = {
        route,
        title: `Generated tests for ${route}`,
        cases: parsed.tests.map((t: any) => ({
          description: t.description ?? t.name ?? "",
          steps: t.steps ?? [],
          expected: "",
        })),
      };
    }

    return TestPlanSchema.parse(parsed);
  } catch (err) {
    console.error("❌ Failed to parse LLM JSON output:\n", text);
    throw err;
  }

}
