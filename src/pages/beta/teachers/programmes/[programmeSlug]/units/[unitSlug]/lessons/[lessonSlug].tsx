import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import useTrackPageView from "../../../../../../../../hooks/useTrackPageView";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../../../node-lib/isr";
import AppLayout from "../../../../../../../../components/AppLayout";
import Flex from "../../../../../../../../components/Flex";
import MaxWidth from "../../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../../components/Card/SubjectUnitLessonTitleCard";
import { getSeoProps } from "../../../../../../../../browser-lib/seo/getSeoProps";
import Typography, {
  Heading,
  Hr,
  LI,
  UL,
} from "../../../../../../../../components/Typography";
import ButtonAsLink from "../../../../../../../../components/Button/ButtonAsLink";
import Grid from "../../../../../../../../components/Grid";
import curriculumApi, {
  LessonOverviewData,
  TierListingData,
} from "../../../../../../../../node-lib/curriculum-api";
import LessonHelper from "../../../../../../../../components/LessonHelper";
import OverviewPresentation from "../../../../../../../../components/pages/TeachersLessonOverview/OverviewPresentation";
import OverviewVideo from "../../../../../../../../components/pages/TeachersLessonOverview/OverviewVideo";
import OverviewTranscript from "../../../../../../../../components/pages/TeachersLessonOverview/OverviewTranscript";
import ExpandingContainer from "../../../../../../../../components/ExpandingContainer";
import QuizContainer from "../../../../../../../../components/QuizContainer";
import Breadcrumbs, {
  Breadcrumb,
} from "../../../../../../../../components/Breadcrumbs";
import Box from "../../../../../../../../components/Box";
import useAnalytics from "../../../../../../../../context/Analytics/useAnalytics";
import useAnalyticsUseCase from "../../../../../../../../hooks/useAnalyticsUseCase";
import type {
  KeyStageTitleValueType,
  DownloadResourceButtonNameValueType,
} from "../../../../../../../../browser-lib/avo/Avo";

export type LessonOverviewPageProps = {
  curriculumData: LessonOverviewData;
  tierData: TierListingData;
};

