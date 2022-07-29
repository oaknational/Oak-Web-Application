import { FC } from "react";
import { NextPage, GetStaticProps } from "next";
import styled from "styled-components";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CMSClient, { PlanningPage } from "../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Card from "../components/Card";
import Flex from "../components/Flex";
import Grid, { GridArea } from "../components/Grid";
import Layout from "../components/Layout";
import { Heading, P } from "../components/Typography";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import { getBreakpoint } from "../styles/utils/responsive";
import Icon from "../components/Icon";
import LessonProgressionGraphic from "../components/LessonProgressionGraphic";
import { IconName } from "../components/Icon/Icon";
import { OakColorName } from "../styles/theme";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import SummaryCard from "../components/Card/SummaryCard";
import { SizeValues } from "../styles/utils/size";
import lessonPlanning from "../browser-lib/fixtures/lessonPlanning.json";

export type PlanALessonProps = {
  pageData: PlanningPage;
};

const SpanLink = styled.span`
  scroll-margin-top: ${({ theme }) => theme.header.height + 12}px;

  @media (max-width: ${getBreakpoint("small")}px) {
    scroll-margin-top: ${({ theme }) => theme.header.height + 92}px;
  }
`;

const BackgroundImageContainer = styled(Flex)`
  justify-content: center;
  background-image: url("images/pen/loopLarge.svg");
  background-size: 66%;
  background-repeat: no-repeat;
  background-position: center center;
`;

const CircleIconContainer = styled(Flex)`
  border-radius: 100px;
  width: 124px;
  height: 124px;
`;

type LessonPlanningCardProps = {
  title?: string;
  icon?: IconName;
  image?: string;
  pageAnchorId?: string;
  background?: OakColorName;
  width?: SizeValues;
  alignCenter?: boolean;
};

const LessonPlanningCard: FC<LessonPlanningCardProps> = ({
  title,
  icon,
  image,
  children,
  pageAnchorId,
  background,
  width,
  alignCenter,
}) => {
  return (
    <Card
      $width={width}
      $alignItems={alignCenter ? "center" : "flex-start"}
      $flexDirection={["row", "column"]}
      $pa={32}
      $background={background}
    >
      {pageAnchorId && <SpanLink id={pageAnchorId}></SpanLink>}
      {icon && (
        <CircleIconContainer
          $background={"teachersYellow"}
          $alignItems={"center"}
          $justifyContent={"center"}
        >
          <Icon size={80} name={icon} />
        </CircleIconContainer>
      )}
      <Flex>
        {image && <Image width={"200px"} height={"150px"} src={image}></Image>}
      </Flex>

      <Flex $ml={[24, 0, 0]} $mt={[0, 24, 24]} $flexDirection={"column"}>
        <Heading $mb={24} tag={"h3"} $fontSize={[16, 24]}>
          {title}
        </Heading>
        <P $fontSize={[14, 16]}>{children}</P>
      </Flex>
    </Card>
  );
};

