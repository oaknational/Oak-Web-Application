import React from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { decorateWithIsr } from "../../../../node-lib/isr";
import AppLayout from "../../../../components/AppLayout";
import Flex from "../../../../components/Flex";
import MaxWidth from "../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../components/Card/TitleCard";
import { getSeoProps } from "../../../../browser-lib/seo/getSeoProps";
import { mockFetchLessons } from "../../../../browser-lib/fixtures/lesson";
import Typography, {
  Heading,
  Hr,
  LI,
  UL,
} from "../../../../components/Typography";
import Button from "../../../../components/Button";
import ExpandingContainer from "../../../../components/ExpandingContainer";
import Box from "../../../../components/Box";
import BrushBorders from "../../../../components/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "../../../../components/Card";
import Grid, { GridArea } from "../../../../components/Grid";
import Icon from "../../../../components/Icon";
import teachersLessonsLessonPathsFixture from "../../../../node-lib/curriculum-api/fixtures/teachersLessonsLessonPaths.fixture";

export type LessonOverview = {
  lessonTitle: string;
  lessonSlug: string;
  keyStageTitle: string;
  keyStageSlug: string;
  coreContent: string[];
  subjectTitle: string;
  subjectSlug: string;
  equiptmentRequired: string;
  supervisionLevel: string;
  contentGuidance: string;
};

export type LessonOverviewPageProps = {
  curriculumData: LessonOverview;
};

const LessonOverviewPage: NextPage<LessonOverviewPageProps> = ({
  curriculumData,
}) => {
  const {
    lessonTitle,
    keyStageTitle,
    keyStageSlug,
    coreContent,
    subjectSlug,
    subjectTitle,
    equiptmentRequired,
    supervisionLevel,
    contentGuidance,
  } = curriculumData;

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Lesson overview", // @todo add real data
        description: "Overview of lesson",
      })}
    >
      <MaxWidth $ph={16}>
        <Flex $mb={24} $display={"inline-flex"} $mt={50}>
          <TitleCard
            page={"lesson"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            subject={subjectTitle}
            subjectSlug={subjectSlug}
            title={lessonTitle}
            iconName={"Rocket"}
          />
        </Flex>
        <Flex $flexDirection="column">
          <Heading tag={"h2"} $font={"heading-6"}>
            Core content
          </Heading>
          <UL>
            {coreContent.map((contentString) => {
              return <LI>{contentString}</LI>;
            })}
          </UL>
        </Flex>
        <Flex $mt={28} $flexWrap={"wrap"}>
          <Button
            $mr={24}
            icon="Save"
            iconBackground="teachersHighlight"
            label="All lesson resources"
            onClick={() => null}
            size="large"
            variant="minimal"
            $iconPosition={"trailing"}
            $mt={16}
          />
          <Button
            $mr={24}
            icon="SendToPupil"
            iconBackground="teachersHighlight"
            label="Send to pupil"
            onClick={() => null}
            size="large"
            variant="minimal"
            $iconPosition={"trailing"}
            $mt={16}
          />
        </Flex>
        <Hr $color={"oakGrey3"} />
        <ExpandingContainer
          title={"Presentation"}
          projectable={true}
          downloadable={true}
          external={true}
        >
          <Box>Presentaion element</Box>
        </ExpandingContainer>
        <ExpandingContainer title={"Video"} downloadable={true}>
          <Box>Video element</Box>
        </ExpandingContainer>
        <ExpandingContainer
          title={"Worksheet"}
          downloadable={true}
          external={true}
        >
          <Box>Worksheet element</Box>
        </ExpandingContainer>
        <ExpandingContainer
          title={"Starter quiz"}
          projectable={true}
          downloadable={true}
          external={true}
        >
          <Box>quiz element</Box>
        </ExpandingContainer>
        <ExpandingContainer
          title={"Exit quiz"}
          projectable={true}
          downloadable={true}
          external={true}
        >
          <Box>quiz element</Box>
        </ExpandingContainer>
        <ExpandingContainer
          title={"Transript"}
          downloadable={true}
          external={true}
        >
          <Box>Transcript element</Box>
        </ExpandingContainer>
        <Hr $color={"oakGrey3"} />
        <Grid $rg={32} $cg={32} $mv={16}>
          <GridArea $colSpan={[12, 12, 4]}>
            <Card $background={"teachersPastelYellow"}>
              <Heading $font={"heading-5"} tag={"h3"} $mb={24}>
                <Icon variant="minimal" name={"EquiptmentRequired"} /> Equipment
                Required
              </Heading>
              <Typography $font={"body-2"}>{equiptmentRequired}</Typography>
              <BrushBorders color="teachersPastelYellow" />
            </Card>
          </GridArea>
          <GridArea $colSpan={[12, 12, 4]}>
            <Card $background={"teachersPastelYellow"}>
              <Heading $font={"heading-5"} tag={"h3"} $mb={24}>
                <Icon variant="minimal" name={"SupervisionLevel"} /> Supervision
                Level
              </Heading>
              <Typography $font={"body-2"}>{supervisionLevel}</Typography>
              <BrushBorders color="teachersPastelYellow" />
            </Card>
          </GridArea>
          <GridArea $colSpan={[12, 12, 4]}>
            <Card $background={"teachersPastelYellow"}>
              <Heading $font={"heading-5"} tag={"h3"} $mb={24}>
                <Icon variant="minimal" name={"ContentGuidance"} /> Content
                Guidance
              </Heading>
              <Typography $font={"body-2"}>{contentGuidance}</Typography>
              <BrushBorders color="teachersPastelYellow" />
            </Card>
          </GridArea>
        </Grid>
        <Hr $color={"oakGrey3"} />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
};

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const paths = teachersLessonsLessonPathsFixture().map(({ lessonSlug }) => ({
    params: {
      lessonSlug,
    },
  }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<
  LessonOverviewPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { lessonSlug } = context.params;

  const curriculumData = mockFetchLessons(
    lessonSlug
    // context.params?.keyStageSlug
  );

  if (!curriculumData) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<LessonOverviewPageProps> = {
    props: {
      curriculumData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default LessonOverviewPage;
