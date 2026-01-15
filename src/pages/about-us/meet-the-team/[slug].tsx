import { NextPage, GetServerSideProps } from "next";

import { mockData, Person } from "../meet-the-team";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/Layout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type AboutPageProps = {
  pageData: Person;
  topNav: TopNavProps;
};

const AboutUsLeadership: NextPage<AboutPageProps> = ({ pageData, topNav }) => {
  return (
    <Layout
      seoProps={getSeoProps(null)}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <pre>
        <code>{JSON.stringify(pageData, null, 2)}</code>
      </pre>
    </Layout>
  );
};

function findPerson(slug: string) {
  return [...mockData.leadershipList, ...mockData.boardList].find(
    (l) => l.slug === slug,
  );
}

type URLParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<
  AboutPageProps,
  URLParams
> = async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );
  let enableV2: boolean = false;
  if (posthogUserId) {
    // get the variant key for the user
    enableV2 =
      (await getFeatureFlag({
        featureFlagKey: "about-us--who-we-are--v2",
        posthogUserId,
      })) === true;
  }

  if (!enableV2) {
    return {
      notFound: true,
    };
  }

  // TODO: Replace the mock data with something like the following
  // const isPreviewMode = context.preview === true;
  // const aboutWhoWeArePage = await CMSClient.newAboutGetInvolvedPage({
  //   previewMode: isPreviewMode,
  // });

  const aboutMeetTheTeamPersonPage = context.params?.slug
    ? findPerson(context.params.slug)
    : null;

  const topNav = await curriculumApi2023.topNav();

  if (!aboutMeetTheTeamPersonPage) {
    return {
      notFound: true,
    };
  }

  const results = {
    props: {
      pageData: aboutMeetTheTeamPersonPage,
      topNav,
    },
  };
  return results;
};

export default AboutUsLeadership;
