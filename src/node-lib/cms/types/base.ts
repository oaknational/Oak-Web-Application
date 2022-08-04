import { z } from "zod";

export type Document = {
  id: string;
};

// @TODO: Absolute hack to allow `any` usage. Replace w/ better type
const any = z.any();
export type PortableTextJSON = z.infer<typeof any>;

export type SanityImage = {
  asset: {
    _id: string; // _id required by next-sanity-image
    url: string;
  };
};

export type Card = {
  title: string;
  image?: string;
  bodyPortableText?: PortableTextJSON;
};

export type CTA = {
  label: string;
};


export type TextAndMedia = {
  title: string;
  bodyPortableText: PortableTextJSON;
  alignMedia: "left" | "right";
  mediaType: "image" | "video";
  image: SanityImage;
};
