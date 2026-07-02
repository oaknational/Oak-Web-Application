import { defineConfig, devices } from "@playwright/test";

/**
 * BASE_URL is set in CI to the Vercel preview/production deployment URL.
 * Locally, point at your dev server: BASE_URL=http://localhost:3000 pnpm run test:e2e
 */
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./src/tests/e2e",
  outputDir: "./test-results",

  /* Fail fast in CI if a test has a `.only` accidentally left in */
  forbidOnly: !!process.env.CI,

  /* Retry once in CI to reduce noise from transient failures */
  retries: process.env.CI ? 1 : 1,
  timeout: 30_000,

  /* Single worker in CI to avoid overwhelming a preview deployment */
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL,

    /* Pass the Vercel bypass secret as a header so tests reach preview deployments */
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          "x-vercel-protection-bypass":
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        }
      : undefined,

    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
