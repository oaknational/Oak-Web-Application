import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import SubjectIconBrushBorders from "../SubjectIconBrushBorders";
import { Heading, P, Span } from "../Typography";
import Grid, { GridArea } from "../Grid";
import ButtonAsLink from "../Button/ButtonAsLink";

import { HeaderLessonProps } from "./HeaderLesson";

import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

/**
 * This is a wrapper for the headers on the lesson overview and listing pages.
 *
 */

export const HeaderLessonDesktop: FC<HeaderLessonProps> = (props) => {
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
    <Box $display={["none", "grid"]}>
      <Grid>
        <GridArea $justifyContent={"center"} $colSpan={[12, 3]}>
          <Flex $height={[172, 172, 200]} $width={[172, 172, 200]}>
            <SubjectIconBrushBorders
              subjectSlug={subjectSlug}
              height={96}
              width={96}
              $maxHeight={140}
              $maxWidth={140}
              $ma={"auto"}
              color={subjectIconBackgroundColor}
              lessonIsNew={lessonIsNew}
            />
          </Flex>
        </GridArea>
        <GridArea $justifyContent={"center"} $colSpan={[12, 9]}>
          <Box>
            <Span $mb={8} $color={"oakGrey4"} $font={"heading-light-7"}>
              {yearTitle}
            </Span>

            <Heading $mb={24} tag={"h1"} $font={"heading-3"}>
              {lessonTitle}
            </Heading>
            {lessonDescription && (
              <Box $mb={24} $maxWidth={740}>
                <P $font={"heading-light-7"}>{lessonDescription}</P>
              </Box>
            )}
          </Box>
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
                data-testid={"download-all-button-desktop"}
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
        </GridArea>
      </Grid>
    </Box>
  );
};
