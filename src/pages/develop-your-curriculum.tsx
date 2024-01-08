import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { Fragment } from "react";

import CMSClient from "@/node-lib/cms";
import { CurriculumPage } from "@/common-lib/cms-types";
import Layout from "@/components/Layout";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import SummaryCard from "@/components/SharedComponents/Card/SummaryCard";
import Typography, {
  Heading,
  P,
} from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import Card from "@/components/SharedComponents/Card";
import Box from "@/components/SharedComponents/Box";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import CardLink from "@/components/SharedComponents/Card/CardLink";
import Grid from "@/components/Grid";
import GridArea from "@/components/Grid/GridArea";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Cover from "@/components/Cover";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Illustration from "@/components/SharedComponents/Illustration";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/PortableText";

export type CurriculumPageProps = {
  pageData: CurriculumPage;
};

const elementsOfCurriculumDesignHeadings = [
  "Revising part of your curriculum:",
  "Rebuilding or changing your curriculum:",
  "An easy way to refresh resources:",
];

const Curriculum: NextPage<CurriculumPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard {...pageData} />
        <Card
          $alignItems={["center", "flex-start"]}
          $mt={[56, 64]}
          $width="100%"
          $mb={[56, 48]}
          $pt={0}
          $ph={[16, 0]}
        >
          <Heading $mb={[48, 32]} $font={["heading-5", "heading-4"]} tag={"h2"}>
            {pageData.info.title}
          </Heading>
          <Flex $minWidth={"50%"} $flexDirection={["column-reverse", "row"]}>
            <Typography $font={["body-2", "body-1"]}>
              <PortableTextWithDefaults
                value={pageData.info.bodyPortableText}
              />
            </Typography>
            <Flex
              $position="relative"
              $alignItems={"center"}
              $justifyContent={"center"}
              $minWidth={"50%"}
              $pb={[48, 0]}
              $ph={32}
            >
              <Illustration
                sizes={getSizes([500, 800])}
                slug="jigsaw-desk"
                $maxWidth={480}
              />
            </Flex>
          </Flex>
        </Card>
        {/* getting started */}
        <Flex $width={"100%"} $justifyContent={"flex-end"}>
          <Card
            $transform={[null, "rotate(2deg) translateY(18px) translateX(5px)"]}
            /** $right: 8 fixes tablet x-overflow */
            $right={[null, 8, null]}
            $zIndex={[null, "inFront"]}
            $pv={24}
            $ph={[16, 24]}
            $background={"pink50"}
            $maxWidth={["100%", "55%"]}
            $font="list-item-1"
          >
            <BrushBorders hideOnMobileH color={"pink50"} />
            <Heading $mb={20} $font={["heading-6", "heading-5"]} tag={"h3"}>
              {pageData.gettingStarted.title}
            </Heading>
            <PortableTextWithDefaults
              value={pageData.gettingStarted.bodyPortableText}
              withoutDefaultComponents
            />
          </Card>
        </Flex>
        <Card $mb={[56, 80]} $width={"100%"} $background={"lemon50"} $ph={0}>
          <Box $ph={[16, 24]} $width={["100%", "50%"]}>
            <Heading
              $mt={[24, 0]}
              $mb={[56, 32]}
              $font={["heading-5", "heading-4"]}
              tag="h4"
            >
              {pageData.elements.title}
            </Heading>
          </Box>
          <Grid $ph={[0, 24]} $cg={16} data-testid="elements-of-curriculum">
            {elementsOfCurriculumDesignHeadings.map((heading, index) => (
              <GridArea
                $display={["none", "block"]}
                key={`${index}-${heading}`}
                $colSpan={[12, 4]}
              >
                <Box $ph={[16, 0]}>
                  <P $mb={[24, 16]} $font={"heading-light-6"}>
                    {heading}
                  </P>
                </Box>
              </GridArea>
            ))}
            {pageData.elements.posts.map((element, index) => (
              <Fragment key={`${index}-${element.title}`}>
                <GridArea $colSpan={[12, 4]}>
                  <BrushBorders hideOnMobileH color={"lemon50"} />
                  <Box $display={["block", "none"]} $ph={[16, 0]}>
                    <P $mb={[24, 16]} $font={"heading-light-6"}>
                      {elementsOfCurriculumDesignHeadings[index]}
                    </P>
                  </Box>
                  <Card
                    $flexDirection={"column"}
                    $justifyContent={"center"}
                    $mb={[56, 0]}
                    $background="aqua"
                    $pv={[72, 80]}
                    $maxHeight={240}
                    $ph={[16, 24]}
                  >
                    <BoxBorders gapPosition="bottomRight" />
                    <Box $mv={12}>
                      <Heading $font={"heading-7"} tag={"h5"}>
                        How to
                        <Box $mt={8} $font={"heading-5"}>
                          <CardLink
                            page="blog-single"
                            blogSlug={element.post.slug}
                          >
                            {element.title}
                          </CardLink>
                        </Box>
                      </Heading>
                    </Box>
                  </Card>
                </GridArea>
              </Fragment>
            ))}
          </Grid>
        </Card>
        <Card
          $pt={0}
          $ph={[16, 0]}
          $mb={[56, 92]}
          $flexDirection={["column", "row"]}
        >
          <Flex
            $position="relative"
            $alignItems={"center"}
            $justifyContent={"center"}
            $minWidth={["100%", "40%"]}
            $height={[240, "auto"]}
            $mb={[48, 0]}
            $mr={[0, 64]}
          >
            <Cover>
              <Illustration
                sizes={getSizes([500, 800])}
                slug="curriculum-approach"
                $objectFit="contain"
                $objectPosition={"center"}
                fill
                alt="Our guiding curriculum principles summarise the important features of great curricula. They are: flexible, accessible, diverse, evidence informed, knowledge and vocabulary rich, sequenced and coherent"
              />
            </Cover>
          </Flex>
          <Flex $flexDirection={"column"}>
            <Heading
              $mb={[48, 32]}
              $font={["heading-5", "heading-4"]}
              tag={"h2"}
            >
              {pageData.ourApproach.title}
            </Heading>
            <Typography $mb={16} $font={"body-1"}>
              <PortableTextWithDefaults
                value={pageData.ourApproach.bodyPortableText}
              />
            </Typography>
            {pageData.ourApproach.cta && (
              <Flex $justifyContent={["center", "flex-start"]}>
                <ButtonAsLink
                  page="oak-curriculum"
                  icon={"arrow-right"}
                  label={pageData.ourApproach.cta?.label}
                />
              </Flex>
            )}
          </Flex>
        </Card>
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<CurriculumPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "develop-your-curriculum::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const curriculumPage = await CMSClient.curriculumPage({
        previewMode: isPreviewMode,
      });

      if (!curriculumPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<CurriculumPageProps> = {
        props: {
          pageData: curriculumPage,
        },
      };
      return results;
    },
  });
};

export default Curriculum;
