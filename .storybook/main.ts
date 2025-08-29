export default {
  env: (config) => ({
    ...config,
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
    NEXT_PUBLIC_POSTHOG_API_HOST: "NEXT_PUBLIC_POSTHOG_API_HOST",
    NEXT_PUBLIC_POSTHOG_API_KEY: "NEXT_PUBLIC_POSTHOG_API_KEY",
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_ASSET_CDN_HOST:
      process.env.NEXT_PUBLIC_SANITY_ASSET_CDN_HOST,
    NEXT_PUBLIC_GLEAP_API_KEY: "NEXT_PUBLIC_GLEAP_API_KEY",
    NEXT_PUBLIC_GLEAP_API_URL: "NEXT_PUBLIC_GLEAP_API_URL",
    NEXT_PUBLIC_GLEAP_FRAME_URL: "NEXT_PUBLIC_GLEAP_FRAME_URL",
    NEXT_PUBLIC_OAK_ASSETS_HOST: process.env.NEXT_PUBLIC_OAK_ASSETS_HOST,
    NEXT_PUBLIC_OAK_ASSETS_PATH: process.env.NEXT_PUBLIC_OAK_ASSETS_PATH,
  }),

  stories: [
    "../src/components/introduction.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-css-modules-preset",
    "@storybook/addon-storysource",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],

  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        lazyCompilation: true,
      },
    },
  },

  core: {
    disableWhatsNewNotifications: true,
  },

  staticDirs: ["../public"],

  webpackFinal: async (config) => {
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
    ];
    // Add webpack plugin to handle node: scheme imports
    const webpack = require("webpack");
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        const module = resource.request.replace(/^node:/, "");
        switch (module) {
          case "crypto":
          case "fs":
          case "path":
          case "path/posix":
          case "readline":
            resource.request = "util"; // Replace with a safe browser module
            break;
          default:
            resource.request = "util";
        }
      }),
    );

    return config;
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
