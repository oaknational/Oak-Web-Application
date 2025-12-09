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
import styled from "styled-components";

import CMSClient from "@/node-lib/cms";
import {
  AboutWhoWeArePage,
  NewAboutWhoWeArePage,
  TextBlock,
} from "@/common-lib/cms-types";
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
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const posthogApiKey = getBrowserConfig("posthogApiKey");

const NewsletterWrapper = styled(OakBox)`
  max-width: 100%;

  @media (min-width: 750px) {
    max-width: 870px;
  }
`;

export type AboutPageProps = {
  pageData: AboutWhoWeArePage;
  newAboutWhoWeArePage?: NewAboutWhoWeArePage;
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
      $pv={"spacing-0"}
      $ph={["spacing-16"]}
      $flexDirection={"column"}
      $mb={"spacing-80"}
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
            <OakFlex $alignItems={"center"} $mt={"spacing-32"}>
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
        $mb={["spacing-56", "spacing-80"]}
        $mt={["spacing-56", "spacing-80"]}
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
              $gap={["spacing-24", "spacing-24", "spacing-72"]}
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
                <OakTypography $mb={"spacing-32"} $font={["body-2", "body-1"]}>
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
            <OakBox $mt={"spacing-12"} $display={["none", "none", "block"]}>
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
        <OakGrid $mb={"spacing-80"} $cg={"spacing-24"} $rg={"spacing-32"}>
          {pageData.principles.map((principle) => (
            <Fragment key={principle.title}>
              <OakGridArea $colSpan={[12, 6]}>
                <Card $ph={[16, 24]} $background={"aqua"}>
                  <BrushBorders hideOnMobileH hideOnMobileV color={"aqua"} />
                  <OakHeading
                    $font={["heading-5", "heading-4"]}
                    tag={"h3"}
                    $mb={["spacing-24"]}
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

export const AboutWhoWeAreNew: NextPage<AboutPageProps> = ({
  pageData,
  newAboutWhoWeArePage,
}) => {
  const newsletterFormProps = useNewsletterForm();
  if (!newAboutWhoWeArePage) {
    return <div />;
  }

  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <OakBox $overflow={"hidden"}>
        <WhoAreWeHeader
          title={newAboutWhoWeArePage.header.title}
          content={newAboutWhoWeArePage.header.subTitle}
          imageUrl={
            "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg"
          }
          imageAlt={""}
        />
        <WhoAreWeBreakout
          imageUrl={
            newAboutWhoWeArePage.breakout.image.asset?.url ??
            "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001.jpg?w=640&fm=webp&q=80&fit=clip&auto=format"
          }
          imageAlt={newAboutWhoWeArePage.breakout.image.altText ?? ""}
          content={newAboutWhoWeArePage.breakout.text}
        />
        <WhoAreWeTimeline
          title={"As teaching evolves, so do we..."}
          subTitle={"Oak’s story"}
          items={newAboutWhoWeArePage.timeline}
        />
        <WhoAreWeDesc title={"We are..."} items={newAboutWhoWeArePage.usp} />
        <WhoAreWeExplore
          title={"Explore more about Oak"}
          items={[
            {
              iconName: "homepage-teacher-map",
              title: "About Oak’s curriculum",
              href: "#",
            },
            {
              iconName: "data",
              title: "Oak’s impact",
              href: "#",
            },
            {
              iconName: "snack-break",
              title: "Meet the team",
              href: "#",
            },
            {
              iconName: "chatting",
              title: "Get involved",
              href: "#",
            },
          ]}
        />
        <OakBox
          $background={"bg-decorative1-subdued"}
          $pv={["spacing-56", "spacing-56"]}
        >
          <OakMaxWidth $ph={"spacing-16"} $alignItems={"center"}>
            <NewsletterWrapper>
              <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
            </NewsletterWrapper>
          </OakMaxWidth>
        </OakBox>
      </OakBox>
    </Layout>
  );
};

function AboutWhoWeAre(props: Readonly<AboutPageProps>) {
  if (props.enableV2) {
    return <AboutWhoWeAreNew {...props} />;
  }
  return <AboutWhoWeAreOld {...props} />;
}

export const getServerSideProps = (async (context) => {
  const isPreviewMode = context.preview === true;

  const newAboutWhoWeArePage = await CMSClient.newAboutWhoWeArePage({
    previewMode: isPreviewMode,
  });

  const aboutWhoWeArePage = await CMSClient.aboutWhoWeArePage({
    previewMode: isPreviewMode,
  });

  if (!aboutWhoWeArePage || !newAboutWhoWeArePage) {
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
      newAboutWhoWeArePage,
    },
  };
}) satisfies GetServerSideProps<AboutPageProps>;

export default AboutWhoWeAre;
