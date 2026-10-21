import type { TopBannerProps } from "./TopBanner";

export const topBannerFixture: TopBannerProps = {
  messagePortableTextWithPromo: [
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
          marks: ["strong", "promoStamp"],
          text: "72%",
        },
        {
          text: " of schools!",
          _key: "key0004",
          _type: "span",
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
  enabled: true,
  cta: {
    label: "Explore our impact",
    linkType: "internal",
    external: "https://www.google.com/",
    internal: "/about-us/oaks-impact",
  },
  backgroundColour: "bg-decorative1-main",
};
