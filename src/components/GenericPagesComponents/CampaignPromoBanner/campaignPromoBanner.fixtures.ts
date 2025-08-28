import { PortableTextBlock } from "@portabletext/react";

export const headingPortableText: PortableTextBlock[] = [
  {
    _type: "block",
    style: "heading2",
    _key: "banner-heading-key",
    markDefs: [],
    children: [
      {
        marks: [],
        text: "Transform Your Teaching with Oak Resources",
        _key: "banner-heading-text",
        _type: "span",
      },
    ],
  },
];

export const subheadingPortableText: PortableTextBlock[] = [
  {
    _type: "block",
    style: "heading3",
    _key: "banner-subheading-key",
    markDefs: [],
    children: [
      {
        marks: [],
        text: "Expert-made resources for every lesson",
        _key: "banner-subheading-text",
        _type: "span",
      },
    ],
  },
];

export const bodyPortableText: PortableTextBlock[] = [
  {
    children: [
      {
        text: "Discover comprehensive curriculum resources designed by education experts to support your teaching and save you time. From lesson plans to interactive activities, we've got everything you need for engaging classroom experiences.",
        _key: "banner-body-text",
        _type: "span",
        marks: [],
      },
    ],
    _type: "block",
    style: "normal",
    _key: "banner-body-key",
    markDefs: [],
  },
];

export const bodyPortableTextWithStyling: PortableTextBlock[] = [
  {
    _key: "styled-body-1",
    markDefs: [],
    children: [
      {
        _key: "styled-span-1",
        _type: "span",
        marks: ["strong"],
        text: "Expert-designed",
      },
      {
        _type: "span",
        marks: [],
        text: " resources that make teaching easier and more effective.",
        _key: "styled-span-2",
      },
    ],
    _type: "block",
    style: "normal",
  },
  {
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: "With complete curriculum coverage across all subjects, Oak provides the planning power behind great classroom teaching.",
        _key: "styled-span-3",
      },
    ],
    _type: "block",
    style: "normal",
    _key: "styled-body-2",
  },
];

export const buttonCtaText = "Explore Resources";
