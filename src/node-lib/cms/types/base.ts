import { z } from "zod";

export type Document = {
  id: string;
};

// @TODO: Absolute hack to allow `any` usage. Replace w/ better type
const any = z.any();
export type PortableTextJSON = z.infer<typeof any>;

export type SanityImage = {
  asset?: {
    _id: string; // _id required by next-sanity-image
    url: string;
  };
};

export type Video = {
  title: string;
  video: {
    asset: {
      assetId: string;
      playbackId: string;
    };
  };
};

export type CTA = {
  label: string;
} & (
  | {
      linkType: "internal";
      internal: { contentType: string; slug?: string };
    }
  | { linkType: "external"; external: string }
);

export type Card = {
  title: string;
  image?: SanityImage | null;
  bodyPortableText?: PortableTextJSON;
  cta?: CTA | null;
};

export type TextBlock = {
  title: string;
  bodyPortableText: PortableTextJSON;
  cta?: CTA | null;
};

export type TextAndMedia = {
  title: string;
  bodyPortableText: PortableTextJSON;
  alignMedia: "left" | "right";
  cta?: CTA | null;
} & (
  | {
      mediaType: "image";
      image: SanityImage;
    }
  | {
      mediaType: "video";
      video: Video;
    }
);
