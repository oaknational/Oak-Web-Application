import React from "react";
import {
  GetServerSideProps,
  GetServerSidePropsResult,
  //GetStaticPaths,
  // GetStaticProps,
  // GetStaticPropsResult,
  NextPage,
} from "next";

//import { decorateWithIsr } from "../../../../../../../../../../node-lib/isr";
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
  P,
} from "../../../../../../../../../../components/Typography";
import Button from "../../../../../../../../../../components/Button";
import Box from "../../../../../../../../../../components/Box";
import Grid from "../../../../../../../../../../components/Grid";
import curriculumApi, {
  TeachersLessonOverviewData,
} from "../../../../../../../../../../node-lib/curriculum-api";
import LessonHelper from "../../../../../../../../../../components/LessonHelper";
import OverviewPresentation from "../../../../../../../../../../components/pages/TeachersLessonOverview/OverviewPresentation";
import OverviewVideo from "../../../../../../../../../../components/pages/TeachersLessonOverview/OverviewVideo";
import ExpandingContainer from "../../../../../../../../../../components/ExpandingContainer";

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
  } = curriculumData;

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
        {presentationUrl && (
          <ExpandingContainer
            title={"Presentation"}
            downloadable={true}
            toggleClosed={false}
          >
            <OverviewPresentation asset={presentationUrl} title={title} />
          </ExpandingContainer>
        )}
        {videoMuxPlaybackId && (
          <ExpandingContainer title={"Video"} downloadable={true}>
            <OverviewVideo
              video={videoMuxPlaybackId}
              signLanguageVideo={videoWithSignLanguageMuxPlaybackId}
              title={title}
            />
          </ExpandingContainer>
        )}
        {worksheetUrl && (
          <ExpandingContainer title={"Worksheet"} downloadable={true}>
            <OverviewPresentation asset={worksheetUrl} title={title} />
          </ExpandingContainer>
        )}
        <ExpandingContainer title={"Starter quiz"} downloadable={true}>
          <Box>quiz element</Box>
        </ExpandingContainer>
        <ExpandingContainer title={"Exit quiz"} downloadable={true}>
          <Box>quiz element</Box>
        </ExpandingContainer>
        {transcript && (
          <ExpandingContainer title={"Transcript"}>
            <Flex $width={"100%"} $justifyContent={"center"}>
              <Box
                $width={["100%", "70%", "60%"]}
                $maxHeight={[380, 640, 640]}
                $background="oakGrey2"
                $ph={16}
                $pv={32}
                $mt={20}
                $borderRadius={[8, 3, 3]}
              >
                <Box
                  $maxHeight={[320, 580, 580]}
                  $overflowY={"scroll"}
                  $pr={32}
                >
                  <P $mb={[24, 16]} $font={"body-1"} $whiteSpace="pre-wrap">
                    {transcript}
                  </P>
                </Box>
              </Box>
            </Flex>
          </ExpandingContainer>
        )}
        <Hr $color={"oakGrey3"} />
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

// export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
//   const { lessons } = await curriculumApi.teachersLessonOverviewPaths();
//   const paths = lessons.map((params) => ({ params: params }));

//   return {
//     fallback: false,
//     paths,
//   };
// };

export const getServerSideProps: GetServerSideProps<
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

  const results: GetServerSidePropsResult<LessonOverviewPageProps> = {
    props: {
      curriculumData,
    },
  };
  // const resultsWithIsr = decorateWithIsr(results);
  // return resultsWithIsr;
  return results;
};

export default LessonOverviewPage;
