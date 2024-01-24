import { FC } from "react";
import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

import CMSClient from "@/node-lib/cms";
import { CTA, PlanningPage, PortableTextJSON } from "@/common-lib/cms-types";
import Card, { CardProps } from "@/components/SharedComponents/Card";
import Flex from "@/components/SharedComponents/Flex";
import Layout from "@/components/AppComponents/Layout";
import Typography, { Heading } from "@/components/SharedComponents/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Icon, { IconName } from "@/components/SharedComponents/Icon";
import LessonPlanningElementLinks from "@/components/TeacherComponents/LessonPlanningElementLinks";
import { OakColorName } from "@/styles/theme";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import SummaryCard from "@/components/SharedComponents/Card/SummaryCard";
import Circle from "@/components/SharedComponents/Circle";
import Box from "@/components/SharedComponents/Box";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import Cover from "@/components/SharedComponents/Cover";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Illustration from "@/components/SharedComponents/Illustration";
import { IllustrationSlug } from "@/image-data";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { GridAreaListItem } from "@/components/SharedComponents/Typography/LI";
import { GridOrderedList } from "@/components/SharedComponents/Typography/OL";

export type PlanALessonProps = {
  pageData: PlanningPage;
};

const lessonElementIds = {
  introQuiz: "intro-quiz",
  video: "video",
  slides: "lesson-slides",
  worksheet: "worksheet",
  exitQuiz: "exit-quiz",
};

