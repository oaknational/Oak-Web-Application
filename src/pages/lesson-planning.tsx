import { FC } from "react";
import { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

import CMSClient, { PlanningPage, PortableTextJSON } from "../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Card, { CardProps } from "../components/Card";
import Flex from "../components/Flex";
import Grid, { GridArea } from "../components/Grid";
import Layout from "../components/Layout";
import Typography, { Heading, P } from "../components/Typography";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import Icon, { IconName } from "../components/Icon";
import LessonElementLinks from "../components/LessonElementLinks";
import { OakColorName } from "../styles/theme";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import SummaryCard from "../components/Card/SummaryCard";
import Circle from "../components/Circle";
import Box from "../components/Box";
import CardTitle from "../components/Card/CardComponents/CardTitle";
import AnchorTarget from "../components/AnchorTarget";
import Cover from "../components/Cover";
import { getTeachersUrl } from "../common-lib/urls";
import VideoPlayer from "../components/VideoPlayer";

export type PlanALessonProps = {
  pageData: PlanningPage;
  isPreviewMode: boolean;
};

const lessonElementIds = {
  introQuiz: "intro-quiz",
  video: "video",
  slides: "lesson-slides",
  worksheet: "worksheet",
  exitQuiz: "exit-quiz",
};

const getLessonElementCards = (
  planningPage: PlanningPage
): {
  id: string;
  icon: IconName;
  title: string;
  portableText: PortableTextJSON;
  background?: OakColorName;
}[] => [
  {
    id: lessonElementIds.introQuiz,
    icon: "Quiz",
    title: planningPage.lessonElements.introQuiz.title,
    portableText: planningPage.lessonElements.introQuiz.bodyPortableText,
  },
  {
    id: lessonElementIds.video,
    icon: "Video",
    title: planningPage.lessonElements.video.title,
    portableText: planningPage.lessonElements.video.bodyPortableText,
  },
  {
    id: lessonElementIds.slides,
    icon: "Presentation",
    title: planningPage.lessonElements.slides.title,
    portableText: planningPage.lessonElements.slides.bodyPortableText,
  },
  {
    id: lessonElementIds.worksheet,
    icon: "Worksheet",
    title: planningPage.lessonElements.worksheet.title,
    portableText: planningPage.lessonElements.worksheet.bodyPortableText,
  },
  {
    id: lessonElementIds.exitQuiz,
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
      $pt={[56, 80]}
      $pb={48}
      $ph={12}
      $mt={12}
    >
      <Heading $fontSize={[20, 24]} $textAlign="center" tag="h2" {...props} />
    </Flex>
  );
};

const LessonElementsCard: FC<CardProps> = (props) => (
  <Card
    $alignItems="flex-start"
    $flexDirection="column"
    $ph={[16, 24]}
    $pv={24}
    {...props}
  />
);

const PlanALesson: NextPage<PlanALessonProps> = ({
  pageData,
  isPreviewMode,
}) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth $pt={[72, 80, 80]}>
        <SummaryCard
          title={pageData.title}
          heading={pageData.heading}
          summary={pageData.summaryPortableText}
          imageProps={{
            src: "/images/illustrations/planning.png",
            alt: "planning illustration",
          }}
          imageContainerProps={{
            $minHeight: 160,
          }}
        />
        {/* Elements of lesson cards */}
        <section>
          <SectionHeader>
            <Flex
              $justifyContent="center"
              $maxWidth={["100%", "50%"]}
              $mh="auto"
              $pt={64}
              $pb={48}
              $ph={12}
            >
              <Heading $fontSize={24} $textAlign="center" tag="h2">
                Choose from our resources to support your planning
              </Heading>
            </Flex>
            <Flex
              $flexDirection="column"
              $justifyContent={"center"}
              $alignItems="center"
              $width={"100%"}
              $mb={[0, 48]}
            >
              <LessonElementLinks linkTargetIds={lessonElementIds} />
            </Flex>
          </SectionHeader>
          <Grid $cg={16} $rg={[32]}>
            {getLessonElementCards(pageData).map(
              ({ title, portableText, icon, id }) => (
                <GridArea
                  key={`plan-a-lessing--element-card--${id}`}
                  $colSpan={[12, 6]}
                >
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
                    <CardTitle fontSize={[24, 32]} tag="h3">
                      {title}
                    </CardTitle>
                    <Typography $fontSize={18} $lineHeight={"28px"}>
                      <PortableText value={portableText} />
                    </Typography>
                  </LessonElementsCard>
                </GridArea>
              )
            )}
            <GridArea $colSpan={[12, 6]}>
              <Card
                $position="relative"
                $width={["100%", "auto"]}
                $minWidth={"50%"}
                $height={[360, 240]}
                $background="pastelTurqoise"
                $justifyContent={"flex-end"}
                $alignItems={["center", "center", "flex-end"]}
                $pr={[0, 24]}
                $pb={24}
                $pa={0}
              >
                <Cover
                  $right={[0, 0, "50%"]}
                  $left={[0, 0, 32]}
                  $top={48}
                  $bottom={[92, 92, 20]}
                >
                  <Image
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center bottom"
                    alt=""
                    src={"/images/illustrations/teacher-carrying-stuff.png"}
                  />
                </Cover>
                <ButtonAsLink
                  icon="Search"
                  iconPosition="trailing"
                  label={pageData.lessonElementsCTA.label}
                  href={getTeachersUrl()}
                  htmlAnchorProps={{
                    target: "_blank",
                  }}
                />
              </Card>
            </GridArea>
          </Grid>
        </section>
      </MaxWidth>

      {/* How to plan a lesson */}

      <section>
        <MaxWidth>
          <SectionHeader>
            <SectionTitle>{pageData.stepsHeading}</SectionTitle>
          </SectionHeader>
          <Grid $cg={24} $rg={0}>
            {getLessonPlanningCards(pageData).map(
              ({ title, portableText, image, withSearchCTA }, i, arr) => {
                const isFirstOrLast = i === 0 || i == arr.length - 1;
                return (
                  <GridArea
                    key={`plan-a-lesson--planning-card--${i}`}
                    $alignItems={"center"}
                    $justifyContent={"center"}
                    $colSpan={[12, isFirstOrLast ? 12 : 6]}
                    $mb={i !== arr.length - 1 ? [24, 56] : 0}
                  >
                    <Card
                      $width={["100%", isFirstOrLast ? "50%" : "100%"]}
                      $alignItems="flex-start"
                      $flexDirection="column"
                      $ph={[16, 24]}
                      $pv={24}
                    >
                      <Box
                        $position="relative"
                        $height={80}
                        $width={[120, "100%"]}
                        $mb={24}
                        $mh={["auto", null]}
                      >
                        <Image
                          alt=""
                          layout="fill"
                          objectFit="contain"
                          objectPosition="left bottom"
                          src={image}
                        />
                      </Box>

                      <Flex $flexDirection={"column"}>
                        <Heading
                          $mb={24}
                          tag={"h3"}
                          $lineHeight={["40px", "32px"]}
                          $fontSize={[24, 32]}
                        >
                          {title}
                        </Heading>
                        <P $fontSize={18} $lineHeight={"24px"}>
                          <PortableText value={portableText} />
                        </P>
                        {withSearchCTA && (
                          <Flex $justifyContent={["center", "flex-start"]}>
                            <ButtonAsLink
                              icon="Search"
                              iconPosition="trailing"
                              $mt={24}
                              label={"Search our lessons"}
                              href={getTeachersUrl()}
                              htmlAnchorProps={{
                                target: "_blank",
                              }}
                            />
                          </Flex>
                        )}
                      </Flex>
                    </Card>
                  </GridArea>
                );
              }
            )}
          </Grid>
        </MaxWidth>
      </section>
      <section>
        {/* `Plan for section` */}
        <MaxWidth $mb={120}>
          <Flex $mt={[56, 80]} $mb={32} $background="teachersPastelYellow">
            <Card $pv={24} $ph={[16, 24]} $flexDirection={["column", "row"]}>
              <Box $minWidth={["50%"]}>
                <Box $display={["block", "none"]}>
                  <CardTitle fontSize={24} tag="h4">
                    {pageData.learnMoreBlock1.title}
                  </CardTitle>
                </Box>
                <Flex
                  $justifyContent={"center"}
                  $pb={[24, 0]}
                  $pr={[0, 72]}
                  $minWidth={["50%"]}
                >
                  {pageData.learnMoreBlock1.mediaType == "video" && (
                    <VideoPlayer
                      thumbnailTime={
                        pageData.learnMoreBlock1.video.video.asset.thumbTime
                      }
                      playbackId={
                        pageData.learnMoreBlock1.video.video.asset.playbackId
                      }
                      title={pageData.learnMoreBlock1.video.title}
                    />
                  )}
                </Flex>
              </Box>
              <Flex
                $justifyContent={"center"}
                $flexDirection={"column"}
                $minWidth={["50%"]}
              >
                <Box $display={["none", "block"]}>
                  <CardTitle fontSize={32} tag="h4">
                    {pageData.learnMoreBlock1.title}
                  </CardTitle>
                </Box>
                <Typography $fontSize={[16, 18]} $lineHeight={["24px", "28px"]}>
                  <PortableText
                    value={pageData.learnMoreBlock1.bodyPortableText}
                  />
                </Typography>
              </Flex>
            </Card>
          </Flex>
          <Card
            $pv={[24, 24]}
            $ph={[0, 24]}
            $flexDirection={["column", "row"]}
            $background={"teachersPastelYellow"}
            $alignItems="center"
          >
            <Box $minWidth={"50%"} $pr={[null, 72]} $mb={[72, 0]} $ph={[16, 0]}>
              <CardTitle fontSize={[24, 32]} tag={"h4"}>
                {pageData.learnMoreBlock2.title}
              </CardTitle>
              <Typography $fontSize={[16, 18]} $lineHeight={["24px", "28px"]}>
                <PortableText
                  value={pageData.learnMoreBlock2.bodyPortableText}
                />
              </Typography>
            </Box>
            <Card
              $position="relative"
              $width={["100%", "auto"]}
              $minWidth={"50%"}
              $height={[360, 240]}
              $background="pastelTurqoise"
              $justifyContent={"flex-end"}
              $alignItems={["center", "center", "flex-end"]}
              $pr={[0, 24]}
              $pb={24}
              $pa={0}
            >
              <Cover
                $right={[0, 0, "50%"]}
                $left={[0, 0, 16]}
                $top={16}
                $bottom={[92, 92, 20]}
              >
                <Image
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center bottom"
                  alt=""
                  src={"/images/illustrations/teacher-carrying-stuff.png"}
                />
              </Cover>

              <ButtonAsLink
                icon="Search"
                iconPosition="trailing"
                label={pageData.lessonElementsCTA.label}
                href={getTeachersUrl()}
                htmlAnchorProps={{
                  target: "_blank",
                }}
              />
            </Card>
          </Card>
        </MaxWidth>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PlanALessonProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const planningPage = await CMSClient.planningPage({
    previewMode: isPreviewMode,
  });

  return {
    props: {
      pageData: planningPage,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default PlanALesson;
