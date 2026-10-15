import {
  NextPage,
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";
import {
  OakBreadcrumbs,
  OakBox,
  OakGrid,
  OakGridArea,
  OakVideo,
  OakHandDrawnHR,
  OakTagFunctional,
  OakHeading,
  OakFlex,
  OakBreadcrumbWithoutHref,
  OakBreadcrumb,
  OakSpan,
} from "@oaknational/oak-components";
import { format } from "date-fns";
import { createRef, useMemo } from "react";
import { PortableTextComponent } from "@portabletext/react";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  CaseStudyPage,
  CaseStudyLibraryPage,
} from "@/common-lib/cms-types/aboutPages";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { CaseStudiesSection } from "@/components/GenericPagesComponents/CaseStudiesSection";
import { resolveOakHref } from "@/common-lib/urls";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { CaseStudyHeader } from "@/components/GenericPagesComponents/CaseStudyHeader";
import { CaseStudyNav } from "@/components/GenericPagesComponents/CaseStudyNav";
import { CaseStudyContentLayout } from "@/components/GenericPagesComponents/CaseStudyContentLayout";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import PostPortableText from "@/components/GenericPagesComponents/PostPortableText/PostPortableText";
import { CaseStudyGetInTouch } from "@/components/GenericPagesComponents/CaseStudyGetInTouch";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import TrackScrolledTo from "@/components/SharedComponents/TrackScrolledTo";
import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";

export type AboutUsCaseStudyLibraryPageProps = {
  pageData: {
    caseStudy: CaseStudyPage;
    otherCaseStudies: CaseStudyLibraryPage;
  };
  topNav: TopNavProps;
};

