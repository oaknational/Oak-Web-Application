import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";
import {
  homePageSchema,
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
  blogListingPageSchema,
  curriculumOverviewCMSSchema,
  getInvolvedPageSchema,
  whoWeArePageSchema,
  meetTheTeamPageSchema,
  oaksCurriculaPageSchema,
  teamMemberSchema,
  oaksImpactPageSchema,
  caseStudyLibraryPageSchema,
  caseStudyPageSchema,
  nationalCurriculumInsightsSubjectLookupParamsSchema,
  implementationGuidesSchema,
  joinResearchPanelPageSchema,
} from "../../../common-lib/cms-types";
import { webinarsListingPageSchema } from "../../../common-lib/cms-types/webinarsListingPage";
import getProxiedSanityAssetUrl from "../../../common-lib/urls/getProxiedSanityAssetUrl";
import { getABTestSchema } from "../../../common-lib/cms-types/abTest";

import { getSingleton, getBySlug, getList, type Params } from "./cmsMethods";
import {
  getNationalCurriculumInsightsGuidancePage,
  getNationalCurriculumInsightsHub,
  getNationalCurriculumInsightsSubjectBySlug,
} from "./nationalCurriculumInsightsGroq";

import { planALessonPageSchema } from "@/common-lib/cms-types/planALessonPage";
import { campaignPageSchema } from "@/common-lib/cms-types/campaignPage";
import { programmePageSchema } from "@/common-lib/cms-types/programmePage";

