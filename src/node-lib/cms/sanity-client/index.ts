import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";
import {
  aboutBoardPageSchema,
  aboutLeadershipPageSchema,
  aboutPartnersPageSchema,
  aboutWhoWeArePageSchema,
  aboutWorkWithUsPageSchema,
  homePageSchema,
  curriculumPageSchema,
  contactPageSchema,
  blogPostPreviewSchema,
  blogPostSchema,
  planningPageSchema,
  policyPagePreviewSchema,
  policyPageSchema,
  webinarPreviewSchema,
  webinarSchema,
  landingPagePreviewSchema,
  landingPageSchema,
  supportPageSchema,
  blogListingPageSchema,
} from "../../../common-lib/cms-types";
import { webinarsListingPageSchema } from "../../../common-lib/cms-types/webinarsListingPage";

import { getSingleton, getBySlug, getList } from "./cmsMethods";

const getSanityClient = () => ({
  webinarsListingPage: getSingleton(
    sanityGraphqlApi.webinarsListingPage,
    webinarsListingPageSchema,
    (result) => result?.allWebinarListingPage?.[0]
  ),
  blogListingPage: getSingleton(
    sanityGraphqlApi.newsListingPage,
    blogListingPageSchema,
    (result) => result?.allNewsListingPage?.[0]
  ),
  webinars: getList(
    sanityGraphqlApi.allWebinars,
    z.array(webinarPreviewSchema),
    (results) => results.allWebinar
  ),
  webinarBySlug: getBySlug(
    sanityGraphqlApi.webinarBySlug,
    webinarSchema,
    (result) => result?.allWebinar?.[0]
  ),
  blogPosts: getList(
    sanityGraphqlApi.allBlogPosts,
    z.array(blogPostPreviewSchema),
    (result) => result.allNewsPost
  ),
  blogPostBySlug: getBySlug(
    sanityGraphqlApi.blogPostBySlug,
    blogPostSchema,
    (result) => result?.allNewsPost?.[0]
  ),
  homepage: getSingleton(
    sanityGraphqlApi.homepage,
    homePageSchema,
    (result) => result?.allHomepage?.[0]
  ),
  planningPage: getSingleton(
    sanityGraphqlApi.planningCorePage,
    planningPageSchema,
    (result) => result?.allPlanningCorePage?.[0]
  ),
  aboutWhoWeArePage: getSingleton(
    sanityGraphqlApi.aboutWhoWeArePage,
    aboutWhoWeArePageSchema,
    (result) => {
      const whoWeArePageData = result?.allAboutCorePageWhoWeAre?.[0];
      const parentPageData = result?.aboutCorePage?.[0];

      return whoWeArePageData && parentPageData
        ? {
            ...parentPageData,
            ...whoWeArePageData,
          }
        : undefined;
    }
  ),
  aboutLeadershipPage: getSingleton(
    sanityGraphqlApi.aboutLeadershipPage,
    aboutLeadershipPageSchema,
    (result) => {
      const leadershipPageData = result?.allAboutCorePageLeadership?.[0];
      const parentPageData = result?.aboutCorePage?.[0];

      return leadershipPageData && parentPageData
        ? {
            ...parentPageData,
            ...leadershipPageData,
          }
        : undefined;
    }
  ),
  aboutBoardPage: getSingleton(
    sanityGraphqlApi.aboutBoardPage,
    aboutBoardPageSchema,
    (result) => {
      const boardPageData = result?.allAboutCorePageBoard?.[0];
      const parentPageData = result?.aboutCorePage?.[0];

      return boardPageData && parentPageData
        ? {
            ...parentPageData,
            ...boardPageData,
          }
        : undefined;
    }
  ),
  aboutPartnersPage: getSingleton(
    sanityGraphqlApi.aboutPartnersPage,
    aboutPartnersPageSchema,
    (result) => {
      const partnersPageData = result?.allAboutCorePagePartners?.[0];
      const parentPageData = result?.aboutCorePage?.[0];

      return partnersPageData && parentPageData
        ? {
            ...parentPageData,
            ...partnersPageData,
          }
        : undefined;
    }
  ),
  aboutWorkWithUsPage: getSingleton(
    sanityGraphqlApi.aboutWorkWithUsPage,
    aboutWorkWithUsPageSchema,
    (result) => {
      const workWithUsPage = result?.allAboutCorePageWorkWithUs?.[0];
      const parentPageData = result?.aboutCorePage?.[0];

      return workWithUsPage
        ? {
            ...parentPageData,
            ...workWithUsPage,
          }
        : undefined;
    }
  ),
  curriculumPage: getSingleton(
    sanityGraphqlApi.curriculumCorePage,
    curriculumPageSchema,
    (result) => result?.allCurriculumCorePage?.[0]
  ),
  supportPage: getSingleton(
    sanityGraphqlApi.supportCorePage,
    supportPageSchema,
    (result) => result?.allSupportCorePage?.[0]
  ),
  contactPage: getSingleton(
    sanityGraphqlApi.contactCorePage,
    contactPageSchema,
    (result) => result?.allContactCorePage?.[0]
  ),
  policyPages: getList(
    sanityGraphqlApi.allPolicyPages,
    z.array(policyPagePreviewSchema),
    (results) => results.allPolicyPage
  ),
  policyPageBySlug: getBySlug(
    sanityGraphqlApi.policyPageBySlug,
    policyPageSchema,
    (result) => result?.allPolicyPage?.[0]
  ),
  landingPages: getList(
    sanityGraphqlApi.allLandingPages,
    z.array(landingPagePreviewSchema),
    (results) => results.allLandingPage
  ),
  landingPageBySlug: getBySlug(
    sanityGraphqlApi.landingPageBySlug,
    landingPageSchema,
    (result) => result?.allLandingPage?.[0]
  ),
});

export default getSanityClient;
