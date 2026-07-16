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
            _id: "test-dark",
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1749031463/icons/clipboard_yll2yj.svg",
          },
        },
        asset: {
          _id: "test",
          url: "https://res.cloudinary.com/oak-web-application/image/upload/v1749031463/icons/clipboard_yll2yj.svg",
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
            _id: "test-dark",
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1749031463/icons/clipboard_yll2yj.svg",
          },
        },
        asset: {
          _id: "test",
          url: "https://res.cloudinary.com/oak-web-application/image/upload/v1749031463/icons/clipboard_yll2yj.svg",
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
            _id: "test-dark",
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1749031463/icons/clipboard_yll2yj.svg",
          },
        },
        asset: {
          _id: "test",
          url: "https://res.cloudinary.com/oak-web-application/image/upload/v1749031463/icons/clipboard_yll2yj.svg",
        },
      },
      heading: "92%",
      textRaw: portableTextFromString(
        "92% of Oak users see themselves staying in a teaching role in the next two years compared to 77% of non-users, indicating higher retention could be linked to Oak usage.",
      ),
    },
  ],
};
