import { NextPage, GetServerSideProps, GetStaticPropsResult } from "next";
import {
  OakBreadcrumbs,
  OakBox,
  OakHeading,
  OakTagFunctional,
  OakFlex,
  OakLink,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { OaksImpactCaseStudyPage } from "@/common-lib/cms-types/aboutPages";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { OaksImpactCaseStudies } from "@/components/GenericPagesComponents/OaksImpactCaseStudies";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import { resolveOakHref } from "@/common-lib/urls";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

export type AboutUsOaksImpactCaseStudyPageProps = {
  pageData: {
    caseStudy: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"][number];
    otherCaseStudies: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"];
  };
  topNav: TopNavProps;
};

const AboutUsOaksImpactCaseStudy: NextPage<
  AboutUsOaksImpactCaseStudyPageProps
> = ({ pageData: { caseStudy, otherCaseStudies }, topNav }) => {
  const { setCurrentToastProps } = useOakNotificationsContext();

  const onCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);

    setCurrentToastProps({
      message: "Link copied to clipboard.",
      variant: "green",
      autoDismiss: false,
      autoDismissDuration: 4000,
      showIcon: true,
    });
  };

  return (
    <Layout
      seoProps={getSeoProps({ title: caseStudy.video.title })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <OakBox $zIndex={"neutral"} $color={"text-primary"}>
        <OakBox
          $gap="spacing-32"
          $bb="border-solid-xxxl"
          $borderColor="border-decorative2"
        >
          <NewGutterMaxWidth>
            <OakBox $mt="spacing-40" $mb="spacing-56">
              <OakGrid $cg="spacing-16">
                <OakGridArea $rowStart={1} $colSpan={12}>
                  <OakBreadcrumbs
                    breadcrumbs={[
                      { href: resolveOakHref({ page: "home" }), text: "Home" },
                      { href: "/about-us/oaks-impact", text: "Oak's Impact" },
                      { text: caseStudy.video.title },
                    ]}
                  />
                </OakGridArea>
                <OakGridArea
                  $rowStart={2}
                  $colStart={[0, 0, 3]}
                  $colSpan={[12, 12, 8]}
                >
                  <OakFlex
                    $pt="spacing-32"
                    $gap="spacing-16"
                    $flexDirection="column"
                    $alignItems="flex-start"
                  >
                    <OakTagFunctional
                      label="Optional tag"
                      $background="bg-decorative2-main"
                    />
                    <OakHeading
                      tag="h1"
                      $font={["heading-4", "heading-3", "heading-3"]}
                    >
                      {caseStudy.video.title}
                    </OakHeading>
                    <OakFlex
                      $flexDirection="row"
                      $flexGrow={1}
                      $alignSelf="stretch"
                    >
                      <OakFlex
                        $flexGrow={1}
                        $font={["body-2", "body-1", "body-1"]}
                      >
                        14 July 2026
                      </OakFlex>
                      <OakLink
                        element="button"
                        variant="secondary"
                        onClick={onCopyLink}
                        iconName="copy"
                      >
                        Copy link
                      </OakLink>
                    </OakFlex>
                  </OakFlex>
                </OakGridArea>
              </OakGrid>
            </OakBox>
          </NewGutterMaxWidth>
        </OakBox>
        <NewGutterMaxWidth>
          <OakGrid $cg="spacing-16">
            <OakGridArea $rowStart={1} $colSpan={[12, 3, 2]}>
              <OakBox
                $ba="border-solid-m"
                $pa="spacing-24"
                $borderColor="icon-error"
              >
                TODO: Menu
              </OakBox>
            </OakGridArea>
            <OakGridArea $colStart={[1, 4, 3]} $colSpan={[12, 9, 8]}>
              <OakBox
                $ba="border-solid-m"
                $pa="spacing-24"
                $borderColor="icon-error"
              >
                TODO: Main
              </OakBox>
            </OakGridArea>
          </OakGrid>
        </NewGutterMaxWidth>

        <OaksImpactCaseStudies caseStudies={otherCaseStudies} />
      </OakBox>
    </Layout>
  );
};

// TODO: Add back in once moving back to `getStaticProps(...)`
// export const getStaticPaths = async () => {
//     console.log({shouldSkipInitialBuild})
//   if (shouldSkipInitialBuild) {
//     return getFallbackBlockingConfig();
//   }

//   const impactPageData = await CMSClient.oaksImpactPage();

//   if (!impactPageData) {
//     return {
//       notFound: true,
//     };
//   }

//   const paths = impactPageData.caseStudiesSection.caseStudies.map((caseStudy) => ({
//     params: { slug: caseStudy.slug.current },
//   }));

//   console.log("getStaticPaths: paths", paths);

//   const config: GetStaticPathsResult<URLParams> = {
//     fallback: "blocking",
//     paths,
//   };
//   return config;
// };

type URLParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<
  AboutUsOaksImpactCaseStudyPageProps,
  URLParams
> = async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    getBrowserConfig("posthogApiKey"),
  );

  let isImpactPageEnabled: boolean = false;
  if (posthogUserId) {
    isImpactPageEnabled =
      (await getFeatureFlag({
        featureFlagKey: "oaks-impact",
        posthogUserId,
      })) === true;
  }

  if (!isImpactPageEnabled) {
    return {
      notFound: true,
    };
  }

  const slug = context.params?.slug;
  if (!slug) {
    return { notFound: true };
  }
  const isPreviewMode = context.preview === true;
  const oaksImpactCaseStudyPage = await CMSClient.oaksImpactCaseStudyPage({
    previewMode: isPreviewMode,
  });

  const caseStudy =
    oaksImpactCaseStudyPage?.caseStudiesSection.caseStudies.find(
      (caseStudy) => caseStudy.slug.current === slug,
    );

  const topNav = await curriculumApi2023.topNav();

  if (!oaksImpactCaseStudyPage || !caseStudy) {
    return {
      notFound: true,
    };
  }

  const otherCaseStudies =
    oaksImpactCaseStudyPage?.caseStudiesSection.caseStudies.filter(
      (caseStudy) => caseStudy.slug.current !== slug,
    );

  const results: GetStaticPropsResult<AboutUsOaksImpactCaseStudyPageProps> = {
    props: {
      pageData: {
        caseStudy,
        otherCaseStudies,
      },
      topNav,
    },
  };
  return results;
};

export default AboutUsOaksImpactCaseStudy;
