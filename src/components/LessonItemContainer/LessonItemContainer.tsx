import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import { Heading, Hr } from "../Typography";
import ButtonAsLink from "../Button/ButtonAsLink";
import { containerTitleToPreselectMap } from "../DownloadComponents/downloads.types";
import { LessonOverviewData } from "../../node-lib/curriculum-api";

/**
 * This replaces the old ExpandingContainer component on the lesson page. It should wrap each item of lesson content.
 *
 */

export type LessonItemTitle =
  | "Slide deck"
  | "Exit quiz"
  | "Starter quiz"
  | "Worksheet"
  | "Video"
  | "Transcript"
  | "Lesson details";

export interface LessonItemContainerProps {
  children?: React.ReactNode;
  title: LessonItemTitle;
  downloadable?: boolean;
  curriculumData?: LessonOverviewData;
  onDownloadButtonClick?: () => void;
}

const getPreselectedQueryFromTitle = (title: LessonItemTitle) => {
  return containerTitleToPreselectMap[title];
};

export const LessonItemContainer: FC<LessonItemContainerProps> = (props) => {
  const {
    children,
    title,
    downloadable,
    onDownloadButtonClick,
    curriculumData,
  } = props;
  const preselected = getPreselectedQueryFromTitle(title);

  const lowerCaseTitle = title.toLowerCase();

  return (
    <Flex $flexDirection="column">
      <Flex
        $flexDirection={["column", "row"]}
        $alignItems={["start", "end"]}
        $gap={[12, 40]}
        $mb={[24]}
      >
        {title && (
          <Heading $font={["heading-5", "heading-4"]} tag={"h2"}>
            {title}
          </Heading>
        )}
        {downloadable && curriculumData && (
          <ButtonAsLink
            data-testid={"download-button"}
            variant={"minimal"}
            page={"lesson-downloads"}
            viewType="teachers"
            iconBackground="black"
            icon="arrow-right"
            $iconPosition="trailing"
            label={`Download ${lowerCaseTitle}`}
            onClick={() => {
              if (onDownloadButtonClick) {
                onDownloadButtonClick();
              }
            }}
            query={{
              preselected: preselected,
            }}
            {...curriculumData}
          />
        )}
      </Flex>

      <Box>{children}</Box>
      <Hr $color={"teachersPastelBlue"} $mt={[24, 56]} $mb={[12, 24]} />
    </Flex>
  );
};
