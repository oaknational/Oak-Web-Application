import { PortableTextBlock } from "@portabletext/react";

export const headingPortableText = (
  text: string = "Transform Your Teaching with Oak Resources",
): PortableTextBlock[] => [
  {
    _type: "block",
    style: "heading2",
    _key: "banner-heading-key",
    markDefs: [],
    children: [
      {
        marks: [],
        text,
        _key: "banner-heading-text",
        _type: "span",
      },
    ],
  },
];

export const subheadingPortableText = (
  text: string = "Expert-made resources for every lesson",
): PortableTextBlock[] => [
  {
    _type: "block",
    style: "heading3",
    _key: "banner-subheading-key",
    markDefs: [],
    children: [
      {
        marks: [],
        text,
        _key: "banner-subheading-text",
        _type: "span",
      },
    ],
  },
];

export const bodyPortableText = (
  text: string = "Discover comprehensive curriculum resources designed by education experts to support your teaching and save you time. From lesson plans to interactive activities, we've got everything you need for engaging classroom experiences.",
): PortableTextBlock[] => [
  {
    children: [
      {
        text,
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

export const bodyPortableTextWithStyling = (
  styledText1: string = "Expert-designed",
  styledText2: string = " resources that make teaching easier and more effective.",
  styledText3: string = "With complete curriculum coverage across all subjects, Oak provides the planning power behind great classroom teaching.",
): PortableTextBlock[] => [
  {
    _key: "styled-body-1",
    markDefs: [],
    children: [
      {
        _key: "styled-span-1",
        _type: "span",
        marks: ["strong"],
        text: styledText1,
      },
      {
        _type: "span",
        marks: [],
        text: styledText2,
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
        text: styledText3,
        _key: "styled-span-3",
      },
    ],
    _type: "block",
    style: "normal",
    _key: "styled-body-2",
  },
];
