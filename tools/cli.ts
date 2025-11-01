#!/usr/bin/env ts-node
import fetch from "node-fetch";
import { generateTestPlan } from "./llm/plan.js";
import { writeTestFile } from "./generate/write-tests.js";

async function run() {
  console.log("🔍 Generating tests for login app...");

  const baseUrl = "http://localhost:3000"; // your running Next.js dev server
  const routes = ["/", "/dashboard"]; // pages to generate tests for

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    try {
      console.log(`🌐 Fetching ${url}...`);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`⚠️ Could not fetch HTML for ${route}: ${res.statusText}`);
        continue;
      }

      const html = await res.text();
      const plan = await generateTestPlan(route, html);
      if (plan) {
        writeTestFile(plan);
        console.log(`✅ Test plan generated for ${route}`);
      }
    } catch (err) {
      console.warn(`⚠️ Failed to load ${route}:`, err);
    }
  }
}

run();
