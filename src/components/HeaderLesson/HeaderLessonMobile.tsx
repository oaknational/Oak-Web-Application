import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import { Heading, P, Span } from "../Typography";
import ButtonAsLink from "../Button/ButtonAsLink";
import SubjectIconBrushBorders from "../SubjectIconBrushBorders";

import { HeaderLessonProps } from "./HeaderLesson";

import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

/**
 * This is a wrapper for the headers on the lesson overview and listing pages.
 *
 */

export const HeaderLessonMobile: FC<HeaderLessonProps> = (props) => {
  const {
    subjectSlug,
    yearTitle,
    lessonTitle,
    lessonDescription,
    expired,
    hasDownloadableResources,
    programmeSlug,
    lessonSlug,
    unitSlug,
    keyStageSlug,
    keyStageTitle,
    unitTitle,
    subjectTitle,
    lessonIsNew,
    subjectIconBackgroundColor,
    track,
    analyticsUseCase,
  } = props;

  return (
    <Flex $flexDirection={"column"} $display={["flex", "none"]}>
      <Flex $mb={24}>
        <Box $maxHeight={80} $maxWidth={80} $mr={16}>
          <SubjectIconBrushBorders
            subjectSlug={subjectSlug}
            height={20}
            width={20}
            $ma={"auto"}
            lessonIsNew={lessonIsNew}
            color={subjectIconBackgroundColor}
          />
        </Box>
        <Flex $flexDirection={"column"}>
          {yearTitle && (
            <Span $mb={8} $color={"oakGrey4"} $font={"heading-light-7"}>
              {yearTitle}
            </Span>
          )}

          <Heading tag={"h1"} $font={"heading-5"}>
            {lessonTitle}
          </Heading>
        </Flex>
      </Flex>
      {lessonDescription && (
        <Box $mb={24}>
          <P $font={"heading-light-7"}>{lessonDescription}</P>
        </Box>
      )}
      <Flex>
        {!expired && hasDownloadableResources && (
          <ButtonAsLink
            $ml={4}
            icon={"download"}
            iconBackground="black"
            label="Download all resources"
            page={"lesson-downloads"}
            viewType="teachers"
            size={"large"}
            variant="brush"
            $iconPosition={"trailing"}
            data-testid={"download-all-button-mobile"}
            query={{
              preselected: "all",
            }}
            programmeSlug={programmeSlug}
            lessonSlug={lessonSlug}
            unitSlug={unitSlug}
            onClick={() => {
              track.downloadResourceButtonClicked({
                keyStageTitle: keyStageTitle as KeyStageTitleValueType,
                keyStageSlug,
                subjectTitle,
                subjectSlug,
                unitName: unitTitle,
                unitSlug,
                lessonName: lessonTitle,
                lessonSlug,
                downloadResourceButtonName: "all",
                analyticsUseCase,
              });
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};
