import { Image } from "../../sanity-graphql/generated/sdk";

import { Document, PortableTextJSON } from "./base";

export type TeamMember = Document & {
  name: string;
};

export type TeamMemberPreview = Pick<TeamMember, "name">;

export type Webinar = Document & {
  title: string;
  slug: string;
  date: Date;
  hosts: TeamMember[];
  summaryPortableText: PortableTextJSON;
};

export type WebinarPreview = Pick<
  Webinar,
  "id" | "title" | "slug" | "summaryPortableText"
>;

export type BlogPost = Document & {
  title: string;
  slug: string;
  date: Date;
  mainImage: Image;
  author: TeamMember;
  contentPortableText: PortableTextJSON;
  category: {
    title: string;
    slug: {
      current: string;
    };
  };
};

export type BlogPostPreview = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "contentPortableText"
  | "author"
  | "category"
  | "date"
  | "mainImage"
>;

export type Attachment = {
  title: string;
  file: {
    asset: {
      extension: string;
      size: number;
      url: string;
    };
  };
};

export type PolicyPage = Document & {
  title: string;
  slug: string;
  lastUpdatedAt: Date;
  bodyPortableText: PortableTextJSON;
};

export type PolicyPagePreview = Pick<PolicyPage, "title" | "slug">;
