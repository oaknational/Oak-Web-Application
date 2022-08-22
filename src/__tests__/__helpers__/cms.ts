import { PortableTextJSON, SanityImage } from "../../node-lib/cms";

/**
 * Return a representation of a string as sanity's "portable text"
 * for use in mocks
 */
export const portableTextFromString = (text: string): PortableTextJSON => [
  {
    _key: "key0001",
    _type: "block",
    children: [
      {
        _key: "key0002",
        _type: "span",
        marks: [],
        text: text,
      },
    ],
    markDefs: [],
    style: "normal",
  },
];

export const mockImageAsset = (id = "abcdef"): SanityImage => {
  return {
    asset: {
      _id: `image-${id}-300x300-png`,
      url: `https://cdn.sanity.io/images/p/d/${id}-300x300.png`,
    },
  };
};
