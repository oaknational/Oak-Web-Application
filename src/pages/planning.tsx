import { FC } from "react";
import { NextPage, GetStaticProps } from "next";
import styled from "styled-components";
import Image from "next/image";
import { PortableText, PortableTextProps } from "@portabletext/react";

import { PlanningPage } from "../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Card, { CardProps } from "../components/Card";
import Flex from "../components/Flex";
import Grid, { GridArea } from "../components/Grid";
import Layout from "../components/Layout";
import { Heading, P } from "../components/Typography";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import Icon from "../components/Icon";
import LessonProgressionGraphic from "../components/LessonProgressionGraphic";
import { IconName } from "../components/Icon/Icon";
import { OakColorName } from "../styles/theme";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import SummaryCard from "../components/Card/SummaryCard";
import lessonPlanning from "../browser-lib/fixtures/lessonPlanning.json";
import Circle from "../components/Circle";
import Box from "../components/Box";
import CardTitle from "../components/Card/CardComponents/CardTitle";
import AnchorTarget from "../components/AnchorTarget";

export type PlanALessonProps = {
  pageData: PlanningPage;
};

const BackgroundImageContainer = styled(Flex)`
  justify-content: center;
  background-image: url("images/pen/loopLarge.svg");
  background-size: 66%;
  background-repeat: no-repeat;
  background-position: center center;
`;

const getLessonElementCards = (
  planningPage: PlanningPage
): {
  id: string;
  icon: IconName;
  title: string;
  portableText: PortableTextProps["value"];
  background?: OakColorName;
}[] => [
  {
    id: "intro-quiz",
    icon: "Quiz",
    title: planningPage.lessonElements.introQuiz.title,
    portableText: planningPage.lessonElements.introQuiz.bodyPortableText,
  },
  {
    id: "video",
    icon: "Video",
    title: planningPage.lessonElements.video.title,
    portableText: planningPage.lessonElements.video.bodyPortableText,
  },
  {
    id: "lesson-slides",
    icon: "LessonSlides",
    title: planningPage.lessonElements.slides.title,
    portableText: planningPage.lessonElements.slides.bodyPortableText,
  },
  {
    id: "worksheet",
    icon: "Worksheet",
    title: planningPage.lessonElements.worksheet.title,
    portableText: planningPage.lessonElements.worksheet.bodyPortableText,
  },
  {
    id: "exit-quiz",
    icon: "Quiz",
    title: planningPage.lessonElements.exitQuiz.title,
    portableText: planningPage.lessonElements.exitQuiz.bodyPortableText,
  },
];

const getLessonPlanningCards = (planningPage: PlanningPage) => {
  /**
   * @todo should we check here that planningPage.steps.length === 4?
   * Since that is what this layout is designed for?
   */

  const getTitle = (i: number) => `${i + 1}. ${planningPage.steps[i]?.title}`;
  const getPortableText = (i: number) =>
    planningPage.steps[i]?.bodyPortableText;

  return [
    {
      id: "find",
      image: "/images/illustrations/calendar.svg",
      title: getTitle(0),
      portableText: getPortableText(0),
    },
    {
      id: "personalise",
      image: "/images/illustrations/atoms.svg",
      title: getTitle(1),
      portableText: getPortableText(1),
    },
    {
      id: "tailor",
      image: "/images/illustrations/test-tubes.svg",
      title: getTitle(2),
      portableText: getPortableText(2),
    },
    {
      id: "teach",
      image: "/images/illustrations/pupils-at-desk.svg",
      title: getTitle(3),
      portableText: getPortableText(3),
      withSearchCTA: true,
    },
  ];
};

const SectionHeader: FC = (props) => {
  return <Box as="header" $width={"100%"} {...props} />;
};

const SectionTitle: FC = (props) => {
  return (
    <Flex
      $justifyContent="center"
      $maxWidth={["100%", "50%"]}
      $mh="auto"
      $pt={80}
      $pb={48}
      $ph={12}
    >
      <Heading $fontSize={24} $textAlign="center" tag="h2" {...props} />
    </Flex>
  );
};

const LessonElementsCard: FC<CardProps> = (props) => (
  <Card
    $alignItems="flex-start"
    $flexDirection="column"
    $pa={[16, 32]}
    {...props}
  />
);

