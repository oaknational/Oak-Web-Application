import { Webinar, WebinarPreview } from "./documents";
import { PlanningPage, SupportPage, AboutPage } from "./pages";

export type Params = {
  previewMode?: boolean;
};

export type ListParams = Params & {
  limit?: number;
};

export interface CMSClient {
  (): {
    webinarBySlug(slug: string, params?: Params): Promise<Webinar>;
    webinars(params?: ListParams): Promise<WebinarPreview[]>;
    planningPage(params?: Params): Promise<PlanningPage>;
    supportPage(params?: Params): Promise<SupportPage>;
    aboutPage(params?: Params): Promise<AboutPage>;
  };
}
