import {
  HomePage,
  PlanningPage,
  CurriculumPage,
  AboutBoardPage,
  AboutLeadershipPage,
  AboutPartnersPage,
  AboutWhoWeArePage,
  AboutWorkWithUsPage,
} from "./pages";
import {
  BlogPost,
  BlogPostPreview,
  LandingPagePreview,
  PolicyPage,
  PolicyPagePreview,
  Webinar,
  WebinarPreview,
} from "./documents";
import { LandingPage } from "../sanity-client/schemas/landingPage";

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
    aboutWhoWeArePage(params?: Params): Promise<AboutWhoWeArePage | null>;
    aboutLeadershipPage(params?: Params): Promise<AboutLeadershipPage | null>;
    aboutBoardPage(params?: Params): Promise<AboutBoardPage | null>;
    aboutPartnersPage(params?: Params): Promise<AboutPartnersPage | null>;
    aboutWorkWithUsPage(params?: Params): Promise<AboutWorkWithUsPage | null>;
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
