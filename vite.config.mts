import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { config } from "dotenv";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    env: {
      ...config({ path: "./.env.test" }).parsed,
    },
    include: [
      "./src/components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    setupFiles: ["./vite.setup.ts"],
    pool: "threads",
    poolOptions: {
      threads: {
        minThreads: 8,
        maxThreads: 10,
      },
    },
    cache: {
      dir: ".vitest/cache",
    },
    exclude: [
      "**/*.fixtures.*",
      "src/__tests__/__helpers__/*",
      ".storybook/storybook.*.test.js",
      ".netlify/*",
      ".yalc/*",
    ],
    benchmark: {
      outputJson: "./test-results/benchmark.json",
    },
    sequence: {
      shuffle: false,
      seed: Date.now(),
    },
  },
});
