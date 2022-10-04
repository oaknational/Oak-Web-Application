import {
  Document,
  PortableTextJSON,
  Quote,
  SanityImage,
  Seo,
  TextAndMedia,
  TextBlock,
} from "./base";

export type TeamMember = Document & {
  name: string;
  image?: SanityImage | null;
  role?: string | null;
};

export type TeamMemberPreview = Pick<TeamMember, "name" | "image" | "role">;

export type BlogWebinarCategory = {
  title: string;
  slug: string;
};

export type Webinar = Document & {
  title: string;
  slug: string;
  date: Date;
  hosts?: TeamMember[];
  category: BlogWebinarCategory;
  summaryPortableText: PortableTextJSON;
  seo?: Seo | null;
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
  seo?: Seo | null;
};

export type BlogPostPreview = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "summary"
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
  seo?: Seo | null;
};

export type PolicyPagePreview = Pick<PolicyPage, "title" | "slug">;

type LandingContentType =
  | { type: "Quote"; quote: Quote }
  | { type: "textBlock"; textBlock: TextBlock }
  | { type: "textAndMedia"; textAndMedia: TextAndMedia };

export type LandingPage = Document & {
  slug: string;
  title: string;
  heading?: string;
  content: LandingContentType[];
  seo?: Seo | null;
};

export type LandingPagePreview = Pick<LandingPage, "slug">;
