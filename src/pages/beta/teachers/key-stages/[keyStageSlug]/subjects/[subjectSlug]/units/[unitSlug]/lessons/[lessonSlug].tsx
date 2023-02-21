import React from "react";
import { useRouter } from "next/router";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../../../../../node-lib/isr";
import { resolveOakHref } from "../../../../../../../../../../common-lib/urls";
import AppLayout from "../../../../../../../../../../components/AppLayout";
import Flex from "../../../../../../../../../../components/Flex";
import MaxWidth from "../../../../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../../../../components/Card/TitleCard";
import { getSeoProps } from "../../../../../../../../../../browser-lib/seo/getSeoProps";
import {
  Heading,
  Hr,
  LI,
  UL,
} from "../../../../../../../../../../components/Typography";
import ButtonAsLink from "../../../../../../../../../../components/Button/ButtonAsLink";
import Grid from "../../../../../../../../../../components/Grid";
import curriculumApi, {
  TeachersLessonOverviewData,
} from "../../../../../../../../../../node-lib/curriculum-api";
import LessonHelper from "../../../../../../../../../../components/LessonHelper";
import OverviewPresentation from "../../../../../../../../../../components/pages/TeachersLessonOverview/OverviewPresentation";
import OverviewVideo from "../../../../../../../../../../components/pages/TeachersLessonOverview/OverviewVideo";
import OverviewTranscript from "../../../../../../../../../../components/pages/TeachersLessonOverview/OverviewTranscript";
import ExpandingContainer from "../../../../../../../../../../components/ExpandingContainer";
import QuizContainer from "../../../../../../../../../../components/QuizContainer";

export type LessonOverviewPageProps = {
  curriculumData: TeachersLessonOverviewData;
};

const LessonOverviewPage: NextPage<LessonOverviewPageProps> = ({
  curriculumData,
}) => {
  const {
    title,
    keyStageTitle,
    keyStageSlug,
    coreContent,
    subjectSlug,
    subjectTitle,
    equipmentRequired,
    supervisionLevel,
    contentGuidance,
    videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId,
    presentationUrl,
    worksheetUrl,
    transcript,
    hasCopyrightMaterial,
    hasDownloadableResources,
    introQuiz,
    exitQuiz,
  } = curriculumData;

  const router = useRouter();
  const { lessonSlug, unitSlug } = router.query;

  const downLoadLink = resolveOakHref({
    page: "downloads",
    keyStage: keyStageSlug,
    subject: subjectSlug,
    unit: `${unitSlug}`,
    slug: `${lessonSlug}`,
  });

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Lesson overview", // @todo add real data
        description: "Overview of lesson",
      })}
    >
      <MaxWidth $ph={16}>
        <Flex $mb={36} $display={"inline-flex"} $mt={50}>
          <TitleCard
            page={"lesson"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            subject={subjectTitle}
            subjectSlug={subjectSlug}
            title={title}
            iconName={"Rocket"}
          />
        </Flex>
        <Flex $flexDirection="column">
          <Heading tag={"h2"} $font={"heading-6"} $mb={16}>
            Core content
          </Heading>
          <UL $pl={28}>
            {coreContent.map((contentString, i) => {
              if (!contentString) {
                return null;
              }
              return (
                <LI key={`core-content-string-${i}`} $font={"list-item-1"}>
                  {contentString}
                </LI>
              );
            })}
          </UL>
        </Flex>
        <Flex $mt={12} $flexWrap={"wrap"}>
          {hasDownloadableResources && (
            <ButtonAsLink
              $mr={24}
              icon="Save"
              iconBackground="teachersHighlight"
              label="All lesson resources"
              href={downLoadLink}
              page={null}
              size="large"
              variant="minimal"
              $iconPosition={"trailing"}
              $mt={16}
              data-testid={"download-all-button"}
            />
          )}
          {/*
          todo
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
          /> */}
        </Flex>
        <Hr $color={"oakGrey3"} />
        {presentationUrl && !hasCopyrightMaterial && (
          <ExpandingContainer
            title={"Slide deck"}
            downloadable={true}
            downloadLink={downLoadLink}
            toggleClosed={false}
          >
            <OverviewPresentation asset={presentationUrl} title={title} />
          </ExpandingContainer>
        )}
        {videoMuxPlaybackId && (
          <ExpandingContainer title={"Video"}>
            <OverviewVideo
              video={videoMuxPlaybackId}
              signLanguageVideo={videoWithSignLanguageMuxPlaybackId}
              title={title}
              hasCaptions={Boolean(transcript)}
            />
          </ExpandingContainer>
        )}
        {worksheetUrl && (
          <ExpandingContainer
            title={"Worksheet"}
            downloadable={true}
            downloadLink={downLoadLink}
          >
            <OverviewPresentation asset={worksheetUrl} title={title} />
          </ExpandingContainer>
        )}
        {introQuiz.length > 0 ? (
          <ExpandingContainer
            title={"Starter quiz"}
            downloadable={true}
            downloadLink={downLoadLink}
          >
            <QuizContainer questions={introQuiz} />
          </ExpandingContainer>
        ) : (
          ""
        )}
        {exitQuiz.length > 0 && (
          <ExpandingContainer
            title={"Exit quiz"}
            downloadable={true}
            downloadLink={downLoadLink}
          >
            <QuizContainer questions={exitQuiz} />
          </ExpandingContainer>
        )}

        {transcript && (
          <ExpandingContainer title={"Transcript"}>
            <OverviewTranscript transcript={transcript} />
          </ExpandingContainer>
        )}
      </MaxWidth>
      <MaxWidth $ph={[0, 16, 16]}>
        {(equipmentRequired || supervisionLevel || contentGuidance) && (
          <Hr $color={"oakGrey3"} />
        )}
        <Grid $rg={32} $cg={32} $mv={16}>
          <LessonHelper
            helperTitle={"Equipment required"}
            helperIcon={"EquipmentRequired"}
            helperDescription={equipmentRequired}
          />
          <LessonHelper
            helperTitle={"Supervision level"}
            helperIcon={"SupervisionLevel"}
            helperDescription={supervisionLevel}
          />
          <LessonHelper
            helperTitle={"Content guidance"}
            helperIcon={"ContentGuidance"}
            helperDescription={contentGuidance}
          />
        </Grid>
      </MaxWidth>
      <MaxWidth $ph={16}>
        <Hr $color={"oakGrey3"} />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  keyStageSlug: string;
  subjectSlug: string;
  unitSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const { lessons } = await curriculumApi.teachersLessonOverviewPaths();
  const paths = lessons.map((params) => ({ params: params }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  LessonOverviewPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { lessonSlug, keyStageSlug, subjectSlug, unitSlug } = context.params;

  const curriculumData = await curriculumApi.teachersLessonOverview({
    lessonSlug,
    keyStageSlug,
    subjectSlug,
    unitSlug,
  });

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