const AboutUsCaseStudy: NextPage<AboutUsCaseStudyLibraryPageProps> = ({
  pageData: { caseStudy, otherCaseStudies },
  topNav,
}) => {
  const { setCurrentToastProps } = useOakNotificationsContext();
  const menuLinks = useMemo(
    () =>
      (caseStudy.content ?? []).flatMap(({ label, anchorSlug }) =>
        label && anchorSlug?.current
          ? [{ label, anchor: anchorSlug.current }]
          : [],
      ),
    [caseStudy.content],
  );
  const sectionRefs = useMemo(
    () =>
      Object.fromEntries(
        menuLinks.map(({ anchor }) => [anchor, createRef<HTMLDivElement>()]),
      ),
    [menuLinks],
  );

  const onCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);

    setCurrentToastProps({
      message: "Link copied to clipboard.",
      variant: "green",
      autoDismiss: true,
      autoDismissDuration: 4000,
      showIcon: true,
      showClose: true,
    });
  };

  const title = caseStudy.title ?? caseStudy.video?.title ?? "";
  const breadcrumbs: [...OakBreadcrumb[], OakBreadcrumbWithoutHref] = [
    {
      href: resolveOakHref({ page: "home" }),
      text: "Home",
    },
    {
      href: resolveOakHref({ page: "about-case-study-library" }),
      text: "Case studies",
    },
    { text: title },
  ];

  const caseStudyPortableTextBlockOverrides: Record<
    string,
    PortableTextComponent<"block">
  > = {
    heading1: (props) => (
      <OakHeading
        tag="h3"
        $font={["heading-6", "heading-5"]}
        $mt={["spacing-32", "spacing-40"]}
      >
        {props.children}
      </OakHeading>
    ),
    heading2: (props) => (
      <OakHeading
        tag="h4"
        $font={["heading-7", "heading-6"]}
        $mt={["spacing-32", "spacing-40"]}
      >
        {props.children}
      </OakHeading>
    ),
    heading3: (props) => (
      <OakHeading tag="h5" $font="heading-7" $mt={["spacing-32", "spacing-40"]}>
        {props.children}
      </OakHeading>
    ),
  };

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title })}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        <OakBox $zIndex={"neutral"} $color={"text-primary"}>
          <OakBox $bb="border-solid-xxxl" $borderColor="border-decorative2">
            <NewGutterMaxWidth>
              <OakBox $mt="spacing-40" $mb="spacing-56">
                <OakGrid $cg="spacing-16">
                  <OakGridArea $rowStart={1} $colSpan={12}>
                    <OakBox $pb="spacing-20">
                      <OakBreadcrumbs breadcrumbs={breadcrumbs} />
                    </OakBox>
                    <OakHandDrawnHR
                      hrColor={"bg-neutral-stronger"}
                      $height={"spacing-4"}
                    />
                  </OakGridArea>
                  <OakGridArea
                    $rowStart={2}
                    $colStart={[0, 0, 3]}
                    $colSpan={[12, 12, 8]}
                  >
                    <CaseStudyHeader
                      title={title}
                      headingLevel="h1"
                      publishedDate={format(
                        new Date(caseStudy.publishedAt),
                        "d MMMM y",
                      )}
                      onCopyLink={onCopyLink}
                      summary={caseStudy.summaryRaw}
                      tag={caseStudy.tag}
                    />
                  </OakGridArea>
                </OakGrid>
              </OakBox>
            </NewGutterMaxWidth>
          </OakBox>
          <NewGutterMaxWidth>
            <CaseStudyContentLayout
              menu={
                menuLinks.length >= 2 ? (
                  <OakBox
                    $height="100%"
                    $pb={["spacing-0", "spacing-800", "spacing-640"]}
                  >
                    <CaseStudyNav links={menuLinks} sectionRefs={sectionRefs} />
                  </OakBox>
                ) : undefined
              }
            >
              {caseStudy.video && (
                <OakBox
                  $pb={["spacing-72", "spacing-100"]}
                  $position={"relative"}
                >
                  <OakVideo
                    videoSlot={
                      caseStudy.video.video.asset && (
                        <VideoPlayer
                          playbackPolicy="public"
                          thumbnailTime={caseStudy.video.video.asset.thumbTime}
                          playbackId={caseStudy.video.video.asset.playbackId}
                          title={caseStudy.video.title}
                          location="marketing"
                          omitBorder={true}
                        />
                      )
                    }
                    showTranscript={true}
                    transcript={caseStudy.video.transcript}
                    body={caseStudy.textRaw ?? undefined}
                  />
                </OakBox>
              )}

              <>
                {caseStudy.content && caseStudy.content.length > 0 && (
                  <OakFlex
                    $flexDirection="column"
                    $gap={["spacing-72", "spacing-100"]}
                    $position={"relative"}
                  >
                    {caseStudy.content.map((contentBlock) => (
                      <OakFlex
                        key={
                          contentBlock.anchorSlug?.current ??
                          contentBlock.heading
                        }
                        ref={
                          sectionRefs[contentBlock.anchorSlug?.current ?? ""]
                        }
                        id={contentBlock.anchorSlug?.current}
                        $scrollMarginTop={["spacing-24", "spacing-24"]}
                        $flexDirection="column"
                        $alignItems="flex-start"
                      >
                        <OakFlex
                          $alignItems="flex-start"
                          $flexDirection="column"
                          $gap="spacing-8"
                          as="h2"
                        >
                          {contentBlock.label && (
                            <OakTagFunctional
                              label={contentBlock.label}
                              $background="bg-decorative2-main"
                              useSpan={true}
                              as="span"
                            />
                          )}
                          <OakSpan $font={["heading-5", "heading-4"]}>
                            {contentBlock.heading}
                          </OakSpan>
                        </OakFlex>
                        <PostPortableText
                          portableText={contentBlock.contentRaw ?? []}
                          location="marketing"
                          blockOverrides={caseStudyPortableTextBlockOverrides}
                          styleOverrides={{
                            quote: {
                              color: "bg-decorative2-main",
                            },
                          }}
                        />
                      </OakFlex>
                    ))}
                    <TrackScrolledTo eventKey="case_study_content_end" />
                  </OakFlex>
                )}

                {caseStudy.showGetInTouchPanel && caseStudy.getInTouchPanel && (
                  <OakBox
                    $pv={["spacing-72", "spacing-100"]}
                    $bt="border-solid-m"
                    $borderColor="border-neutral-lighter"
                  >
                    <CaseStudyGetInTouch
                      headingStartLevel={2}
                      href={
                        "https://bvumd.share.hsforms.com/24SxO0XoTTTmGj8OInxGjrA"
                      }
                      name={caseStudy.getInTouchPanel.personName}
                      role={caseStudy.getInTouchPanel.jobRole}
                      institutionName={
                        caseStudy.getInTouchPanel.institutionName
                      }
                      imageUrl={
                        getProxiedSanityAssetUrl(
                          caseStudy.getInTouchPanel.personImage.asset?.url,
                        ) ?? ""
                      }
                    />
                  </OakBox>
                )}
              </>
            </CaseStudyContentLayout>
          </NewGutterMaxWidth>

          <CaseStudiesSection
            title="Explore more case studies"
            caseStudies={otherCaseStudies}
          />
        </OakBox>
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

type URLParams = {
  slug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const caseStudies = await CMSClient.caseStudyLibraryPage();
  const paths = caseStudies.map((caseStudy) => ({
    params: { slug: caseStudy.slug.current },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  AboutUsCaseStudyLibraryPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "about-case-study::getStaticProps",
    context,
    getProps: async () => {
      const slug = context.params?.slug;
      if (!slug) {
        return { notFound: true };
      }

      const isPreviewMode = context.preview === true;
      const caseStudy = await CMSClient.caseStudyPage({
        slug,
        previewMode: isPreviewMode,
      });

      if (!caseStudy) {
        return { notFound: true };
      }

      const topNav = await curriculumApi2023.topNav();
      const otherCaseStudies = await CMSClient.caseStudyLibraryPage({
        slug,
        previewMode: isPreviewMode,
      });

      const results: GetStaticPropsResult<AboutUsCaseStudyLibraryPageProps> = {
        props: {
          pageData: {
            caseStudy,
            otherCaseStudies,
          },
          topNav,
        },
      };
      return results;
    },
  });
};

export default AboutUsCaseStudy;