const PlanALesson: NextPage<PlanALessonProps> = ({ pageData }) => {
  console.log(pageData);
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <MaxWidth>
        <SummaryCard
          title={pageData.title}
          heading={pageData.heading}
          summary={pageData.summaryPortableText}
          imageSrc={"/images/illustrations/planning.svg"}
          alt={"planning illustration"}
          background="teachersPastelYellow"
        />
        <Grid $cg={24} $rg={[16, 32, 32]}>
          <GridArea $colSpan={[12, 12, 12]}></GridArea>
        </Grid>

        {/* Elements of lesson cards */}
        <Flex $justifyContent={"center"} $width={"100%"}>
          <LessonProgressionGraphic></LessonProgressionGraphic>
        </Flex>

        <Grid $cg={24} $rg={[16, 32, 32]}>
          <GridArea $colSpan={[12, 6, 6]}>
            <LessonPlanningCard
              title={pageData.lessonElements.introQuiz.title}
              icon={"Quiz"}
              pageAnchorId={"intro-quiz"}
              background="pastelTurqoise"
              alignCenter
            >
              <PortableText
                value={pageData.lessonElements.introQuiz.bodyPortableText}
              />
            </LessonPlanningCard>
          </GridArea>
          <GridArea $colSpan={[12, 6, 6]}>
            <LessonPlanningCard
              title={pageData.lessonElements.video.title}
              icon={"Video"}
              pageAnchorId={"video"}
              background="pastelTurqoise"
              alignCenter
            >
              <PortableText
                value={pageData.lessonElements.video.bodyPortableText}
              />
            </LessonPlanningCard>
          </GridArea>
          <GridArea $colSpan={[12, 6, 6]}>
            <LessonPlanningCard
              title={pageData.lessonElements.slides.title}
              icon={"LessonSlides"}
              pageAnchorId={"lesson-slides"}
              background="pastelTurqoise"
              alignCenter
            >
              <PortableText
                value={pageData.lessonElements.slides.bodyPortableText}
              />
            </LessonPlanningCard>
          </GridArea>
          <GridArea $colSpan={[12, 6, 6]}>
            <LessonPlanningCard
              title={pageData.lessonElements.worksheet.title}
              icon={"Worksheet"}
              pageAnchorId={"worksheet"}
              background="pastelTurqoise"
              alignCenter
            >
              <PortableText
                value={pageData.lessonElements.worksheet.bodyPortableText}
              />
            </LessonPlanningCard>
          </GridArea>
          <GridArea $colSpan={[12, 6, 6]}>
            <LessonPlanningCard
              title={pageData.lessonElements.exitQuiz.title}
              icon={"Quiz"}
              pageAnchorId={"exit-quiz"}
              background="pastelTurqoise"
              alignCenter
            >
              <PortableText
                value={pageData.lessonElements.exitQuiz.bodyPortableText}
              />
            </LessonPlanningCard>
          </GridArea>

          <GridArea $colSpan={[12, 6, 6]}>
            <Card
              $justifyContent={"space-between"}
              $background={"grey7"}
              $pa={0}
            >
              <Flex>
                <Image
                  width={300}
                  height={200}
                  alt={"classroom illustration"}
                  src={"/images/illustrations/classroom.svg"}
                ></Image>
              </Flex>
              <Flex $justifyContent={"flex-end"}>
                <ButtonAsLink
                  label={pageData.lessonElementsCTA.label}
                  href={"/"}
                  $ma={32}
                />
              </Flex>
            </Card>
          </GridArea>
        </Grid>
      </MaxWidth>

      {/* How to plan a lesson */}

      <BackgroundImageContainer>
        <MaxWidth>
          <Grid $cg={24} $rg={[16, 32, 32]}>
            <GridArea
              $alignItems={"center"}
              $justifyContent={"center"}
              $colSpan={[12, 12, 12]}
            >
              <Flex $width={["100%", "50%"]}>
                <Heading
                  textAlign="center"
                  $color={"black"}
                  $lineHeight={32}
                  $fontSize={[16, 24]}
                  tag={"h3"}
                  $mv={80}
                >
                  {pageData.stepsHeading}
                </Heading>
              </Flex>

              <LessonPlanningCard
                title={`1. ${pageData.steps[0]?.title}`}
                image={"/images/illustrations/classroom.svg"}
                width={"50%"}
              >
                <PortableText value={pageData.steps[0]?.bodyPortableText} />
              </LessonPlanningCard>
            </GridArea>
            <GridArea $colSpan={[12, 6, 6]}>
              <LessonPlanningCard
                title={`2. ${pageData.steps[1]?.title}`}
                image={"/images/illustrations/classroom.svg"}
              >
                <PortableText value={pageData.steps[1]?.bodyPortableText} />
              </LessonPlanningCard>
            </GridArea>
            <GridArea $colSpan={[12, 6, 6]}>
              <LessonPlanningCard
                title={`3. ${pageData.steps[2]?.title}`}
                image={"/images/illustrations/classroom.svg"}
              >
                <PortableText value={pageData.steps[2]?.bodyPortableText} />
              </LessonPlanningCard>
            </GridArea>
            <GridArea
              $alignItems={"center"}
              $justifyContent={"center"}
              $colSpan={[12, 12, 12]}
            >
              <LessonPlanningCard
                title={`4. ${pageData.steps[3]?.title}`}
                image={"/images/illustrations/classroom.svg"}
                width={"50%"}
                alignCenter={true}
              >
                <PortableText value={pageData.steps[3]?.bodyPortableText} />
              </LessonPlanningCard>
              <ButtonAsLink
                label={"Search our lessons"}
                href={"https://teachers.thenational.academy/"}
              ></ButtonAsLink>
            </GridArea>
          </Grid>
        </MaxWidth>
      </BackgroundImageContainer>

      {/* `Plan for section` */}
      <MaxWidth>
        <Flex $justifyContent={"center"} $alignItems={"center"}>
          <Flex $maxWidth={"50%"}>
            <Heading textAlign="center" $fontSize={[16, 24]} tag="h4">
              How to plan a lesson using our resources and adapt them for your
              classroom.
            </Heading>
          </Flex>
        </Flex>
        <Flex $mb={80} $background={"teachersGreen"}>
          <Card color="grey8" $justifyContent={"center"} $alignItems={"center"}>
            Video
          </Card>
          <Card $pa={32} $maxWidth={"50%"}>
            <Heading
              textAlign="center"
              $mb={16}
              $fontSize={[16, 24]}
              tag={"h4"}
            >
              {pageData.learnMoreBlock1.title}
            </Heading>

            <P $mb={16}>
              <PortableText value={pageData.learnMoreBlock1.bodyPortableText} />
            </P>
          </Card>
        </Flex>
        <Flex $background={"grey4"}>
          <Card $pa={32} $maxWidth={"50%"}>
            <Heading
              textAlign="center"
              $mb={16}
              $fontSize={[16, 24]}
              tag={"h4"}
            >
              {pageData.learnMoreBlock2.title}
            </Heading>

            <P $mb={16}>
              <PortableText value={pageData.learnMoreBlock2.bodyPortableText} />
            </P>
          </Card>
          <Flex $flexGrow={1} $pa={32}>
            <Card $justifyContent={"space-between"} $background={"grey7"}>
              <Flex>
                <Image
                  width={300}
                  height={200}
                  alt={"classroom illustration"}
                  src={"/images/illustrations/classroom.svg"}
                ></Image>
              </Flex>
              <Flex $justifyContent={"flex-end"}>
                <ButtonAsLink
                  label={pageData.lessonElementsCTA.label}
                  href={"/"}
                />
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </MaxWidth>
    </Layout>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getStaticProps: GetStaticProps<PlanALessonProps> = async () => {
  // const planningPage = await CMSClient.planningPage();
  // const planningPage = lessonPlanning;

  return {
    props: {
      pageData: lessonPlanning,
    },
  };
};

export default PlanALesson;
