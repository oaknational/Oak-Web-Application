import type { OaksImpactStatsProps } from "./index";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const fixtureData: OaksImpactStatsProps = {
  textBlock: {
    title: "Oak is now used in 72% of schools",
    bodyPortableText: portableTextFromString(
      "Our latest independent evaluation shows just how valuable this support has already become for teachers and school leaders.",
    ),
    cta: {
      label: "Read the 24/25 impact report",
      external: "#",
      linkType: "external",
    },
  },
  stats: [
    {
      icon: {
        altText: "",
        darkModeImage: {
          asset: {
            _id: "image-84ac53e9bd17c0782b0455d519f302467744a2ce-120x120-svg",
            url: "https://cdn.sanity.io/images/cuvjke51/production/84ac53e9bd17c0782b0455d519f302467744a2ce-120x120.svg",
          },
        },
        asset: {
          _id: "image-84ac53e9bd17c0782b0455d519f302467744a2ce-120x120-svg",
          url: "https://cdn.sanity.io/images/cuvjke51/production/84ac53e9bd17c0782b0455d519f302467744a2ce-120x120.svg",
        },
      },
      heading: "200,000",
      textRaw: portableTextFromString(
        "Between January and July 2025 alone, almost 200,000 teachers used Oak, with over 54,000 using it every week – a 53% rise on the previous year.",
      ),
    },
    {
      icon: {
        altText: "",
        darkModeImage: {
          asset: {
            _id: "image-84ac53e9bd17c0782b0455d519f302467744a2ce-120x120-svg",
            url: "https://cdn.sanity.io/images/cuvjke51/production/84ac53e9bd17c0782b0455d519f302467744a2ce-120x120.svg",
          },
        },
        asset: {
          _id: "image-84ac53e9bd17c0782b0455d519f302467744a2ce-120x120-svg",
          url: "https://cdn.sanity.io/images/cuvjke51/production/84ac53e9bd17c0782b0455d519f302467744a2ce-120x120.svg",
        },
      },
      heading: "85%",
      textRaw: portableTextFromString(
        "85% of Oak users say it has a positive impact on their workload. Two thirds (67%) report an overall workload reduction, saving a median four hours per week.",
      ),
    },
    {
      icon: {
        altText: "",
        darkModeImage: {
          asset: {
            _id: "image-84ac53e9bd17c0782b0455d519f302467744a2ce-120x120-svg",
            url: "https://cdn.sanity.io/images/cuvjke51/production/84ac53e9bd17c0782b0455d519f302467744a2ce-120x120.svg",
          },
        },
        asset: {
          _id: "image-84ac53e9bd17c0782b0455d519f302467744a2ce-120x120-svg",
          url: "https://cdn.sanity.io/images/cuvjke51/production/84ac53e9bd17c0782b0455d519f302467744a2ce-120x120.svg",
        },
      },
      heading: "92%",
      textRaw: portableTextFromString(
        "92% of Oak users see themselves staying in a teaching role in the next two years compared to 77% of non-users, indicating higher retention could be linked to Oak usage.",
      ),
    },
  ],
};
