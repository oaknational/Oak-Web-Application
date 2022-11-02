import {
  PortableTextJSON,
  Image,
  Seo,
  Video,
} from "../../common-lib/cms-types";

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

export const mockImageAsset = (id = "abcdef"): Image => {
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

export const mockSeo = (seo?: Partial<Seo>): Seo => {
  return {
    title: "title",
    description: "description",
    canonicalURL: "/",
    ...seo,
  };
};

// This will be SEO results based on the app processing the result of mockSeo()
export const mockSeoResult = {
  title: "title | Oak National Academy",
  description: "description",
  ogTitle: "title | Oak National Academy",
  ogDescription: "description",
  ogUrl: "https://www.thenational.academy",
  ogImage:
    "https://www.thenational.academy/images/sharing/default-social-sharing-2022.png?2022",
  ogSiteName: "Oak National Academy",
};
