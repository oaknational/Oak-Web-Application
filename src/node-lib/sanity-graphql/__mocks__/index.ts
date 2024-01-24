import { vi } from "vitest";

import homepageFixture from "../fixtures/homepage.json";
import aboutWhoWeArePageFixture from "../fixtures/aboutWhoWeArePage.json";
import aboutLeadershipPageFixture from "../fixtures/aboutLeadershipPage.json";
import aboutBoardPageFixture from "../fixtures/aboutBoardPage.json";
import aboutPartnersPageFixture from "../fixtures/aboutPartnersPage.json";
import aboutWorkWithUsPageFixture from "../fixtures/aboutWorkWithUsPage.json";
import allWebinarsFixture from "../fixtures/allWebinars.json";
import planningCorePageFixture from "../fixtures/planningCorePage.json";
import allBlogPostsFixture from "../fixtures/allBlogPosts.json";
import blogPostBySlugFixture from "../fixtures/blogPostBySlug.json";
import webinarBySlugFixture from "../fixtures/webinarBySlug.json";
import allLandingPagesFixture from "../fixtures/allLandingPages.json";
import curriculumCorePageFixture from "../fixtures/curriculumCorePage.json";
import contactCorePageFixture from "../fixtures/contactCorePage.json";
import allPolicyPagesFixture from "../fixtures/allPolicyPages.json";
import policyPageBySlugFixture from "../fixtures/policyPageBySlug.json";
import landingPageBySlugFixture from "../fixtures/landingPageBySlug.json";
import portableTextReferences from "../fixtures/portableTextReferences.json";
import allNewsListingPageFixture from "../fixtures/newsListingPage.json";
import curriculumOverviewPageFixture from "../fixtures/curriculumOverviewPage.json";
/**
 * See sanity-graphql/index.ts for instructions on generating these
 * fixture files programmatically
 */
export default {
  allWebinars: vi.fn(() => allWebinarsFixture),
  webinarBySlug: vi.fn(() => webinarBySlugFixture),
  allBlogPosts: vi.fn(() => allBlogPostsFixture),
  blogPostBySlug: vi.fn(() => blogPostBySlugFixture),
  portableTextReferences: vi.fn(() => portableTextReferences),
  homepage: vi.fn(() => homepageFixture),
  planningCorePage: vi.fn(() => planningCorePageFixture),
  aboutWhoWeArePage: vi.fn(() => aboutWhoWeArePageFixture),
  aboutLeadershipPage: vi.fn(() => aboutLeadershipPageFixture),
  aboutBoardPage: vi.fn(() => aboutBoardPageFixture),
  aboutPartnersPage: vi.fn(() => aboutPartnersPageFixture),
  aboutWorkWithUsPage: vi.fn(() => aboutWorkWithUsPageFixture),
  curriculumCorePage: vi.fn(() => curriculumCorePageFixture),
  contactCorePage: vi.fn(() => contactCorePageFixture),
  allPolicyPages: vi.fn(() => allPolicyPagesFixture),
  policyPageBySlug: vi.fn(() => policyPageBySlugFixture),
  allLandingPages: vi.fn(() => allLandingPagesFixture),
  landingPageBySlug: vi.fn(() => landingPageBySlugFixture),
  newsListingPage: vi.fn(() => allNewsListingPageFixture),
  curriculumOverviewPage: vi.fn(() => curriculumOverviewPageFixture),
};
