import { FC, Fragment } from "react";
import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";

import CMSClient from "@/node-lib/cms";
import { AboutWhoWeArePage, TextBlock } from "@/common-lib/cms-types";
import { decorateWithIsr } from "@/node-lib/isr";
import Layout from "@/components/SharedComponents/Layout";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex";
import Card from "@/components/SharedComponents/Card";
import Box from "@/components/SharedComponents/Box";
import Typography, { Heading } from "@/components/SharedComponents/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

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
        <OutlineHeading $mb={[32, 0]} $fontSize={[50, 100]} tag={"h3"}>
          {title}
        </OutlineHeading>
        <Typography $font={["body-2", "body-1"]}>
          <PortableTextWithDefaults value={bodyPortableText} />
        </Typography>
        {cta && (
          <Flex>
            <ButtonAsLink
              $mt={[36]}
              icon={"arrow-right"}
              $iconPosition={"trailing"}
              label={cta.label}
              page={null}
              href={getLinkHref(cta)}
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
      <MaxWidth $mb={[56, 80]} $pt={[64, 80]} $alignItems={"center"}>
        <GenericSummaryCard {...pageData} />
        <Card
          $pv={32}
          $ph={[16, 24]}
          $flexDirection={["column", "column", "row"]}
          $mb={[80, 92]}
          $background="pink50"
          $maxWidth={["100%", 812, "100%"]}
          $mt={92}
        >
          <BrushBorders hideOnMobileH color={"pink50"} />
          <Flex
            $justifyContent={"center"}
            $alignItems={"center"}
            $pb={[24, 24, 0]}
            $pr={[0, 0, 72]}
            $minWidth={["50%"]}
          >
            {pageData.intro.mediaType == "video" && (
              <CMSVideo video={pageData.intro.video} location="marketing" />
            )}
          </Flex>
          <Box $minWidth={["50%"]}>
            <Typography $mb={36} $font={["body-2", "body-1"]}>
              <PortableTextWithDefaults
                value={pageData.intro.bodyPortableText}
              />
            </Typography>
            <Flex $justifyContent={"flex-start"}>
              {pageData.intro.cta && (
                <ButtonAsLink
                  icon={"arrow-right"}
                  $iconPosition="trailing"
                  label={pageData.intro.cta.label}
                  page={null}
                  href={getLinkHref(pageData.intro.cta)}
                />
              )}
            </Flex>
          </Box>
        </Card>
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
                <Card $ph={[16, 24]} $background={"aqua"}>
                  <BrushBorders hideOnMobileH hideOnMobileV color={"aqua"} />
                  <Heading
                    $font={["heading-5", "heading-4"]}
                    tag={"h3"}
                    $mb={[24]}
                  >
                    {principle.title}
                  </Heading>
                  <Typography $font={["body-2", "body-1"]}>
                    <PortableTextWithDefaults
                      value={principle.bodyPortableText}
                    />
                  </Typography>
                </Card>
              </GridArea>
            </Fragment>
          ))}
        </Grid>
        <GenericContactCard {...pageData.contactSection} />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "who-are-we::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const aboutWhoWeArePage = await CMSClient.aboutWhoWeArePage({
        previewMode: isPreviewMode,
      });

      if (!aboutWhoWeArePage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<AboutPageProps> = {
        props: {
          pageData: aboutWhoWeArePage,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default AboutWhoWeAre;
