import { forwardRef } from "react";

import { LessonPageLinkAnchorId } from "@/components/TeacherComponents/lesson.helpers";
import { containerTitleToPreselectMap } from "@/components/DownloadAndShareComponents/helpers/containerTitleToPreselectMap";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
import { Heading, Hr } from "@/components/SharedComponents/Typography";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

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
  | "Lesson details"
  | "Additional material";

type Slugs = {
  lessonSlug: string;
  unitSlug: string | null;
  programmeSlug: string | null;
};

export interface LessonItemContainerProps {
  children?: React.ReactNode;
  title: LessonItemTitle;
  anchorId: LessonPageLinkAnchorId;
  downloadable?: boolean;
  shareable?: boolean;
  slugs?: Slugs;
  onDownloadButtonClick?: () => void;
  isFinalElement?: boolean;
}

const getPreselectedDownloadFromTitle = (title: LessonItemTitle) => {
  return containerTitleToPreselectMap[title]?.downloadType;
};

const getPreselectedQueryFromTitle = (title: LessonItemTitle) => {
  return containerTitleToPreselectMap[title]?.shareType;
};

export const LessonItemContainer = forwardRef<
  HTMLDivElement,
  LessonItemContainerProps
>((props, ref) => {
  const {
    children,
    title,
    downloadable,
    onDownloadButtonClick,
    slugs,
    anchorId,
    shareable,
  } = props;
  const preselectedDownload = getPreselectedDownloadFromTitle(title);
  const preselectedShare = getPreselectedQueryFromTitle(title);

  const lowerCaseTitle = title.toLowerCase();

  return (
    <Flex $flexDirection="column" $position={"relative"}>
      <AnchorTarget id={anchorId} $paddingTop={24} ref={ref} />
      <Flex
        $flexDirection={["column", "row"]}
        $alignItems={["start", "end"]}
        $gap={[12, 40]}
        $mb={[24]}
        $position={"relative"}
      >
        {title && (
          <Heading $font={["heading-5", "heading-4"]} tag={"h2"}>
            {title}
          </Heading>
        )}
        {downloadable && slugs && (
          <LessonItemContainerLink
            page={"download"}
            resourceTitle={lowerCaseTitle}
            onClick={onDownloadButtonClick}
            preselected={preselectedDownload}
            {...slugs}
          />
        )}
        {shareable && slugs && (
          <LessonItemContainerLink
            page={"share"}
            resourceTitle={lowerCaseTitle}
            onClick={onDownloadButtonClick}
            preselected={preselectedShare}
            {...slugs}
          />
        )}
      </Flex>

      <Box>{children}</Box>
      {!props.isFinalElement && (
        <Hr $color={"pink"} $mt={[24, 56]} $mb={[12, 24]} />
      )}
    </Flex>
  );
});
