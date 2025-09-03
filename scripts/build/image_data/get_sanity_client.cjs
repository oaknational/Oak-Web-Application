const nextenv = require("@next/env");
nextenv.loadEnvConfig(".", process.env.NODE_ENV === "development");
const { createClient } = require("@sanity/client");

function getSanityClient() {
  const sanityConfig = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_AUTH_SECRET,
    // Don't use CDN for these infrequent (build time) queries
    useCdn: false,
    apiVersion: "2023-02-27",
  };

  const envPresent = Object.values(sanityConfig).reduce(
    (acc, cur) => acc && typeof cur !== "undefined",
    true,
  );

  if (!envPresent) {
    throw new Error(
      `Required env values not present. Values required for:
        NEXT_PUBLIC_SANITY_PROJECT_ID
        NEXT_PUBLIC_SANITY_DATASET
        SANITY_AUTH_SECRET
        `,
    );
  }
  const client = createClient(sanityConfig);

  return client;
}

exports.getSanityClient = getSanityClient;
