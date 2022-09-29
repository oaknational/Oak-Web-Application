import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

import CMSClient, { CurriculumPage } from "../node-lib/cms";
import Layout from "../components/Layout";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import SummaryCard from "../components/Card/SummaryCard";
import { Heading, P } from "../components/Typography";
import Flex from "../components/Flex";
import CardImage from "../components/Card/CardComponents/CardImage";
import Typography from "../components/Typography/Typography";
import Card from "../components/Card";
import Box from "../components/Box";
import BoxBorders from "../components/SpriteSheet/BrushSvgs/BoxBorders";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import CardLink from "../components/Card/CardLink";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import { getSeoProps } from "../browser-lib/seo/getSeoProps";
import Cover from "../components/Cover";
import BrushBorders from "../components/SpriteSheet/BrushSvgs/BrushBorders";
import OakImage from "../components/OakImage";
import config from "../config";

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
        <SummaryCard
          title={pageData.title}
          heading={pageData.heading}
          summary={pageData.summaryPortableText}
          imageProps={{
            src: "/images/illustrations/curriculum-371.png",
            alt: "Develop Your Curriculum illustration",
          }}
        />
        <Card
          $alignItems={["center", "flex-start"]}
          $mt={[56, 64]}
          $width="100%"
          $mb={[56, 48]}
          $pt={0}
          $ph={[16, 0]}
        >
          <Heading $mb={[48, 32]} $font={["heading-5", "heading-4"]} tag={"h3"}>
            {pageData.info.title}
          </Heading>
          <Flex $minWidth={"50%"} $flexDirection={["column-reverse", "row"]}>
            <Typography $font={["body-2", "body-1"]}>
              <PortableText value={pageData.info.bodyPortableText} />
            </Typography>
            <Flex
              $alignItems={"center"}
              $justifyContent={"center"}
              $minWidth={"50%"}
              $pb={[48, 0]}
            >
              <CardImage
                alt={"curriculum design illustration"}
                imageSrc={"/images/illustrations/curriculum-design-800.png"}
                position={"center center"}
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
            $background={"twilight"}
            $maxWidth={["100%", "55%"]}
            $font="list-item-1"
          >
            <BrushBorders hideOnMobileH color={"twilight"} />
            <Heading $mb={20} $font={["heading-6", "heading-5"]} tag={"h3"}>
              {pageData.gettingStarted.title}
            </Heading>
            <PortableText value={pageData.gettingStarted.bodyPortableText} />
          </Card>
        </Flex>
        <Card
          $mb={[56, 80]}
          $width={"100%"}
          $background={"teachersPastelYellow"}
          $ph={0}
        >
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
                  <BrushBorders hideOnMobileH color={"teachersPastelYellow"} />
                  <Box $display={["block", "none"]} $ph={[16, 0]}>
                    <P $mb={[24, 16]} $font={"heading-light-6"}>
                      {elementsOfCurriculumDesignHeadings[index]}
                    </P>
                  </Box>
                  <Card
                    $flexDirection={"column"}
                    $justifyContent={"center"}
                    $mb={[56, 0]}
                    $background="pastelTurqoise"
                    $pv={[72, 80]}
                    $maxHeight={240}
                    $ph={[16, 24]}
                  >
                    <BoxBorders gapPosition="bottomRight" />
                    <Box $mv={12}>
                      <Heading $font={"heading-7"} tag={"h3"}>
                        How to
                        <Box $mt={8} $font={"heading-5"}>
                          <CardLink page="blog" slug={element.post.slug}>
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
              <OakImage
                $objectFit="contain"
                $objectPosition={"center"}
                aria-hidden={true}
                fill
                alt={"curriculum design illustration"}
                src={"/images/illustrations/curriculum-approach.svg"}
              />
            </Cover>
          </Flex>
          <Flex $flexDirection={"column"}>
            <Heading
              $mb={[48, 32]}
              $font={["heading-5", "heading-4"]}
              tag={"h3"}
            >
              {pageData.ourApproach.title}
            </Heading>
            <Typography $mb={16} $font={"body-1"}>
              <PortableText value={pageData.ourApproach.bodyPortableText} />
            </Typography>
            {pageData.ourApproach.cta && (
              <Flex $justifyContent={["center", "flex-start"]}>
                <ButtonAsLink
                  icon={"ArrowRight"}
                  label={pageData.ourApproach.cta?.label}
                  href={"https://teachers.thenational.academy/oaks-curricula"}
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
  context
) => {
  const isPreviewMode = context.preview === true;

  const curriculumPage = await CMSClient.curriculumPage({
    previewMode: isPreviewMode,
  });

  if (!curriculumPage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: curriculumPage,
    },
    revalidate: config.get("sanityRevalidateSeconds"),
  };
};

export default Curriculum;
