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

export type Attachment = {
  title: string;
  file: {
    asset: {
      extension: string;
      size: number;
    };
  };
};
