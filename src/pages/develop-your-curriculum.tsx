import { NextPage, GetStaticProps } from "next";
import styled from "styled-components";
import { PortableText } from "@portabletext/react";

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

const RotatedCard = styled(Card)`
  transform: rotate(2deg);
`;

export type CurriculumPageProps = {
  pageData: CurriculumPage;
  isPreviewMode: boolean;
};

const Curriculum: NextPage<CurriculumPageProps> = ({
  pageData,
  isPreviewMode,
}) => {
  console.log(pageData);
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard
          title={pageData.title}
          heading={pageData.title}
          summary={pageData.summaryPortableText}
          background={"teachersPastelYellow"}
          imageSrc={"/images/illustrations/curriculum.svg"}
          alt={"Develop Your Curriculum illustration"}
        ></SummaryCard>

        <Card
          $alignItems={["center", "flex-start"]}
          $mt={[56, 72]}
          $width="100%"
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
        <Flex $justifyContent={"flex-end"}>
          <RotatedCard $background={"twilight"} $maxWidth={"50%"}>
            <Heading $fontSize={[20, 24]} tag={"h4"}>
              {pageData.gettingStarted.title}
            </Heading>
            <Typography>
              <PortableText
                value={pageData.gettingStarted.bodyPortableText}
              ></PortableText>
            </Typography>
          </RotatedCard>
        </Flex>
        <Card $width={"100%"} $background={"teachersPastelYellow"}>
          <Box $pr={12} $width={"50%"}>
            <Heading $mb={32} $fontSize={[24, 32]} tag="h4"></Heading>
          </Box>
          <Flex>
            {pageData.elements.posts.map((post) => (
              <Flex $mr={16} $flexGrow={1} $flexDirection={"column"}>
                <P $mb={16} $fontSize={20} $lineHeight={"24px"}>
                  {post.post.title}
                </P>
                <Card
                  $flexDirection={"column"}
                  $justifyContent={"center"}
                  $alignItems={"center"}
                >
                  <BoxBorders />
                  <Heading $fontSize={16} tag="h4">
                    How to
                  </Heading>
                  <Heading $fontSize={24} tag="h4">
                    Design a unit of study
                  </Heading>
                </Card>
              </Flex>
            ))}

            <Flex $mr={16} $flexGrow={1} $flexDirection={"column"}>
              <P $mb={16} $fontSize={20} $lineHeight={"24px"}>
                Revising part of your Curriculum:
              </P>
              <Card
                $flexDirection={"column"}
                $justifyContent={"center"}
                $alignItems={"center"}
              >
                <BoxBorders />
                <Heading $fontSize={16} tag="h4">
                  How to
                </Heading>
                <Heading $fontSize={24} tag="h4">
                  Design a unit of study
                </Heading>
              </Card>
            </Flex>
            <Flex $flexGrow={1} $flexDirection={"column"}>
              <P $mb={16} $fontSize={20} $lineHeight={"24px"}>
                Revising part of your Curriculum:
              </P>
              <Card
                $flexDirection={"column"}
                $justifyContent={"center"}
                $alignItems={"center"}
              >
                <BoxBorders />
                <Heading $fontSize={16} tag="h4">
                  How to
                </Heading>
                <Heading $fontSize={24} tag="h4">
                  Design a unit of study
                </Heading>
              </Card>
            </Flex>
          </Flex>
        </Card>
        <P>{pageData.ourApproach.title}</P>
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
  };
};

export default Curriculum;
