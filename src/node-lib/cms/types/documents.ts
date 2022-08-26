import { Document, PortableTextJSON, SanityImage } from "./base";

export type TeamMember = Document & {
  name: string;
};

export type TeamMemberPreview = Pick<TeamMember, "name">;

type BlogWebinarCategory = {
  title: string;
  slug: string;
};

export type Webinar = Document & {
  title: string;
  slug: string;
  date: Date;
  hosts: TeamMember[];
  category: BlogWebinarCategory;
  summaryPortableText: PortableTextJSON;
};

export type WebinarPreview = Pick<
  Webinar,
  "id" | "title" | "slug" | "date" | "category" | "summaryPortableText"
>;

export type BlogPost = Document & {
  title: string;
  slug: string;
  date: Date;
  mainImage: SanityImage;
  author: TeamMember;
  summary: string;
  category: BlogWebinarCategory;
  contentPortableText: PortableTextJSON;
};

export type BlogPostPreview = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "summary"
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
