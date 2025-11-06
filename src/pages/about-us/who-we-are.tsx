import { FC, Fragment } from "react";
import { NextPage, GetServerSideProps } from "next";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakGridAreaProps,
  OakMaxWidth,
  OakTypography,
  OakHeading,
  OakBox,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import { AboutWhoWeArePage, TextBlock } from "@/common-lib/cms-types";
import Layout from "@/components/AppComponents/Layout";
import Card from "@/components/SharedComponents/Card";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import TranscriptToggle from "@/components/TeacherComponents/TranscriptViewer/TranscriptToggle";
import { WhoAreWeHeader } from "@/components/GenericPagesComponents/WhoAreWeHeader";
import { WhoAreWeBreakout } from "@/components/GenericPagesComponents/WhoAreWeBreakout";
import WhoAreWeTimeline from "@/components/GenericPagesComponents/WhoAreWeTimeline";
import { WhoAreWeDesc } from "@/components/GenericPagesComponents/WhoAreWeDesc";
import { WhoAreWeExplore } from "@/components/GenericPagesComponents/WhoAreWeExplore";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type AboutPageProps = {
  pageData: AboutWhoWeArePage;
  enableV2?: boolean;
};

type TimeLineProps = TextBlock & OakGridAreaProps;

const TimeLineCard: FC<TimeLineProps> = ({
  title,
  bodyPortableText,
  $colStart,
  $colSpan,
  cta,
}) => {
  return (
    <OakFlex
      $pv={"inner-padding-none"}
      $ph={["inner-padding-m"]}
      $flexDirection={"column"}
      $mb={"space-between-xxxl"}
    >
      <OakGrid>
        <OakGridArea $colSpan={$colSpan} $colStart={$colStart}>
          <OutlineHeading $mb={[32, 0]} $fontSize={[50, 100]} tag={"h3"}>
            {title}
          </OutlineHeading>
          <OakTypography $font={["body-2", "body-1"]}>
            <PortableTextWithDefaults value={bodyPortableText} />
          </OakTypography>
          {cta && (
            <OakFlex $alignItems={"center"} $mt={"space-between-m2"}>
              <OakPrimaryButton
                iconName={"arrow-right"}
                isTrailingIcon={true}
                href={getLinkHref(cta)}
                element="a"
              >
                {cta.label}
              </OakPrimaryButton>
            </OakFlex>
          )}
        </OakGridArea>
      </OakGrid>
    </OakFlex>
  );
};

const AboutWhoWeAreOld: NextPage<AboutPageProps> = ({ pageData }) => {
  const videoCaptions =
    pageData.intro.mediaType === "video" ? pageData.intro.video.captions : null;
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <OakMaxWidth
        $mb={["space-between-xl", "space-between-xxxl"]}
        $mt={["space-between-xl", "space-between-xxxl"]}
        $alignItems={"center"}
      >
        <GenericSummaryCard {...pageData} />
        <Card
          $pv={32}
          $ph={[16, 24]}
          $flexDirection={["column", "column", "column"]}
          $mb={[80, 92]}
          $background="pink50"
          $maxWidth={["100%", 812, "100%"]}
          $mt={92}
        >
          <OakFlex>
            <BrushBorders hideOnMobileH color={"pink50"} />
            <OakFlex
              $gap={["space-between-m", "space-between-m", "space-between-xxl"]}
              $flexDirection={["column", "column", "row"]}
            >
              <OakFlex $justifyContent={"center"} $alignItems={"center"}>
                {pageData.intro.mediaType == "video" && (
                  <CMSVideo
                    hideCaptions={true}
                    video={pageData.intro.video}
                    location="marketing"
                  />
                )}
              </OakFlex>
              {videoCaptions && videoCaptions?.length > 0 && (
                <OakBox $display={["block", "block", "none"]}>
                  <TranscriptToggle transcriptSentences={videoCaptions} />
                </OakBox>
              )}
              <OakBox
              // $width={["100%", "100%", "50%"]}
              >
                <OakTypography
                  $mb={"space-between-m2"}
                  $font={["body-2", "body-1"]}
                >
                  <PortableTextWithDefaults
                    value={pageData.intro.bodyPortableText}
                  />
                </OakTypography>
                <OakFlex $justifyContent={"flex-start"}>
                  {pageData.intro.cta && (
                    <OakPrimaryButton
                      iconName={"arrow-right"}
                      isTrailingIcon={true}
                      element="a"
                      href={getLinkHref(pageData.intro.cta)}
                    >
                      {pageData.intro.cta.label}
                    </OakPrimaryButton>
                  )}
                </OakFlex>
              </OakBox>
            </OakFlex>
          </OakFlex>
          {videoCaptions && (
            <OakBox
              $mt={"space-between-xs"}
              $display={["none", "none", "block"]}
            >
              <TranscriptToggle transcriptSentences={videoCaptions} />
            </OakBox>
          )}
        </Card>
        <TimeLineCard
          bodyPortableText={pageData.timeline.from.bodyPortableText}
          title={pageData.timeline.from.title}
          $colStart={[1, 1]}
          $colSpan={[12, 6]}
        />
        <TimeLineCard
          bodyPortableText={pageData.timeline.to.bodyPortableText}
          title={pageData.timeline.to.title}
          $colStart={[1, 4]}
          $colSpan={[12, 6]}
        />
        <TimeLineCard
          bodyPortableText={pageData.timeline.beyond.bodyPortableText}
          title={pageData.timeline.beyond.title}
          cta={pageData.timeline.beyond.cta}
          $colStart={[1, 7]}
          $colSpan={[12, 6]}
        />
        <OakGrid
          $mb={"space-between-xxxl"}
          $cg={"space-between-m"}
          $rg={"space-between-m2"}
        >
          {pageData.principles.map((principle) => (
            <Fragment key={principle.title}>
              <OakGridArea $colSpan={[12, 6]}>
                <Card $ph={[16, 24]} $background={"aqua"}>
                  <BrushBorders hideOnMobileH hideOnMobileV color={"aqua"} />
                  <OakHeading
                    $font={["heading-5", "heading-4"]}
                    tag={"h3"}
                    $mb={["space-between-m"]}
                  >
                    {principle.title}
                  </OakHeading>
                  <OakTypography $font={["body-2", "body-1"]}>
                    <PortableTextWithDefaults
                      value={principle.bodyPortableText}
                    />
                  </OakTypography>
                </Card>
              </OakGridArea>
            </Fragment>
          ))}
        </OakGrid>
        <GenericContactCard {...pageData.contactSection} />
      </OakMaxWidth>
    </Layout>
  );
};

