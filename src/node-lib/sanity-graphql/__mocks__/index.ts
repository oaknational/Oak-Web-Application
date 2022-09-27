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
import allPolicyPagesFixture from "../fixtures/allPolicyPages.json";
import policyPageBySlugFixture from "../fixtures/policyPageBySlug.json";
import landingPageBySlugFixture from "../fixtures/landingPageBySlug.json";
import blogPortableTextReferences from "../fixtures/blogPortableTextReferences.json";

/**
 * See sanity-graphql/index.ts for instructions on generating these
 * fixture files programmatically
 */
export default {
  allWebinars: jest.fn(() => allWebinarsFixture),
  webinarBySlug: jest.fn(() => webinarBySlugFixture),
  allBlogPosts: jest.fn(() => allBlogPostsFixture),
  blogPostBySlug: jest.fn(() => blogPostBySlugFixture),
  blogPortableTextReferences: jest.fn(() => blogPortableTextReferences),
  homepage: jest.fn(() => homepageFixture),
  planningCorePage: jest.fn(() => planningCorePageFixture),
  aboutWhoWeArePage: jest.fn(() => aboutWhoWeArePageFixture),
  aboutLeadershipPage: jest.fn(() => aboutLeadershipPageFixture),
  aboutBoardPage: jest.fn(() => aboutBoardPageFixture),
  aboutPartnersPage: jest.fn(() => aboutPartnersPageFixture),
  aboutWorkWithUsPage: jest.fn(() => aboutWorkWithUsPageFixture),
  curriculumCorePage: jest.fn(() => curriculumCorePageFixture),
  allPolicyPages: jest.fn(() => allPolicyPagesFixture),
  policyPageBySlug: jest.fn(() => policyPageBySlugFixture),
  allLandingPages: jest.fn(() => allLandingPagesFixture),
  landingPageBySlug: jest.fn(() => landingPageBySlugFixture),
};
