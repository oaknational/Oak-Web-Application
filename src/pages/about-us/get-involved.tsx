import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import Layout from "@/components/AppComponents/Layout";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  AboutSharedHeader,
  BackgroundHeaderLoop,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { GetInvolvedCollaborateWithUs } from "@/components/GenericPagesComponents/GetInvolvedCollaborateWithUs";
import { GetInvolvedWorkWithUs } from "@/components/GenericPagesComponents/GetInvolvedWorkWithUs";
import CMSClient from "@/node-lib/cms";
import getPageProps from "@/node-lib/getPageProps";
import { GetInvolvedPage } from "@/common-lib/cms-types/aboutPages";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

export type GetInvolvedPageProps = {
  pageData: GetInvolvedPage;
  topNav: TopNavProps;
};

export const GetInvolved: NextPage<GetInvolvedPageProps> = ({
  pageData,
  topNav,
}: GetInvolvedPageProps) => {
  return (
    <Layout
      seoProps={getSeoProps({ title: "Get Involved" })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"Get involved"}
          content={pageData.header.introText}
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
                  componentType: "join_research_panel",
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
                  componentType: "get_in_touch",
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
          imageUrl={
            getProxiedSanityAssetUrl(pageData.workWithUs.image?.asset?.url) ??
            ""
          }
          imageAlt={pageData.workWithUs.image?.altText ?? ""}
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

export const getStaticProps: GetStaticProps<GetInvolvedPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "about-get-involved::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const getInvolvedPage = await CMSClient.getInvolvedPage({
        previewMode: isPreviewMode,
      });

      const topNav = await curriculumApi2023.topNav();

      if (!getInvolvedPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<GetInvolvedPageProps> = {
        props: {
          pageData: getInvolvedPage,
          topNav,
        },
      };
      return results;
    },
  });
};

export default GetInvolved;
