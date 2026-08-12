import { defineConfig, devices } from "@playwright/test";

/**
 * In CI, BASE_URL is set to the Vercel preview/production deployment URL.
 * Locally, BASE_URL defaults to http://localhost:3000 and Playwright starts
https://oak-web-application-website-git-test-lesq-2113playwright-setup.vercel.thenational.academy/
 */
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const shouldStartWebServer = !process.env.CI && !process.env.BASE_URL;

const visualTestMatch = /visual\/.*\.spec\.ts/;

export default defineConfig({
  testDir: "./src/tests/e2e",
  outputDir: "./test-results",

  /* Fail fast in CI if a test has a `.only` accidentally left in */
  forbidOnly: !!process.env.CI,

  /* Retry once in CI to reduce noise from transient failures */
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,

  /* Single worker in CI to avoid overwhelming a preview deployment */
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [
        ["github"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
      ]
    : [
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

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      stylePath: "./src/tests/visual/screenshot.css",
    },
  },

  projects: [
    {
      name: "chromium",
      testIgnore: visualTestMatch,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual-desktop",
      testMatch: visualTestMatch,
      timeout: 90_000,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual-mobile",
      testMatch: visualTestMatch,
      timeout: 90_000,
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "visual-tablet",
      testMatch: visualTestMatch,
      timeout: 90_000,
      use: { ...devices["iPad Pro 11"] },
    },
  ],

  /* Start the local dev server only when running locally with the default
     BASE_URL. If BASE_URL is explicitly set, run against that URL instead. */
  webServer: shouldStartWebServer
    ? {
        command: "pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
});
