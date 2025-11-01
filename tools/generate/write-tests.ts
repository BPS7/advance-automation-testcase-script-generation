import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import { TestPlan } from "../llm/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeTestFile(plan: TestPlan) {
  const templatePath = path.join(__dirname, "templates", "playwright.spec.hbs");
  const source = fs.readFileSync(templatePath, "utf8");
  const template = Handlebars.compile(source);

  const output = template(plan);
  const dir = path.join(process.cwd(), "e2e", "generated");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const file = path.join(dir, `${plan.route.replace(/\//g, "_")}.spec.ts`);
  fs.writeFileSync(file, output);
  console.log(`✅ Wrote ${file}`);
}
