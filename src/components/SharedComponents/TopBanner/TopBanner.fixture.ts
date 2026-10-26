import type { TopBannerProps } from "./TopBanner";

export const topBannerFixture = {
  displayNewTag: true,
  messagePortableText: [
    {
      style: "normal",
      _key: "key0001",
      _type: "block",
      children: [
        {
          _key: "key0002",
          _type: "span",
          marks: [],
          text: "Oak is now used in ",
        },
        {
          _key: "key0003",
          _type: "span",
          marks: ["strong"],
          text: "72%",
        },
        {
          _key: "key0004",
          _type: "span",
          marks: [],
          text: " of schools!",
        },
      ],
      markDefs: [],
    },
  ],
  displayCta: true,
  cta: {
    label: "Explore our impact",
    linkType: "internal",
    external: null,
    internal: "/about-us/oaks-impact",
  },
  backgroundColor: "bg-decorative1-main",
} satisfies TopBannerProps;
