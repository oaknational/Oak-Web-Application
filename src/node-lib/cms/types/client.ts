import { Webinar, WebinarPreview } from "./documents";

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
