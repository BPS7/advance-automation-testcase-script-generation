import { z } from "zod";

export const TestCaseSchema = z.object({
  description: z.string().optional(),
  steps: z.array(z.string()),
  expected: z.string().optional(), // 👈 this line fixes your error
});


export const TestPlanSchema = z.object({
  route: z.string(),
  title: z.string(),
  cases: z.array(TestCaseSchema),
});

export type TestPlan = z.infer<typeof TestPlanSchema>;
