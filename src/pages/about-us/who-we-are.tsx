import { FC, Fragment } from "react";
import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakGridAreaProps,
  OakMaxWidth,
  OakTypography,
  OakHeading,
} from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import { AboutWhoWeArePage, TextBlock } from "@/common-lib/cms-types";
import { decorateWithIsr } from "@/node-lib/isr";
import Layout from "@/components/AppComponents/Layout";
import Card from "@/components/SharedComponents/Card";
import Box from "@/components/SharedComponents/Box";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading";
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
            <OakFlex>
              <ButtonAsLink
                $mt={[36]}
                icon={"arrow-right"}
                $iconPosition={"trailing"}
                label={cta.label}
                page={null}
                href={getLinkHref(cta)}
              />
            </OakFlex>
          )}
        </OakGridArea>
      </OakGrid>
    </OakFlex>
  );
};

const AboutWhoWeAre: NextPage<AboutPageProps> = ({ pageData }) => {
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
          $flexDirection={["column", "column", "row"]}
          $mb={[80, 92]}
          $background="pink50"
          $maxWidth={["100%", 812, "100%"]}
          $mt={92}
        >
          <BrushBorders hideOnMobileH color={"pink50"} />
          <OakFlex
            $gap={["space-between-m", "space-between-m", "space-between-xxl"]}
            $flexDirection={["column", "column", "row"]}
          >
            <OakFlex $justifyContent={"center"} $alignItems={"center"}>
              {pageData.intro.mediaType == "video" && (
                <CMSVideo video={pageData.intro.video} location="marketing" />
              )}
            </OakFlex>
            <Box $width={["100%", "100%", "50%"]}>
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
                  <ButtonAsLink
                    icon={"arrow-right"}
                    $iconPosition="trailing"
                    label={pageData.intro.cta.label}
                    page={null}
                    href={getLinkHref(pageData.intro.cta)}
                  />
                )}
              </OakFlex>
            </Box>
          </OakFlex>
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
