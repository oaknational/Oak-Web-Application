import { NextPage, GetStaticProps } from "next";
import styled from "styled-components";
import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

import { getBreakpoint } from "../styles/utils/responsive";
import CMSClient, { CurriculumPage } from "../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
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

const RotatedCard = styled(Card)`
  @media (min-width: ${getBreakpoint("small")}px) {
    transform: rotate(2deg) translateY(18px);
    z-index: 1;
  }
`;

export type CurriculumPageProps = {
  pageData: CurriculumPage;
  isPreviewMode: boolean;
};

const elementsOfCurriculumDesignHeadings = [
  "Revising part of your Curriculum:",
  "Rebuilding or changing your curriculum:",
  "An easy way to refresh resources:",
];

const Curriculum: NextPage<CurriculumPageProps> = ({
  pageData,
  isPreviewMode,
}) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard
          title={pageData.title}
          heading={pageData.heading}
          summary={pageData.summaryPortableText}
          cardImageProps={{
            imageSrc: "/images/illustrations/curriculum.svg",
            alt: "Develop Your Curriculum illustration",
          }}
        />
        <Card
          $alignItems={["center", "flex-start"]}
          $mt={[56, 64]}
          $width="100%"
          $mb={[56, 48]}
          $pt={0}
        >
          <Heading $mb={[48, 32]} $fontSize={[24, 32]} tag={"h3"}>
            {pageData.info.title}
          </Heading>
          <Flex $minWidth={"50%"} $flexDirection={["column-reverse", "row"]}>
            <Typography $lineHeight={["24px", "28px"]} $fontSize={[16, 18]}>
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
                imageSrc={"/images/illustrations/curriculum-design.svg"}
                position={"center center"}
              />
            </Flex>
          </Flex>
        </Card>
        {/* getting started */}
        <Flex $width={"100%"} $justifyContent={"flex-end"}>
          <RotatedCard
            $pv={24}
            $ph={[16, 24]}
            $background={"twilight"}
            $maxWidth={["100%", "50%"]}
          >
            <Heading $mb={20} $fontSize={[20, 24]} tag={"h3"}>
              {pageData.gettingStarted.title}
            </Heading>
            <Typography>
              <PortableText value={pageData.gettingStarted.bodyPortableText} />
            </Typography>
          </RotatedCard>
        </Flex>
        <Card
          $mb={[56, 80]}
          $width={"100%"}
          $background={"teachersPastelYellow"}
          $ph={0}
        >
          <Box $ph={[16, 24]} $pr={12} $width={["100%", "50%"]}>
            <Heading $mt={[24, 0]} $mb={[56, 32]} $fontSize={[24, 32]} tag="h4">
              {pageData.elements.title}
            </Heading>
          </Box>
          <Flex $flexDirection={["column", "row"]}>
            {pageData.elements.posts.map((element, index) => (
              <Fragment key={element.post.slug.current}>
                <Flex
                  $mr={[
                    0,
                    index == pageData.elements.posts.length - 1 ? 24 : 16,
                  ]}
                  $flexGrow={1}
                  $flexDirection={"column"}
                >
                  <Box $ph={[16, 0]}>
                    <P
                      $ml={[0, index == 0 ? 24 : 0]}
                      $mb={[24, 16]}
                      $fontSize={20}
                      $lineHeight={"24px"}
                    >
                      {elementsOfCurriculumDesignHeadings[index]}
                    </P>
                  </Box>
                  <Card
                    $flexDirection={"column"}
                    $justifyContent={"center"}
                    $mb={[56, 0]}
                    $background="pastelTurqoise"
                    $pv={[72, 80]}
                    $ml={[0, index == 0 ? 24 : 0]}
                  >
                    <CardLink href={`/blog/${element.post.slug.current}`} />
                    <BoxBorders />
                    <Box $mv={12}>
                      <Heading $mb={8} $fontSize={16} tag={"h3"}>
                        How to
                      </Heading>
                      <Heading $fontSize={24} tag="h4">
                        {element.post.title}
                      </Heading>
                    </Box>
                  </Card>
                </Flex>
              </Fragment>
            ))}
          </Flex>
        </Card>
        <Card $mb={[56, 92]} $flexDirection={["column", "row"]}>
          <Flex
            $alignItems={"center"}
            $justifyContent={"center"}
            $minWidth={"50%"}
            $pb={[48, 0]}
          >
            <CardImage
              alt={"curriculum design illustration"}
              imageSrc={"/images/illustrations/curriculum-approach.svg"}
              position={"center center"}
            />
          </Flex>
          <Flex $flexDirection={"column"}>
            <Heading $mb={[48, 32]} $fontSize={[24, 32]} tag={"h3"}>
              {pageData.ourApproach.title}
            </Heading>
            <Typography $mb={16} $lineHeight={["28px", "32px"]} fontSize={18}>
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

  return {
    props: {
      pageData: curriculumPage,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default Curriculum;
