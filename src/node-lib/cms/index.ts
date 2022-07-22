import { z } from "zod";

import getSanityClient from "./sanity-client";

// @TODO: Absolute hack to allow `any` usage. Replace w/ better type
const any = z.any();
type PortableTextJSON = z.infer<typeof any>;

export type Document = {
  id: string;
};

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

export type Params = {
  isDraft?: boolean;
};

export type ListParams = Params & {
  limit?: number;
};

export interface CMSClient {
  (): {
    webinarBySlug(slug: string, params?: Params): Promise<Webinar>;
    webinars(params?: ListParams): Promise<WebinarPreview[]>;
  };
}

const CMSClient = getSanityClient();
export default CMSClient;
