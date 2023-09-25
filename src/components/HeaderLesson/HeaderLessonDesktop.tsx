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
    lessonTitle,
    lessonDescription,
    isNew,
    subjectIconBackgroundColor,
  } = props;

  return (
    <Box $display={["none", "grid"]}>
      <Grid>
        <GridArea $justifyContent={"center"} $colSpan={[12, 3]}>
          <Flex $height={[172, 172, 200]} $width={[172, 172, 200]}>
            {subjectSlug && (
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
            )}
          </Flex>
        </GridArea>
        <GridArea
          $justifyContent={"center"}
          $colSpan={[12, 9]}
          $alignItems={"flex-start"}
        >
          <Box>
            {yearTitle && (
              <Span $mb={8} $color={"oakGrey4"} $font={"heading-light-7"}>
                {yearTitle}
              </Span>
            )}

            <Heading $mb={24} tag={"h1"} $font={"heading-3"}>
              {lessonTitle}
            </Heading>
            {lessonDescription && (
              <Box $mb={24} $maxWidth={740}>
                <P $font={"heading-light-7"}>{lessonDescription}</P>
              </Box>
            )}
          </Box>
          <HeaderDownloadAllButton {...props} />
        </GridArea>
      </Grid>
    </Box>
  );
};
