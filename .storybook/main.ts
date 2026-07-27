// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  env: (config) => {
    const nextPublicEnv = Object.fromEntries(
      Object.entries(process.env).filter(([key]) =>
        key.startsWith("NEXT_PUBLIC_"),
      ),
    );
    return {
      // As of Storybook v9.1.17 - 9.1.20 these env vars are exposed in source files, DO NOT use sensitive data/API keys
      ...config,
      ...nextPublicEnv,
    };
  },

  stories: [
    "../src/components/introduction.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "storybook-css-modules-preset",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],

  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        lazyCompilation: !process.env.STORYBOOK_TEST,
      },
    },
  },

  core: {
    disableWhatsNewNotifications: true,
  },

  staticDirs: ["../public"],

  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@clerk/nextjs": path.resolve(
        __dirname,
        "../src/storybook-mocks/clerk.tsx",
      ),
    };

    config.module.rules = [
      ...config.module.rules.map((rule) => {
        if (rule.test instanceof RegExp) {
          if (/svg/.test(rule.test.source)) {
            // Silence the Storybook loaders for SVG files
            return { ...rule, exclude: /\.svg$/i };
          }
        } else if (typeof rule.test === "string") {
          if (/svg/.test(rule.test)) {
            // Silence the Storybook loaders for SVG files
            return { ...rule, exclude: /\.svg$/i };
          }
        } else {
          console.warn("Confusing Storybook rule");
        }

        return rule;
      }),
      // Add your custom SVG loader
      {
        test: /\.svg$/i,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ];

    return config;
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
