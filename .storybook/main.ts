import path from "path";

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
      NEXT_PUBLIC_CLIENT_APP_BASE_URL: "http://localhost:3000",
      NEXT_PUBLIC_APP_VERSION: "123",
      NEXT_PUBLIC_RELEASE_STAGE: "test",
      NEXT_PUBLIC_SEARCH_API_URL: "NEXT_PUBLIC_SEARCH_API_URL",
      NEXT_PUBLIC_GRAPHQL_API_URL: "NEXT_PUBLIC_GRAPHQL_API_URL",
      NEXT_PUBLIC_BUGSNAG_API_KEY: "NEXT_PUBLIC_BUGSNAG_API_KEY",
      NEXT_PUBLIC_HUBSPOT_PORTAL_ID: "NEXT_PUBLIC_HUBSPOT_PORTAL_ID",
      NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID:
        "NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID",
      NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID:
        "NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID",
      NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN: "NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN",
      NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL:
        "NEXT_PUBLIC_HUBSPOT_FORM_SUBMISSION_URL",
      NEXT_PUBLIC_POSTHOG_API_HOST: "NEXT_PUBLIC_POSTHOG_API_HOST",
      NEXT_PUBLIC_POSTHOG_API_KEY: "NEXT_PUBLIC_POSTHOG_API_KEY",
      NEXT_PUBLIC_GLEAP_API_KEY: "NEXT_PUBLIC_GLEAP_API_KEY",
      NEXT_PUBLIC_GLEAP_API_URL: "NEXT_PUBLIC_GLEAP_API_URL",
      NEXT_PUBLIC_GLEAP_FRAME_URL: "NEXT_PUBLIC_GLEAP_FRAME_URL",
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
