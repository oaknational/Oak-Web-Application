import { FC, useRef, useEffect } from "react";
import { OakHeading, OakP } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import Svg from "@/components/SharedComponents/Svg";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import DownloadConfirmationNextLessonContainer from "@/components/TeacherComponents/DownloadConfirmationNextLessonContainer";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import {
  useShareExperiment,
  CurriculumTrackingProps,
} from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";

type DownloadConfirmationProps = {
  lessonSlug: string;
  lessonTitle: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  isCanonical: boolean;
  unitTitle?: string | null;
  nextLessons?: NextLesson[];
  onwardContentSelected: TrackFns["onwardContentSelected"];
  isSpecialist?: boolean;
  keyStageSlug: CurriculumTrackingProps["keyStageSlug"];
  keyStageTitle: CurriculumTrackingProps["keyStageTitle"];
  subjectSlug: CurriculumTrackingProps["subjectSlug"];
  subjectTitle: CurriculumTrackingProps["subjectTitle"];
};

const DownloadConfirmation: FC<DownloadConfirmationProps> = ({
  lessonSlug,
  lessonTitle,
  programmeSlug,
  unitSlug,
  isCanonical,
  unitTitle,
  nextLessons,
  onwardContentSelected,
  isSpecialist = false,
  keyStageSlug,
  keyStageTitle,
  subjectSlug,
  subjectTitle,
}) => {
  const displayNextLessonContainer =
    !isCanonical && unitSlug && programmeSlug && unitTitle;
  const isNextLessonsAvailable = nextLessons && nextLessons.length > 0;

  const focusRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const { shareExperimentFlag, shareUrl, shareActivated } = useShareExperiment({
    lessonSlug,
    unitSlug: unitSlug ?? undefined,
    programmeSlug: programmeSlug ?? undefined,
    source: isCanonical ? "download-canonical" : "download-browse",
    curriculumTrackingProps: {
      lessonName: lessonTitle,
      unitName: unitTitle ?? "",
      keyStageSlug,
      keyStageTitle,
      subjectSlug,
      subjectTitle,
    },
  });

  const teacherShareButton = shareExperimentFlag ? (
    <TeacherShareButton shareUrl={shareUrl} shareActivated={shareActivated} />
  ) : null;

  return (
    <>
      <Flex
        $flexDirection={["column", "row"]}
        $alignItems={["flex-start", "center"]}
        $gap={[24, 24, 120]}
        $mb={[56, 0]}
      >
        <Flex
          $alignItems={"center"}
          $justifyContent={"center"}
          $height={[140, 400]}
          $width={[140, 400]}
          $position={"relative"}
        >
          <Svg name="tick-mark-happiness" $height={"100%"} $width={"100%"} />
        </Flex>

        <Flex
          $flexDirection={"column"}
          $gap={24}
          $alignItems={"flex-start"}
          $maxWidth={600}
        >
          {unitSlug && unitTitle && programmeSlug ? (
            <ButtonAsLink
              {...focusRef}
              htmlAnchorProps={{ tabIndex: 0 }}
              page={
                isSpecialist ? "specialist-lesson-overview" : "lesson-overview"
              }
              lessonSlug={lessonSlug}
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              label="Back to lesson"
              variant={"buttonStyledAsLink"}
              icon="chevron-left"
              iconBackground="grey20"
              data-testid="back-to-lesson-link"
              size="small"
              onClick={() => {
                onwardContentSelected({
                  lessonName: lessonTitle,
                  unitName: unitTitle,
                  unitSlug: unitSlug,
                  lessonSlug: lessonSlug,
                  onwardIntent: "view-lesson",
                });
              }}
            />
          ) : (
            <ButtonAsLink
              {...focusRef}
              page={"lesson-overview-canonical"}
              lessonSlug={lessonSlug}
              label="Back to lesson"
              variant={"buttonStyledAsLink"}
              icon="chevron-left"
              iconBackground="grey20"
              data-testid="back-to-lesson-link"
              size="small"
              onClick={() => {
                onwardContentSelected({
                  lessonName: lessonTitle,
                  unitName: "",
                  unitSlug: "",
                  lessonSlug: lessonSlug,
                  onwardIntent: "view-lesson",
                });
              }}
            />
          )}

          <OakHeading tag="h1" $font={["heading-4", "heading-3"]}>
            Thanks for downloading
          </OakHeading>
          {teacherShareButton}

          <OakP $font={"body-1"}>
            We hope you find the resources useful. Click the question mark in
            the bottom-right corner to share your feedback.
          </OakP>
        </Flex>
      </Flex>

      {displayNextLessonContainer && isNextLessonsAvailable && (
        <DownloadConfirmationNextLessonContainer
          programmeSlug={programmeSlug}
          unitSlug={unitSlug}
          unitTitle={unitTitle}
          nextLessons={nextLessons}
          onwardContentSelected={onwardContentSelected}
        />
      )}
    </>
  );
};

export default DownloadConfirmation;
