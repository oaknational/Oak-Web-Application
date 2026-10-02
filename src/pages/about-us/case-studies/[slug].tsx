import { NextPage, GetStaticPropsResult, GetServerSideProps } from "next";
import {
  OakBreadcrumbs,
  OakBox,
  OakGrid,
  OakGridArea,
  OakVideo,
  OakHandDrawnHR,
  OakTagFunctional,
  OakHeading,
  OakAnchorTarget,
  OakFlex,
  OakBreadcrumbWithoutHref,
  OakBreadcrumb,
} from "@oaknational/oak-components";
import { format } from "date-fns";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { OaksImpactCaseStudyPage } from "@/common-lib/cms-types/aboutPages";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { CaseStudiesSection } from "@/components/GenericPagesComponents/CaseStudiesSection";
import { resolveOakHref } from "@/common-lib/urls";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { CaseStudyHeader } from "@/components/GenericPagesComponents/CaseStudyHeader";
import { OaksImpactCaseStudyContentLayout } from "@/components/GenericPagesComponents/OaksImpactCaseStudyContentLayout";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import PostPortableText from "@/components/GenericPagesComponents/PostPortableText/PostPortableText";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { CaseStudyGetInTouch } from "@/components/GenericPagesComponents/CaseStudyGetInTouch";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

// to do - this data retrieval will be decoupled from oak's impact in coming tickets
export type AboutUsOaksImpactCaseStudyPageProps = {
  pageData: {
    caseStudy: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"][number];
    otherCaseStudies: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"];
  };
  topNav: TopNavProps;
  isCaseStudiesFeatEnabled: boolean;
};

const AboutUsCaseStudy: NextPage<AboutUsOaksImpactCaseStudyPageProps> = ({
  pageData: { caseStudy, otherCaseStudies },
  topNav,
  isCaseStudiesFeatEnabled,
}) => {
  const { setCurrentToastProps } = useOakNotificationsContext();

  if (!isCaseStudiesFeatEnabled) {
    otherCaseStudies = otherCaseStudies.filter(
      (caseStudy) => !caseStudy.content,
    );
  }

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
    isCaseStudiesFeatEnabled
      ? {
          href: resolveOakHref({ page: "about-case-study-library" }),
          text: "Case studies",
        }
      : {
          href: resolveOakHref({ page: "about-oaks-impact" }),
          text: "Oak's impact",
        },
    { text: title },
  ];

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
                      summary={
                        isCaseStudiesFeatEnabled
                          ? caseStudy.summaryRaw
                          : undefined
                      }
                      tag={isCaseStudiesFeatEnabled ? caseStudy.tag : undefined}
                    />
                  </OakGridArea>
                </OakGrid>
              </OakBox>
            </NewGutterMaxWidth>
          </OakBox>
          <NewGutterMaxWidth>
            <OaksImpactCaseStudyContentLayout>
              {caseStudy.video && (
                <OakBox $pv="spacing-100" $position={"relative"}>
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

              {isCaseStudiesFeatEnabled && (
                <>
                  {caseStudy.content && caseStudy.content.length > 0 && (
                    <OakFlex
                      $flexDirection="column"
                      $gap="spacing-100"
                      $pb="spacing-100"
                      $position={"relative"}
                    >
                      {caseStudy.content.map((contentBlock) => (
                        <OakFlex
                          key={contentBlock.heading}
                          $flexDirection="column"
                          $alignItems="flex-start"
                        >
                          <OakFlex
                            $as="h2"
                            $alignItems="flex-start"
                            $flexDirection="column"
                            $gap="spacing-8"
                          >
                            {contentBlock.label && (
                              <>
                                <OakTagFunctional
                                  label={contentBlock.label}
                                  $background="bg-decorative2-main"
                                />{" "}
                              </>
                            )}
                            <OakAnchorTarget
                              id={`#${contentBlock.anchorSlug?.current}`}
                            />
                            <OakHeading tag="div" $font="heading-4">
                              {contentBlock.heading}
                            </OakHeading>
                          </OakFlex>
                          <PostPortableText
                            portableText={contentBlock.contentRaw ?? []}
                          />
                        </OakFlex>
                      ))}
                    </OakFlex>
                  )}

                  {caseStudy.showGetInTouchPanel &&
                    caseStudy.getInTouchPanel && (
                      <OakBox
                        $pv="spacing-100"
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
              )}
            </OaksImpactCaseStudyContentLayout>
          </NewGutterMaxWidth>

          <CaseStudiesSection
            title="Explore more case studies"
            caseStudies={otherCaseStudies}
            showTags={isCaseStudiesFeatEnabled}
            showViewAllLink={
              otherCaseStudies.length > 3 && isCaseStudiesFeatEnabled
            }
          />
        </OakBox>
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

type URLParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<
  AboutUsOaksImpactCaseStudyPageProps,
  URLParams
> = async (context) => {
  const isCaseStudiesFeatEnabled = await isFeatureFlagEnabledServer(
    context.req.cookies,
    "case-studies-v2",
  );

  const slug = context.params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  const isPreviewMode = context.preview === true;
  const caseStudy = await CMSClient.caseStudyPage({
    slug,
    previewMode: isPreviewMode,
  });

  const topNav = await curriculumApi2023.topNav();

  if (!caseStudy) {
    return {
      notFound: true,
    };
  }

  const otherCaseStudies = await CMSClient.caseStudyLibraryPage({
    slug,
    // limit: 3, TO DO: this can be put back in when the feature is switched on, maybe change to 4 as it may exclude slug?
  });

  const results: GetStaticPropsResult<AboutUsOaksImpactCaseStudyPageProps> = {
    props: {
      pageData: {
        caseStudy,
        otherCaseStudies,
      },
      topNav,
      isCaseStudiesFeatEnabled,
    },
  };
  return results;
};

export default AboutUsCaseStudy;