const getSanityClient = () => ({
  webinarsListingPage: getSingleton(
    sanityGraphqlApi.webinarsListingPage,
    webinarsListingPageSchema,
    (result) => result?.allWebinarListingPage?.[0],
  ),
  blogListingPage: getSingleton(
    sanityGraphqlApi.newsListingPage,
    blogListingPageSchema,
    (result) => result?.allNewsListingPage?.[0],
  ),
  webinars: getList(
    sanityGraphqlApi.allWebinars,
    z.array(webinarPreviewSchema),
    (results) => results.allWebinar,
  ),
  webinarBySlug: getBySlug(
    sanityGraphqlApi.webinarBySlug,
    webinarSchema,
    (result) => result?.allWebinar?.[0],
  ),
  blogPosts: getList(
    sanityGraphqlApi.allBlogPosts,
    z.array(blogPostPreviewSchema),
    (result) => result.allNewsPost,
  ),
  blogPostBySlug: getBySlug(
    sanityGraphqlApi.blogPostBySlug,
    blogPostSchema,
    (result) => result?.allNewsPost?.[0],
  ),
  homepage: getSingleton(
    sanityGraphqlApi.homepage,
    homePageSchema,
    (result) => result?.allHomepage?.[0],
  ),
  planningPage: getSingleton(
    sanityGraphqlApi.planningCorePage,
    planningPageSchema,
    (result) => result?.allPlanningCorePage?.[0],
  ),
  planALessonPage: getSingleton(
    sanityGraphqlApi.planALessonPage,
    planALessonPageSchema,
    (result) => result?.allPlanALessonCorePage?.[0],
  ),
  whoWeArePage: getSingleton(
    sanityGraphqlApi.whoWeArePage,
    whoWeArePageSchema,
    (result) => {
      const whoWeArePageData = result?.allNewAboutCorePageWhoWeAre?.[0];
      return whoWeArePageData;
    },
  ),
  getInvolvedPage: getSingleton(
    sanityGraphqlApi.getInvolvedPage,
    getInvolvedPageSchema,
    (result) => {
      const whoWeArePageData = result?.allNewAboutCorePageGetInvolved?.[0];
      return whoWeArePageData;
    },
  ),
  joinResearchPanelPage: getSingleton(
    sanityGraphqlApi.joinResearchPanelPage,
    joinResearchPanelPageSchema,
    (result) => ({
      content: result?.content?.[0],
      blogs: result?.blogs,
    }),
  ),
  contactPage: getSingleton(
    sanityGraphqlApi.contactCorePage,
    contactPageSchema,
    (result) => result?.allContactCorePage?.[0],
  ),
  policyPages: getList(
    sanityGraphqlApi.allPolicyPages,
    z.array(policyPagePreviewSchema),
    (results) => results.allPolicyPage,
  ),
  policyPageBySlug: getBySlug(
    sanityGraphqlApi.policyPageBySlug,
    policyPageSchema,
    (result) => result?.allPolicyPage?.[0],
  ),
  landingPages: getList(
    sanityGraphqlApi.allLandingPages,
    z.array(landingPagePreviewSchema),
    (results) => results.allLandingPage,
  ),
  landingPageBySlug: getBySlug(
    sanityGraphqlApi.landingPageBySlug,
    landingPageSchema,
    (result) => result?.allLandingPage?.[0],
  ),
  landingPageABTestBySlug: getBySlug(
    sanityGraphqlApi.abTestedPageBySlug,
    getABTestSchema(landingPageSchema),
    (result) => result?.allAbTest?.[0],
  ),
  curriculumOverviewPage: getSingleton(
    sanityGraphqlApi.curriculumOverview,
    curriculumOverviewCMSSchema,
    (result) => result?.allCurriculumInfoPageOverview?.[0],
  ),
  nationalCurriculumInsightsHub: (params: Params = {}) =>
    getNationalCurriculumInsightsHub(params),
  nationalCurriculumInsightsGuidancePage: (params: Params = {}) =>
    getNationalCurriculumInsightsGuidancePage(params),
  nationalCurriculumInsightsSubjectBySlug: (
    subjectSlug: string,
    params: Params = {},
  ) => {
    const lookupParams =
      nationalCurriculumInsightsSubjectLookupParamsSchema.safeParse({
        subjectSlug,
      });

    if (!lookupParams.success) {
      return Promise.resolve(null);
    }

    return getNationalCurriculumInsightsSubjectBySlug(
      lookupParams.data.subjectSlug,
      params,
    );
  },
  campaigns: getList(
    sanityGraphqlApi.allCampaignPages,
    z.array(campaignPageSchema),
    (results) => results.allCampaignPage,
  ),
  campaignPageBySlug: getBySlug(
    sanityGraphqlApi.campaignBySlug,
    campaignPageSchema,
    (result) => result?.allCampaignPage?.[0],
  ),
  oaksCurriculaPage: getSingleton(
    sanityGraphqlApi.oaksCurriculaPage,
    oaksCurriculaPageSchema,
    (result) => result?.allNewAboutCorePageOaksCurricula?.[0],
  ),
  oaksImpactPage: getSingleton(
    sanityGraphqlApi.oaksImpactPage,
    oaksImpactPageSchema,
    (result) => result,
  ),
  caseStudyLibraryPage: getList(
    sanityGraphqlApi.caseStudyLibraryPage,
    caseStudyLibraryPageSchema,
    (result) => result.allCaseStudy,
  ),
  caseStudyPage: getSingleton(
    sanityGraphqlApi.caseStudyPage,
    caseStudyPageSchema,
    (result) => result.allCaseStudy?.[0],
  ),
  implementationGuides: getSingleton(
    sanityGraphqlApi.implementationGuides,
    implementationGuidesSchema,
    (result) =>
      result?.allCurriculumInfoPageOverview?.[0]?.implementationGuides ?? {},
  ),
  meetTheTeamPage: getSingleton(
    sanityGraphqlApi.meetTheTeamPage,
    meetTheTeamPageSchema,
    (result) => {
      const meetTheTeamData = result?.allNewAboutCorePageMeetTheTeam?.[0];
      if (meetTheTeamData?.documents2?.files) {
        meetTheTeamData.documents2.files.forEach((doc) => {
          const url = doc?.file?.asset?.url;
          const proxiedUrl = getProxiedSanityAssetUrl(url);
          if (doc?.file?.asset?.url) {
            doc.file.asset.url = proxiedUrl;
          }
        });
      }
      return meetTheTeamData;
    },
  ),
  teamMemberBySlug: getBySlug(
    sanityGraphqlApi.teamMemberBySlug,
    teamMemberSchema,
    (result) => result?.allTeamMember?.[0],
  ),
  programmePageBySlug: getBySlug(
    sanityGraphqlApi.programmePageBySlug,
    programmePageSchema,
    (result) => result?.allProgrammePage?.[0],
  ),
});

export default getSanityClient;
