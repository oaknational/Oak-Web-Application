import { FC, Fragment } from "react";
import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";

import CMSClient, { AboutWhoWeArePage, TextBlock } from "../../node-lib/cms";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import SummaryCard from "../../components/Card/SummaryCard";
import Flex, { FlexProps } from "../../components/Flex";
import Card from "../../components/Card";
import Box from "../../components/Box";
import Typography, { Heading } from "../../components/Typography";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import OutlineHeading from "../../components/OutlineHeading";
import Grid, { GridArea } from "../../components/Grid";
import AboutContactCard from "../../components/AboutContactCard";
import { reducedAboutNavLinks } from "../../browser-lib/fixtures/aboutNav";
import ButtonLinkNav from "../../components/ButtonLinkNav/ButtonLinkNav";
import { getCTAHref } from "../../utils/portableText/resolveInternalHref";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import CMSVideo from "../../components/CMSVideo";
import BrushBorders from "../../components/SpriteSheet/BrushSvgs/BrushBorders";

export type AboutPageProps = {
  pageData: AboutWhoWeArePage;
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
        <Typography $fontSize={[16, 18]}>
          <PortableText value={bodyPortableText} />
        </Typography>
        {cta && (
          <Flex>
            <ButtonAsLink
              $mt={[36]}
              icon={"ArrowRight"}
              iconPosition={"trailing"}
              label={cta.label}
              href={getCTAHref(cta)}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

const AboutWhoWeAre: NextPage<AboutPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard
          title={"About us"}
          heading={pageData.sectionHeading}
          summary={
            "We’re here to support great teaching. We’re an independent public body. We work in partnership to improve pupil outcomes and close the disadvantage gap by supporting teachers to teach, and enabling pupils to access a high-quality curriculum."
          }
          background={"teachersPastelYellow"}
          imageProps={{
            src: "/images/oak-logo.svg",
            alt: "who we are illustration",
          }}
          imageContainerProps={{
            $minHeight: 220,
            $mr: 32,
          }}
        >
          <ButtonLinkNav
            $mt={36}
            buttons={reducedAboutNavLinks}
            selected={"Who we are"}
          />
        </SummaryCard>
        <Flex $mt={92} $mb={[80, 92]} $background="twilight">
          <Card
            $pv={32}
            $ph={[16, 24]}
            $flexDirection={["column", "column", "row"]}
            $maxWidth={["100%", 812, "100%"]}
          >
            <BrushBorders hideOnMobileH color={"twilight"} />
            <Flex
              $justifyContent={"center"}
              $alignItems={"center"}
              $pb={[24, 24, 0]}
              $pr={[0, 0, 72]}
              $minWidth={["50%"]}
            >
              {pageData.intro.mediaType == "video" && (
                <CMSVideo video={pageData.intro.video} />
              )}
            </Flex>
            <Box $minWidth={["50%"]}>
              <Typography
                $mb={36}
                $fontSize={[16, 18]}
                $lineHeight={["24px", "28px"]}
              >
                <PortableText value={pageData.intro.bodyPortableText} />
              </Typography>
              <Flex $justifyContent={"flex-start"}>
                {pageData.intro.cta && (
                  <ButtonAsLink
                    icon={"ArrowRight"}
                    iconPosition="trailing"
                    label={pageData.intro.cta.label}
                    href={getCTAHref(pageData.intro.cta)}
                  />
                )}
              </Flex>
            </Box>
          </Card>
        </Flex>
        <TimeLineCard
          bodyPortableText={pageData.timeline.from.bodyPortableText}
          title={pageData.timeline.from.title}
          $alignItems={"flex-start"}
        />
        <TimeLineCard
          bodyPortableText={pageData.timeline.to.bodyPortableText}
          title={pageData.timeline.to.title}
          $alignItems={["flex-start", "center"]}
        />
        <TimeLineCard
          bodyPortableText={pageData.timeline.beyond.bodyPortableText}
          title={pageData.timeline.beyond.title}
          cta={pageData.timeline.beyond.cta}
          $alignItems={["flex-start", "flex-end"]}
        />
        <Grid $mb={80} $cg={28} $rg={32}>
          {pageData.principles.map((principle) => (
            <Fragment key={principle.title}>
              <GridArea $colSpan={[12, 6]}>
                <Card $background={"videoBlue"}>
                  <BrushBorders
                    hideOnMobileH
                    hideOnMobileV
                    color={"videoBlue"}
                  />
                  <Heading
                    $fontSize={[24, 32]}
                    $lineHeight={["32px", "40px"]}
                    tag={"h2"}
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

  const aboutWhoWeArePage = await CMSClient.aboutWhoWeArePage({
    previewMode: isPreviewMode,
  });

  if (!aboutWhoWeArePage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: aboutWhoWeArePage,
    },
    revalidate: 10,
  };
};

export default AboutWhoWeAre;
