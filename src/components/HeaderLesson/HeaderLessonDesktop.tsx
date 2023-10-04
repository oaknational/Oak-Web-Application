import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import SubjectIconBrushBorders from "../SubjectIconBrushBorders";
import { Heading, P, Span } from "../Typography";
import Grid, { GridArea } from "../Grid";

import { HeaderLessonProps } from "./HeaderLesson";
import { HeaderDownloadAllButton } from "./HeaderDownloadAllButton";

export const HeaderLessonDesktop: FC<HeaderLessonProps> = (props) => {
  const {
    subjectSlug,
    yearTitle,
    tierTitle,
    examBoardTitle,
    lessonTitle,
    isNew,
    subjectIconBackgroundColor,
    pupilLessonOutcome,
  } = props;

  const otherFactors = [yearTitle, examBoardTitle, tierTitle]
    .filter((elem) => !!elem)
    .join(" • ");

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
              isNew={isNew}
            />
          </Flex>
        </GridArea>
        <GridArea
          $justifyContent={"center"}
          $colSpan={[12, 9]}
          $alignItems={"flex-start"}
        >
          <Flex $flexDirection={"column"} $gap={8}>
            {otherFactors && (
              <Span
                data-testid="other-factors"
                $color={"oakGrey4"}
                $font={"heading-light-7"}
              >
                {otherFactors}
              </Span>
            )}

            <Flex $flexDirection={"column"} $gap={24}>
              <Heading tag={"h1"} $font={"heading-3"}>
                {lessonTitle}
              </Heading>
              {pupilLessonOutcome && (
                <Box $maxWidth={740}>
                  <P $font={"body-2"}>{pupilLessonOutcome}</P>
                </Box>
              )}
              <HeaderDownloadAllButton {...props} />
            </Flex>
          </Flex>
        </GridArea>
      </Grid>
    </Box>
  );
};
