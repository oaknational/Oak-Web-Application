import { PortableTextJSON, SanityImage, Seo, Video } from "../../node-lib/cms";

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

export const createPortableListItem = (text: string): PortableTextJSON => {
  return {
    listItem: "bullet",
    style: "normal",
    children: [{ text, _type: "span" }],
    _type: "block",
  };
};

export const mockImageAsset = (id = "abcdef"): SanityImage => {
  return {
    asset: {
      _id: `image-${id}-300x300-png`,
      url: `https://cdn.sanity.io/images/p/d/${id}-300x300.png`,
    },
  };
};

export const mockVideoAsset = (): Video => {
  return {
    title: "video title",
    video: {
      asset: {
        assetId: "1234",
        playbackId: "5678",
        thumbTime: 1,
      },
    },
  };
};

export const mockSeo = (): Seo => {
  return {
    title: "title",
    description: "description",
    canonicalURL: "/",
  };
};