const getLessonElementCards = (
  planningPage: PlanningPage,
): {
  id: string;
  icon: IconName;
  title: string;
  portableText: PortableTextJSON;
  background?: OakColorName;
}[] => [
  {
    id: lessonElementIds.introQuiz,
    icon: "quiz",
    title: planningPage.lessonElements.introQuiz.title,
    portableText: planningPage.lessonElements.introQuiz.bodyPortableText,
  },
  {
    id: lessonElementIds.video,
    icon: "video",
    title: planningPage.lessonElements.video.title,
    portableText: planningPage.lessonElements.video.bodyPortableText,
  },
  {
    id: lessonElementIds.slides,
    icon: "slide-deck",
    title: planningPage.lessonElements.slides.title,
    portableText: planningPage.lessonElements.slides.bodyPortableText,
  },
  {
    id: lessonElementIds.worksheet,
    icon: "worksheet",
    title: planningPage.lessonElements.worksheet.title,
    portableText: planningPage.lessonElements.worksheet.bodyPortableText,
  },
  {
    id: lessonElementIds.exitQuiz,
    icon: "quiz",
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

  const planningSteps: {
    id: string;
    imageSlug: IllustrationSlug;
    title: string;
    portableText?: PortableTextJSON;
    withSearchCTA?: boolean;
  }[] = [
    {
      id: "find",
      imageSlug: "calendar",
      title: getTitle(0),
      portableText: getPortableText(0),
    },
    {
      id: "personalise",
      imageSlug: "atoms",
      title: getTitle(1),
      portableText: getPortableText(1),
    },
    {
      id: "tailor",
      imageSlug: "test-tubes",
      title: getTitle(2),
      portableText: getPortableText(2),
    },
    {
      id: "teach",
      imageSlug: "pupils-at-desk",
      title: getTitle(3),
      portableText: getPortableText(3),
      withSearchCTA: true,
    },
  ];

  return planningSteps;
};

const SectionHeader: FC<{ children?: React.ReactNode }> = (props) => {
  return <Box as="header" $width={"100%"} {...props} />;
};

const SectionTitle: FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <Flex
      $justifyContent="center"
      $maxWidth={["100%", "50%"]}
      $mh="auto"
      $pt={[56, 80]}
      $pb={48}
      $ph={16}
      $mt={12}
    >
      <Heading
        $font={["heading-6", "heading-5"]}
        $textAlign="center"
        tag="h2"
        {...props}
      />
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

const generateCtaProps = (cta: CTA) => {
  return {
    page: null,
    href: getLinkHref(cta),
    label: cta.label,
    htmlAnchorProps: {
      target: "_self",
    },
  };
};

const PlanALesson: NextPage<PlanALessonProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $pt={[72, 80, 80]}>
        <SummaryCard
          {...pageData}
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
              <Heading $font="heading-5" $textAlign="center" tag="h2">
                Learn more about our different resources and how they can
                support your planning
              </Heading>
            </Flex>
            <Flex
              $flexDirection="column"
              $justifyContent={"center"}
              $alignItems="center"
              $width={"100%"}
              $mb={[0, 48]}
            >
              <LessonPlanningElementLinks linkTargetIds={lessonElementIds} />
            </Flex>
          </SectionHeader>
          <OakGrid
            $cg={["all-spacing-0", "all-spacing-8"]}
            $rg={["all-spacing-10"]}
          >
            {getLessonElementCards(pageData).map(
              ({ title, portableText, icon, id }) => (
                <OakGridArea
                  key={`plan-a-lessing--element-card--${id}`}
                  $colSpan={[12, 6]}
                >
                  <LessonElementsCard $background={"pink50"}>
                    <BrushBorders hideOnMobileH color={"pink50"} />
                    <AnchorTarget id={id} />
                    <Circle
                      size={120}
                      $mb={40}
                      $background={"lemon"}
                      $alignSelf={"center"}
                    >
                      <Icon size={80} name={icon} />
                    </Circle>
                    <CardTitle $font={["heading-5", "heading-4"]} tag="h3">
                      {title}
                    </CardTitle>
                    <Typography $font="body-1">
                      <PortableTextWithDefaults
                        value={portableText}
                        withoutDefaultComponents
                      />
                    </Typography>
                  </LessonElementsCard>
                </OakGridArea>
              ),
            )}
            <OakGridArea $colSpan={[12, 6]}>
              <Card
                $position="relative"
                $width={["100%", "auto"]}
                $minWidth={"50%"}
                $height={[360, 240]}
                $background="aqua"
                $justifyContent={"flex-end"}
                $alignItems={["center", "center", "flex-end"]}
                $pr={[0, 24]}
                $pb={24}
                $pa={0}
              >
                <BrushBorders hideOnMobileH color={"aqua"} />
                <Cover
                  $right={[0, 0, "50%"]}
                  $left={[0, 0, 32]}
                  $top={48}
                  $bottom={[92, 92, 20]}
                >
                  <Illustration
                    sizes={getSizes([210, 110, 173])}
                    slug="teacher-carrying-stuff"
                    fill
                    $width="auto"
                    $objectFit="contain"
                    $objectPosition="center bottom"
                  />
                </Cover>
                <ButtonAsLink
                  icon="search"
                  $iconPosition="trailing"
                  {...generateCtaProps(pageData.lessonElementsCTA)}
                />
              </Card>
            </OakGridArea>
          </OakGrid>
        </section>
      </MaxWidth>

      {/* How to plan a lesson */}

      <section>
        <MaxWidth>
          <SectionHeader>
            <SectionTitle>{pageData.stepsHeading}</SectionTitle>
          </SectionHeader>
          <GridOrderedList $cg={24} $rg={0}>
            {getLessonPlanningCards(pageData).map(
              ({ title, portableText, imageSlug, withSearchCTA }, i, arr) => {
                const isFirstOrLast = i === 0 || i == arr.length - 1;
                return (
                  <GridAreaListItem
                    key={`plan-a-lesson--planning-card--${i}`}
                    $alignItems={"center"}
                    $justifyContent={"center"}
                    $colSpan={[12, isFirstOrLast ? 12 : 6]}
                    $mb={i !== arr.length - 1 ? [24, 56] : 0}
                    listStyle="none"
                    $display="flex"
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
                        $width={[120, "100%"]}
                        $mb={24}
                        $mh={["auto", null]}
                      >
                        <Illustration
                          $objectFit="contain"
                          $objectPosition="left bottom"
                          slug={imageSlug}
                          height={80}
                          $height={80}
                          noCrop
                        />
                      </Box>

                      <Flex $flexDirection={"column"}>
                        <Heading
                          $mb={24}
                          tag={"h3"}
                          $font={["heading-5", "heading-6"]}
                        >
                          {title}
                        </Heading>
                        <Typography $font={"body-1"}>
                          <PortableTextWithDefaults value={portableText} />
                        </Typography>
                        {withSearchCTA && (
                          <Flex $justifyContent={["center", "flex-start"]}>
                            <ButtonAsLink
                              icon="search"
                              $iconPosition="trailing"
                              $mt={24}
                              {...generateCtaProps(pageData.stepsCTA)}
                            />
                          </Flex>
                        )}
                      </Flex>
                    </Card>
                  </GridAreaListItem>
                );
              },
            )}
          </GridOrderedList>
        </MaxWidth>
      </section>
      <section>
        {/* `Plan for section` */}
        <MaxWidth $mb={120} $alignItems={"center"}>
          <Card
            $maxWidth={["100%", 812, "100%"]}
            $pv={24}
            $ph={[16, 24]}
            $flexDirection={["column", "column", "row"]}
            $mt={[56, 80]}
            $mb={32}
            $background="lemon50"
          >
            <BrushBorders hideOnMobileH color={"lemon50"} />
            <Box $minWidth={["50%"]}>
              <Box $display={["block", "block", "none"]}>
                <CardTitle $font={["heading-5", "heading-4"]} tag="h2">
                  {pageData.learnMoreBlock1.title}
                </CardTitle>
              </Box>
              <Flex
                $justifyContent={"center"}
                $pb={[24, 24, 0]}
                $pr={[0, 0, 72]}
                $minWidth={["50%"]}
              >
                {pageData.learnMoreBlock1.mediaType == "video" && (
                  <CMSVideo
                    video={pageData.learnMoreBlock1.video}
                    location="marketing"
                  />
                )}
              </Flex>
            </Box>
            <Flex
              $justifyContent={"center"}
              $flexDirection={"column"}
              $minWidth={["50%"]}
            >
              <Box $display={["none", "none", "block"]}>
                <CardTitle $font={"heading-4"} tag="h2">
                  {pageData.learnMoreBlock1.title}
                </CardTitle>
              </Box>
              <Typography $font={["body-2", "body-1"]}>
                <PortableTextWithDefaults
                  value={pageData.learnMoreBlock1.bodyPortableText}
                />
              </Typography>
            </Flex>
          </Card>
          <Card
            $pv={[24, 24]}
            $ph={[0, 24, 24]}
            $flexDirection={["column", "column", "row"]}
            $background={"lemon50"}
            $alignItems="center"
            $maxWidth={["100%", 812, "100%"]}
          >
            <BrushBorders hideOnMobileH color={"lemon50"} />
            <Box
              $minWidth={"50%"}
              $pr={[null, null, 72]}
              $mb={[48, 48, 0]}
              $ph={[16, 0, 0]}
            >
              <CardTitle $font={["heading-5", "heading-4"]} tag={"h2"}>
                {pageData.learnMoreBlock2.title}
              </CardTitle>
              <Typography $font={["body-2", "body-1"]}>
                <PortableTextWithDefaults
                  value={pageData.learnMoreBlock2.bodyPortableText}
                />
              </Typography>
            </Box>
            <Card
              $position="relative"
              $width={["100%", "100%", "auto"]}
              $minWidth={"50%"}
              $height={[360, 240]}
              $background="aqua"
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
                <Illustration
                  sizes={getSizes([210, 110, 173])}
                  slug="teacher-carrying-stuff"
                  fill
                  $width="auto"
                  $objectFit="contain"
                  $objectPosition="center bottom"
                />
              </Cover>

              <ButtonAsLink
                icon="search"
                $iconPosition="trailing"
                {...generateCtaProps(pageData.lessonElementsCTA)}
              />
            </Card>
          </Card>
        </MaxWidth>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PlanALessonProps> = async (
  context,
) => {
  return getPageProps({
    page: "lesson-planning::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const planningPage = await CMSClient.planningPage({
        previewMode: isPreviewMode,
      });

      if (!planningPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<PlanALessonProps> = {
        props: {
          pageData: planningPage,
        },
      };

      return results;
    },
  });
};

export default PlanALesson;
