AI-Generated Playwright Test Generator

This tool automatically generates Playwright end-to-end tests using the OpenAI API.
It analyzes the rendered HTML (or JSX/TSX source) of your Next.js app routes and creates realistic test scripts based on visible fields, labels, and interactions.

project-root/
├── e2e/
│   └── generated/              # AI-generated test files (.spec.ts)
├── src/
│   ├── llm/
│   │   ├── schema.ts           # Zod schema for test plan validation
│   │   └── generate-test-plan.ts  # OpenAI test plan generator
│   ├── writer/
│   │   ├── write-test-file.ts  # Writes test files using Handlebars templates
│   │   └── templates/
│   │       └── playwright.spec.hbs
│   ├── repo-tests.ts           # Entry point to generate tests for all routes
│   └── ...
├── package.json
├── .env                        # Contains your OpenAI API key
└── README.md

⚙️ Prerequisites

Node.js ≥ 18

npm ≥ 9

Access to the OpenAI API (with OPENAI_API_KEY)

Existing Next.js app with .tsx routes (e.g. index.tsx, dashboard.tsx)

npm install openai zod handlebars dotenv
npm install --save-dev typescript ts-node @types/node @types/handlebars
npm install --save-dev @playwright/test

Start your Next.js app (so the generator can access HTML):
npm run dev
npm run repo-tests

The file playwright.spec.hbs defines the test output format:

npx playwright test e2e/generated
