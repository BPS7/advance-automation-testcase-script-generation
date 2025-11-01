import OpenAI from "openai";
import { TestPlanSchema } from "./schema.js";
import "dotenv/config";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateTestPlan(route: string, html: string) {
 const prompt = `
You are an expert QA engineer and Playwright specialist.

TASK
Generate a structured **JSON** plan of Playwright tests for the Next.js page at route: "${route}".
You are given the **actual rendered HTML** (server-rendered + any static client markup). 
ONLY derive selectors and assertions from what exists in the HTML.

OUTPUT (STRICT JSON ONLY — no prose, no markdown, no comments)
{
  "tests": [
    {
      "name": "string",
      "description": "string",
      "steps": [
        "Playwright commands as strings, each a single line of valid TypeScript using the Playwright Test API"
      ]
    }
  ]
}

CONSTRAINTS
- Output MUST be valid JSON. Do not wrap in \`\`\`, do not add commentary.
- If the HTML doesn't support a test idea (selector not present, text not visible), DO NOT invent it.
- If nothing testable exists, return { "tests": [] }.
- Prefer resilient selectors in this exact order:
  1) getByRole(..., { name: ... }) with accessible names seen in the HTML
  2) getByLabel(...)
  3) getByPlaceholder(...)
  4) getByText(...) (only for stable, unique text)
  5) locator('[data-testid="..."]') if present
  6) LAST resort: css/xpath (only if unique and stable)
- Always guard for navigation and async UI:
  - Await navigation when clicking links that change pages.
  - Wait for the target element to be visible before interacting.
- Keep steps minimal and deterministic. Avoid brittle chains and timeouts.
- Use absolute paths with baseURL via page.goto("${route}") or a route-relative path (e.g. "/login").

TEST COVERAGE
- Generate 2–4 tests total:
  - A happy-path smoke (page renders, key UI present).
  - Form positive case(s) (if a form exists).
  - Form negative validation (missing/invalid input) when inputs & buttons exist.
  - Optional: navigation test if clearly linked in the HTML (e.g., link to "Forgot password").
- For forms:
  - Fill only inputs that are present; skip unknown fields.
  - Use realistic sample values derived from placeholders, labels, or type hints.
  - Assert visible validation messages or state changes that are in the HTML.
- Assertions:
  - Use expect(page).toHaveURL(...) after obvious navigations.
  - Use expect(locator).toBeVisible() / toContainText(...) for confirmations or errors that appear in the HTML.

STEP SYNTAX (examples to follow in your own steps)
- "await page.goto('/login')"
- "await page.getByPlaceholder('Email').fill('user@example.com')"
- "await page.getByRole('button', { name: 'Sign in' }).click()"
- "await expect(page.getByText('Invalid password')).toBeVisible()"
- "await expect(page).toHaveURL('/dashboard')"

INPUT HTML (use ONLY what is present below)
${html}
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
