import { AboutPage, PlanningPage, CurriculumPage } from "./pages";
import {
  BlogPost,
  BlogPostPreview,
  LandingPage,
  LandingPagePreview,
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
    webinarBySlug(slug: string, params?: Params): Promise<Webinar | null>;
    webinars(params?: ListParams): Promise<WebinarPreview[] | null>;
    blogPosts(params?: ListParams): Promise<BlogPostPreview[] | null>;
    blogPostBySlug(slug: string, params?: Params): Promise<BlogPost | null>;
    planningPage(params?: Params): Promise<PlanningPage | null>;
    aboutPage(params?: Params): Promise<AboutPage | null>;
    curriculumPage(params?: Params): Promise<CurriculumPage | null>;
    policyPageBySlug(slug: string, params?: Params): Promise<PolicyPage | null>;
    policyPages(params?: ListParams): Promise<PolicyPagePreview[] | null>;
    landingPages(params?: ListParams): Promise<LandingPagePreview[] | null>;
    landingPageBySlug(
      slug: string,
      params?: Params
    ): Promise<LandingPage | null>;
  };
}