// Array to be used in downloads as well to avoid duplication
export const lessonBreadcrumbArray = (
  keyStageTitle: string,
  keyStageSlug: string,
  programmeSlug: string,
  subjectTitle: string,
  subjectSlug: string,
  unitSlug: string,
  unitTitle: string,
  programmeCount = 1
): Breadcrumb[] => {
  const subjectBreadcrumb: Breadcrumb =
    programmeCount > 1
      ? {
          oakLinkProps: {
            page: "programme-index",
            keyStage: keyStageSlug,
            subject: subjectSlug,
          },
          label: subjectTitle,
        }
      : {
          oakLinkProps: {
            page: "unit-index",
            programme: programmeSlug,
          },
          label: subjectTitle,
        };

  return [
    { oakLinkProps: { page: "home", viewType: "teachers" }, label: "Home" },
    {
      oakLinkProps: { page: "subject-index", slug: keyStageSlug },
      label: keyStageTitle,
    },
    subjectBreadcrumb,
    {
      oakLinkProps: {
        page: "lesson-index",
        programmeSlug,
        slug: unitSlug,
      },
      label: unitTitle,
    },
  ];
};
const LessonOverviewPage: NextPage<LessonOverviewPageProps> = ({
  curriculumData,
  tierData,
}) => {
  const {
    lessonTitle,
    lessonSlug,
    programmeSlug,
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
    transcriptSentences,
    hasCopyrightMaterial,
    hasDownloadableResources,
    introQuiz,
    exitQuiz,
    introQuizInfo,
    exitQuizInfo,
    unitTitle,
    unitSlug,
    expired,
  } = curriculumData;

  const { track } = useAnalytics();
  const analyticsUseCase = useAnalyticsUseCase();

  const trackDownloadResourceButtonClicked = ({
    downloadResourceButtonName,
  }: {
    downloadResourceButtonName: DownloadResourceButtonNameValueType;
  }) => {
    track.downloadResourceButtonClicked({
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      subjectTitle,
      subjectSlug,
      unitName: unitTitle,
      unitSlug,
      lessonName: lessonTitle,
      lessonSlug,
      downloadResourceButtonName,
      analyticsUseCase,
    });
  };

  useTrackPageView({ pageName: "Lesson" });
  const programmeCount = tierData.programmes.length;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "Lesson overview", // @todo add real data
          description: "Overview of lesson",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <MaxWidth $ph={16}>
        <Box $mv={[24, 48]}>
          {" "}
          <Breadcrumbs
            breadcrumbs={[
              ...lessonBreadcrumbArray(
                keyStageTitle,
                keyStageSlug,
                programmeSlug,
                subjectTitle,
                subjectSlug,
                unitSlug,
                unitTitle,
                programmeCount
              ),
              {
                oakLinkProps: {
                  page: "lesson-overview",
                  viewType: "teachers",
                  programmeSlug,
                  unitSlug,
                  slug: lessonSlug,
                },
                label: lessonTitle,
                disabled: true,
              },
            ]}
          />
        </Box>

        <Flex $mb={36} $display={"inline-flex"} $mt={0}>
          <TitleCard
            page={"lesson"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            subject={subjectTitle}
            subjectSlug={subjectSlug}
            title={lessonTitle}
          />
        </Flex>
        {expired ? (
          <Box $pa={16} $mb={64}>
            <Heading $font={"heading-7"} tag={"h2"} $mb={16}>
              No lesson available
            </Heading>
            <Typography $font={"body-1"}>
              Sorry, this lesson no longer exists.
            </Typography>
          </Box>
        ) : (
          <>
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
                  icon="download"
                  iconBackground="teachersHighlight"
                  label="Download all resources"
                  page={"lesson-downloads"}
                  size="small"
                  variant="minimal"
                  $iconPosition={"trailing"}
                  $mt={16}
                  data-testid={"download-all-button"}
                  query={{
                    preselected: "all",
                  }}
                  programmeSlug={programmeSlug}
                  lessonSlug={lessonSlug}
                  unitSlug={unitSlug}
                  onClick={() => {
                    trackDownloadResourceButtonClicked({
                      downloadResourceButtonName: "all",
                    });
                  }}
                />
              )}
              {/*
          todo
           <Button
            $mr={24}
            icon="send"
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
                downloadable={true}
                toggleClosed={false}
                {...curriculumData}
                title={"Slide deck"}
                onDownloadButtonClick={() => {
                  trackDownloadResourceButtonClicked({
                    downloadResourceButtonName: "slide deck",
                  });
                }}
              >
                <OverviewPresentation
                  asset={presentationUrl}
                  title={lessonTitle}
                />
              </ExpandingContainer>
            )}
            {videoMuxPlaybackId && (
              <ExpandingContainer {...curriculumData} title={"Video"}>
                <OverviewVideo
                  video={videoMuxPlaybackId}
                  signLanguageVideo={videoWithSignLanguageMuxPlaybackId}
                  title={lessonTitle}
                  hasCaptions={Boolean(transcriptSentences)}
                />
              </ExpandingContainer>
            )}
            {worksheetUrl && (
              <ExpandingContainer
                downloadable={true}
                {...curriculumData}
                title={"Worksheet"}
                onDownloadButtonClick={() => {
                  trackDownloadResourceButtonClicked({
                    downloadResourceButtonName: "worksheet",
                  });
                }}
              >
                <OverviewPresentation
                  asset={worksheetUrl}
                  title={lessonTitle}
                />
              </ExpandingContainer>
            )}
            {introQuiz.length > 0 ? (
              <ExpandingContainer
                downloadable={true}
                {...curriculumData}
                title={"Starter quiz"}
                onDownloadButtonClick={() => {
                  trackDownloadResourceButtonClicked({
                    downloadResourceButtonName: "starter quiz",
                  });
                }}
              >
                <QuizContainer questions={introQuiz} info={introQuizInfo} />
              </ExpandingContainer>
            ) : (
              ""
            )}
            {exitQuiz.length > 0 && (
              <ExpandingContainer
                downloadable={true}
                {...curriculumData}
                title={"Exit quiz"}
                onDownloadButtonClick={() => {
                  trackDownloadResourceButtonClicked({
                    downloadResourceButtonName: "exit quiz",
                  });
                }}
              >
                <QuizContainer questions={exitQuiz} info={exitQuizInfo} />
              </ExpandingContainer>
            )}

            {transcriptSentences && (
              <ExpandingContainer {...curriculumData} title={"Transcript"}>
                <OverviewTranscript transcriptSentences={transcriptSentences} />
              </ExpandingContainer>
            )}
          </>
        )}
      </MaxWidth>
      {!expired && (
        <>
          <MaxWidth $ph={[0, 16, 16]}>
            {(equipmentRequired || supervisionLevel || contentGuidance) && (
              <Hr $color={"oakGrey3"} />
            )}
            <Grid $rg={32} $cg={32} $mv={16}>
              <LessonHelper
                helperTitle={"Equipment required"}
                helperIcon={"equipment-required"}
                helperDescription={equipmentRequired}
              />
              <LessonHelper
                helperTitle={"Supervision level"}
                helperIcon={"supervision-level"}
                helperDescription={supervisionLevel}
              />
              <LessonHelper
                helperTitle={"Content guidance"}
                helperIcon={"content-guidance"}
                helperDescription={contentGuidance}
              />
            </Grid>
          </MaxWidth>
          <MaxWidth $ph={16}>
            <Hr $color={"oakGrey3"} />
          </MaxWidth>
        </>
      )}
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const { lessons } = await curriculumApi.lessonOverviewPaths();
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
  const { lessonSlug, unitSlug, programmeSlug } = context.params;

  const curriculumData = await curriculumApi.lessonOverview({
    programmeSlug,
    lessonSlug,
    unitSlug,
  });

  const tierData = await curriculumApi.tierListing({
    keyStageSlug: curriculumData.keyStageSlug,
    subjectSlug: curriculumData.subjectSlug,
  });

  if (!curriculumData && !tierData) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<LessonOverviewPageProps> = {
    props: {
      curriculumData,
      tierData,
    },
  };

  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default LessonOverviewPage;