export const AboutWhoWeAreNew: NextPage<AboutPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <WhoAreWeHeader
        title={"About Oak"}
        content={
          "We're here to support and inspire teachers to deliver great teaching, so every pupil benefits"
        }
        cloudinaryId="TESTING_IMAGE"
      />
      <WhoAreWeBreakout
        cloudinaryId={"test"}
        content={
          "We’re Oak, your trusted planning partner for great teaching. Our free, adaptable resources evolve with education to give teachers and schools the latest tools to deliver inspiring lessons, save time and improve pupil outcomes."
        }
      />
      <WhoAreWeTimeline
        title={"Oak’s story"}
        subtitle={"As teaching evolves, so do we..."}
        items={[
          {
            subtitle: "From then",
            title: "A rapid response to the pandemic",
            text: [
              "In 2020, teachers needed a quick way to keep pupils learning during lockdown. So we brought together a group of expert partners to support schools with thousands of lessons designed for remote learning.",
            ],
          },
          {
            subtitle: "To now",
            title: "Complete resources for the classroom, schools and trusts",
            text: [
              "From early years to exam years, we now provide complete curriculum support for the classroom. Every national curriculum subject, every unit, every lesson, in one place.",
              "We’re also transforming lesson prep with AI tools that help teachers create, adapt, and enhance their lessons in minutes, while keeping quality high and content safe.",
            ],
          },
          {
            subtitle: "And beyond",
            title: "Staying ahead in a changing world",
            text: [
              "We’ve always anticipated the emerging needs of teachers – from building safe and secure AI tools, to making our platform code available to partners who want to integrate it directly. We’ll keep innovating as we find new ways to help teachers stay ahead in a changing world.",
            ],
          },
        ]}
      />
      <WhoAreWeDesc
        title={"We are..."}
        items={[
          {
            title: "Built for the reality of teaching",
            text: "We get it. Time is tight, classes vary, and only teachers can know pupils best. That’s why our materials are flexible tools to adapt, not scripts to follow: a starting point that supports your expertise and style.",
          },
          {
            title: "Expert created and quality assured",
            text: "Created by subject and curriculum experts, our resources are informed by the best available evidence of what works, aligned to the national curriculum and tested by real teachers.",
          },
          {
            title: "Free, and always will be",
            text: "We’re funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
          },
          {
            title: "Independent and optional",
            text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
          },
        ]}
      />
      <WhoAreWeExplore
        title={"Explore more about Oak"}
        items={[
          {
            iconName: "curriculum-plan",
            title: "About Oak’s curriculum",
            href: "#",
          },
          {
            iconName: "ai-worksheet",
            title: "Oak’s impact",
            href: "#",
          },
          {
            iconName: "ai-worksheet",
            title: "Meet the team",
            href: "#",
          },
          {
            iconName: "ai-worksheet",
            title: "Get involved",
            href: "#",
          },
        ]}
      />
    </Layout>
  );
};

function AboutWhoWeAre(props: AboutPageProps) {
  if (props.enableV2) {
    return <AboutWhoWeAreNew {...props} />;
  }
  return <AboutWhoWeAreOld {...props} />;
}

export const getServerSideProps = (async (context) => {
  const isPreviewMode = context.preview === true;

  const aboutWhoWeArePage = await CMSClient.aboutWhoWeArePage({
    previewMode: isPreviewMode,
  });

  if (!aboutWhoWeArePage) {
    return {
      notFound: true,
    };
  }

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

  return {
    props: {
      enableV2,
      pageData: aboutWhoWeArePage,
    },
  };
}) satisfies GetServerSideProps<AboutPageProps>;

export default AboutWhoWeAre;
