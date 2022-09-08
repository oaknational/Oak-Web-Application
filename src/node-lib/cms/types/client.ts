import { HomePage, AboutPage, PlanningPage, CurriculumPage } from "./pages";
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
    webinars(params?: ListParams): Promise<WebinarPreview[]>;
    blogPosts(params?: ListParams): Promise<BlogPostPreview[]>;
    blogPostBySlug(slug: string, params?: Params): Promise<BlogPost | null>;
    homepage(params?: Params): Promise<HomePage | null>;
    planningPage(params?: Params): Promise<PlanningPage | null>;
    aboutPage(params?: Params): Promise<AboutPage | null>;
    curriculumPage(params?: Params): Promise<CurriculumPage | null>;
    policyPageBySlug(slug: string, params?: Params): Promise<PolicyPage | null>;
    policyPages(params?: ListParams): Promise<PolicyPagePreview[]>;
    landingPages(params?: ListParams): Promise<LandingPagePreview[]>;
    landingPageBySlug(
      slug: string,
      params?: Params
    ): Promise<LandingPage | null>;
  };
}