const PlanALesson: NextPage<PlanALessonProps> = ({ pageData }) => {
  console.log(pageData);
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
      <MaxWidth $pt={[72, 80, 80]}>
        <SummaryCard
          title={pageData.title}
          heading={pageData.heading}
          summary={pageData.summaryPortableText}
          imageSrc={"/images/illustrations/planning.svg"}
          alt={"planning illustration"}
          background="teachersPastelYellow"
        />
        {/* Elements of lesson cards */}
        <section>
          <SectionHeader>
            <SectionTitle>
              Choose resources from our lessons to support your planning
            </SectionTitle>
            <Flex
              $flexDirection="column"
              $justifyContent={"center"}
              $alignItems="center"
              $width={"100%"}
              $mb={[0, 48]}
            >
              <LessonProgressionGraphic />
            </Flex>
          </SectionHeader>
          <Grid $cg={24} $rg={[0, 32]}>
            {getLessonElementCards(pageData).map(
              ({ title, portableText, icon, id }) => (
                <GridArea $colSpan={[12, 6]}>
                  <LessonElementsCard $background={"twilight"}>
                    <AnchorTarget id={id} />
                    <Circle
                      size={120}
                      $mb={40}
                      $background={"teachersYellow"}
                      $alignSelf={"center"}
                    >
                      <Icon size={80} name={icon} />
                    </Circle>
                    <CardTitle tag="h3">{title}</CardTitle>
                    <PortableText value={portableText} />
                  </LessonElementsCard>
                </GridArea>
              )
            )}
            <GridArea $colSpan={[12, 6, 6]}>
              <Card
                $justifyContent={"space-between"}
                $background={"pastelTurqoise"}
                $pa={0}
              >
                <Flex>
                  <Image
                    width={300}
                    height={200}
                    alt={"classroom illustration"}
                    src={"/images/illustrations/classroom.svg"}
                  />
                </Flex>
                <Flex $justifyContent={"flex-end"}>
                  <ButtonAsLink
                    icon="Search"
                    label={pageData.lessonElementsCTA.label}
                    href={"/"}
                    $ma={32}
                  />
                </Flex>
              </Card>
            </GridArea>
          </Grid>
        </section>
      </MaxWidth>

      {/* How to plan a lesson */}

      <section>
        <BackgroundImageContainer>
          <MaxWidth $mb={[80, 120]}>
            <SectionHeader>
              <SectionTitle>{pageData.stepsHeading}</SectionTitle>
            </SectionHeader>
            <Grid $cg={24} $rg={0}>
              {getLessonPlanningCards(pageData).map(
                ({ title, portableText, image, withSearchCTA }, i, arr) => {
                  const isFirstOrLast = i === 0 || i == arr.length - 1;
                  return (
                    <GridArea
                      $alignItems={"center"}
                      $justifyContent={"center"}
                      $colSpan={[12, isFirstOrLast ? 12 : 6]}
                    >
                      <Card
                        $width={["100%", isFirstOrLast ? "50%" : "100%"]}
                        $alignItems="flex-start"
                        $flexDirection="column"
                        $pa={[16, 32]}
                      >
                        <Box
                          $position="relative"
                          $height={80}
                          $width="100%"
                          $mb={24}
                        >
                          <Image
                            layout="fill"
                            objectFit="contain"
                            objectPosition="left bottom"
                            src={image}
                          />
                        </Box>

                        <Flex $flexDirection={"column"}>
                          <Heading $mb={24} tag={"h3"} $fontSize={24}>
                            {title}
                          </Heading>
                          <P $fontSize={18}>
                            <PortableText value={portableText} />
                            {withSearchCTA && (
                              <ButtonAsLink
                                label={"Search our lessons"}
                                href={"https://teachers.thenational.academy/"}
                                $mt={24}
                              />
                            )}
                          </P>
                        </Flex>
                      </Card>
                    </GridArea>
                  );
                }
              )}
            </Grid>
          </MaxWidth>
        </BackgroundImageContainer>
      </section>
      <section>
        {/* `Plan for section` */}
        <MaxWidth $mb={120}>
          <SectionHeader>
            <SectionTitle>Use cases</SectionTitle>
          </SectionHeader>
          <Flex $mb={80} $background="teachersPastelYellow">
            <Card $pv={24} $ph={[16, 24]} $flexDirection={["column", "row"]}>
              <Box $minWidth={["50%"]}>
                <Box $display={["block", "none"]}>
                  <CardTitle tag="h4">
                    {pageData.learnMoreBlock1.title}
                  </CardTitle>
                </Box>
                Video placeholder
              </Box>
              <Box $minWidth={["50%"]}>
                <Box $display={["none", "block"]}>
                  <CardTitle tag="h4">
                    {pageData.learnMoreBlock1.title}
                  </CardTitle>
                </Box>
                <PortableText
                  value={pageData.learnMoreBlock1.bodyPortableText}
                />
              </Box>
            </Card>
          </Flex>
          <Card
            $pv={[16, 24]}
            $ph={[0, 32]}
            $flexDirection={["column", "row"]}
            $background={"teachersPastelYellow"}
            $alignItems="flex-end"
          >
            <Box $minWidth={"50%"} $pr={[null, 40]} $mb={[72, 0]} $ph={[16, 0]}>
              <CardTitle tag={"h4"}>{pageData.learnMoreBlock2.title}</CardTitle>
              <PortableText value={pageData.learnMoreBlock2.bodyPortableText} />
            </Box>
            <Box
              $width={["100%", "auto"]}
              $minWidth={"50%"}
              $background="pastelTurqoise"
            >
              <Image
                width={300}
                height={200}
                alt={"classroom illustration"}
                src={"/images/illustrations/classroom.svg"}
              />
              <Flex
                $justifyContent={["center", "flex-end"]}
                $pr={[0, 24]}
                $pb={24}
              >
                <ButtonAsLink
                  label={pageData.lessonElementsCTA.label}
                  href={"/"}
                />
              </Flex>
            </Box>
          </Card>
        </MaxWidth>
      </section>
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
