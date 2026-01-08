import { GetServerSideProps, NextPage } from "next";

import Layout from "@/components/AppComponents/Layout";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  AboutSharedHeader,
  BackgroundHeaderLoop,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { GetInvolvedCollaborateWithUs } from "@/components/GenericPagesComponents/GetInvolvedCollaborateWithUs";
import { GetInvolvedWorkWithUs } from "@/components/GenericPagesComponents/GetInvolvedWorkWithUs";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import CMSClient from "@/node-lib/cms";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type GetInvolvedPage = {
  pageData: {
    header: {
      textRaw: PortableTextJSON;
    };
    collaborate: {
      researchPanelTextRaw: PortableTextJSON;
      feedbackTextRaw: PortableTextJSON;
    };
    workWithUs: {
      textRaw: PortableTextJSON;
    };
  };
  topNav: TopNavProps;
};

export const GetInvolved: NextPage<GetInvolvedPage> = ({
  pageData,
  topNav,
}) => {
  return (
    <Layout
      seoProps={getSeoProps(null)}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"Get involved"}
          content={pageData.header.textRaw}
          titleHighlight="bg-decorative3-main"
        >
          <BackgroundHeaderLoop />
        </AboutSharedHeader>
        <GetInvolvedCollaborateWithUs
          heading="Collaborate with us"
          imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1763393163/icons/chatting-illustration_l52zaf.svg"
          imageAlt=""
          cards={[
            {
              headingTag: "h3",
              headingTitle: "Join our teacher research panel",
              content: pageData.collaborate.researchPanelTextRaw,
              buttons: [
                {
                  text: "Join the research panel",
                  link: "https://share.hsforms.com/1dv2FiLvTQraZIZmhUUURmQbvumd",
                  external: true,
                },
                {
                  text: "Explore our research",
                  link: "/blog/categories/research-and-insights",
                },
              ],
            },
            {
              headingTag: "h3",
              headingTitle: "Give your feedback",
              content: pageData.collaborate.feedbackTextRaw,
              buttons: [
                {
                  text: "Get in touch",
                  link: "https://share.hsforms.com/2pi1ZLqVKQNyKznqJrpqsgwbvumd",
                  external: true,
                },
              ],
            },
          ]}
        />
        <GetInvolvedWorkWithUs
          heading="Work with us"
          text={pageData.workWithUs.textRaw}
          permanentRolesLink="https://app.beapplied.com/org/1574/oak-national-academy/"
          freelanceRolesLink="https://app.beapplied.com/org/1767/oak-national-academy-freelancers/"
          imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1764066578/about-us/team-huddle_zivgxj.png"
          imageAlt=""
          badges={[
            {
              url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/top-1-percent-logo_hyga8g.svg",
              alt: "'In Escape the City's top 1% of employers'",
            },
            {
              url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/investor-in-people_eymeqv.svg",
              alt: "Awarded Gold in Investors In People",
            },
            {
              url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/disability-confident_ym07wl.png",
              alt: "Certified as Disability Confident Committed",
            },
          ]}
        />
      </AboutUsLayout>
    </Layout>
  );
};

export const getServerSideProps = (async (context) => {
  const isPreviewMode = context.preview === true;
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );

  const aboutWhoWeArePage = await CMSClient.newAboutGetInvolvedPage({
    previewMode: isPreviewMode,
  });

  let enableV2: boolean = false;
  if (posthogUserId) {
    // get the variant key for the user
    enableV2 =
      (await getFeatureFlag({
        featureFlagKey: "about-us--who-we-are--v2",
        posthogUserId,
      })) === true;
  }
  const topNav = await curriculumApi2023.topNav();

  if (!enableV2 || !aboutWhoWeArePage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: aboutWhoWeArePage,
      topNav,
    },
  };
}) satisfies GetServerSideProps<GetInvolvedPage>;

export default GetInvolved;
