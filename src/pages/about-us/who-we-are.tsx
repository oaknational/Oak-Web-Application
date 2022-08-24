import { FC, Fragment } from "react";
import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";

import CMSClient, { AboutPage, TextBlock } from "../../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import SummaryCard from "../../components/Card/SummaryCard";
import Flex, { FlexProps } from "../../components/Flex";
import Card from "../../components/Card";
import Box from "../../components/Box";
import Typography, { Heading } from "../../components/Typography";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import OutlineHeading from "../../components/OutlineHeading";
import VideoPlayer from "../../components/VideoPlayer";
import Grid, { GridArea } from "../../components/Grid";
import AboutContactCard from "../../components/AboutContactCard";

export type AboutPageProps = {
  pageData: AboutPage;
  isPreviewMode: boolean;
  renderPlayer: boolean;
};

type TimeLineProps = TextBlock & FlexProps;

const TimeLineCard: FC<TimeLineProps> = ({
  title,
  bodyPortableText,
  $alignItems,
  cta,
  ...props
}) => {
  return (
    <Flex
      $pv={0}
      $ph={[16]}
      $alignItems={$alignItems}
      $flexDirection={"column"}
      $mb={[80, 92]}
      {...props}
    >
      <Flex $flexDirection={"column"} $width={["100%", "50%"]}>
        <OutlineHeading $mb={[32, 0]} $fontSize={[50, 100]} tag={"h2"}>
          {title}
        </OutlineHeading>
        <PortableText value={bodyPortableText} />
      </Flex>
      {cta?.label && (
        <Flex>
          <ButtonAsLink
            $mt={[36]}
            icon={"ArrowRight"}
            iconPosition={"trailing"}
            label={cta.label}
            href={"/"}
          />
        </Flex>
      )}
    </Flex>
  );
};

const AboutWhoWeAre: NextPage<AboutPageProps> = ({
  pageData,
  isPreviewMode,
  renderPlayer,
}) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard
          title={"About us"}
          heading={pageData.whoWeAre.sectionHeading}
          summary={
            "We’re here to support great teaching. We’re an independent public body. We work in partnership to improve pupil outcomes and close the disadvantaged gap by supporting teachers to teach, and enabling pupils to access a high-quality curriculum"
          }
          background={"teachersPastelYellow"}
          textMaxWidth={740}
          imageMinWidth={180}
          cardImageProps={{
            imageSrc: "/images/oak-logo.svg",
            alt: "who we are illustration",
            position: "left center",
          }}
        />
        <Flex $mt={92} $mb={[80, 92]} $background="twilight">
          <Card $pv={32} $ph={[16, 32]} $flexDirection={["column", "row"]}>
            <Flex
              $justifyContent={"center"}
              $alignItems={"center"}
              $pb={[24, 0]}
              $pr={[0, 72]}
              $minWidth={["50%"]}
            >
              {pageData.whoWeAre.intro.mediaType == "video" && renderPlayer && (
                <VideoPlayer
                  playbackId={
                    pageData.whoWeAre.intro.video.video.asset.playbackId
                  }
                  title={pageData.whoWeAre.intro.video.title}
                />
              )}
            </Flex>
            <Box $minWidth={["50%"]}>
              <Typography
                $mb={36}
                $fontSize={[16, 18]}
                $lineHeight={["24px", "28px"]}
              >
                <PortableText
                  value={pageData.whoWeAre.intro.bodyPortableText}
                />
              </Typography>
              <Flex $justifyContent={"flex-start"}>
                {pageData.whoWeAre.intro.cta?.linkType && (
                  <ButtonAsLink
                    icon={"ArrowRight"}
                    iconPosition="trailing"
                    label={pageData.whoWeAre.intro.cta.label}
                    href={"/"}
                  />
                )}
              </Flex>
            </Box>
          </Card>
        </Flex>
        <TimeLineCard
          bodyPortableText={pageData.whoWeAre.timeline.from.bodyPortableText}
          title={pageData.whoWeAre.timeline.from.title}
          $alignItems={"flex-start"}
        />
        <TimeLineCard
          bodyPortableText={pageData.whoWeAre.timeline.to.bodyPortableText}
          title={pageData.whoWeAre.timeline.to.title}
          $alignItems={["flex-start", "center"]}
        />
        <TimeLineCard
          bodyPortableText={pageData.whoWeAre.timeline.beyond.bodyPortableText}
          title={pageData.whoWeAre.timeline.beyond.title}
          cta={pageData.whoWeAre.timeline.beyond.cta}
          $alignItems={["flex-start", "flex-end"]}
        />
        <Grid $mb={80} $cg={28} $rg={32}>
          {pageData.whoWeAre.principles.map((principle) => (
            <Fragment key={principle.title}>
              <GridArea $colSpan={[12, 6]}>
                <Card $background={"videoBlue"}>
                  <Heading
                    $fontSize={[24, 32]}
                    $lineHeight={["32px", "40px"]}
                    tag={"h4"}
                    $mb={[24]}
                  >
                    {principle.title}
                  </Heading>
                  <Typography
                    $lineHeight={["24px", "28px"]}
                    $fontSize={[16, 18]}
                  >
                    <PortableText value={principle.bodyPortableText} />
                  </Typography>
                </Card>
              </GridArea>
            </Fragment>
          ))}
        </Grid>
        <AboutContactCard />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const aboutPage = await CMSClient.aboutPage({
    previewMode: isPreviewMode,
  });

  return {
    props: {
      pageData: aboutPage,
      isPreviewMode,
      renderPlayer: true,
    },
    revalidate: 10,
  };
};

export default AboutWhoWeAre;
