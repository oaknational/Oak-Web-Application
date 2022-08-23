import { AboutPage, PlanningPage, CurriculumPage } from "./pages";
import {
  BlogPost,
  BlogPostPreview,
  PolicyPage,
  PolicyPagePreview,
  Webinar,
  WebinarPreview,
} from "./documents";

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
    blogPosts(params?: ListParams): Promise<BlogPostPreview[]>;
    blogPostBySlug(slug: string, params?: Params): Promise<BlogPost>;
    planningPage(params?: Params): Promise<PlanningPage>;
    aboutPage(params?: Params): Promise<AboutPage>;
    curriculumPage(params?: Params): Promise<CurriculumPage>;
    policyPageBySlug(slug: string, params?: Params): Promise<PolicyPage>;
    policyPages(params?: ListParams): Promise<PolicyPagePreview[]>;
  };
}
