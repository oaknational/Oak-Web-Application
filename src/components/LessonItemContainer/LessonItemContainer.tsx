import { forwardRef } from "react";

import Box from "../Box";
import Flex from "../Flex";
import { Heading, Hr } from "../Typography";
import AnchorTarget from "../AnchorTarget";
import { LessonPageLinkAnchorId } from "../Lesson/lesson.helpers";
import { containerTitleToPreselectMap } from "../DownloadAndShareComponents/downloadAndShareTypeUtilities";

import { ContainerLink } from "./ContainerLink";

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
  return containerTitleToPreselectMap[title].downloadType;
};

const getPreselectedQueryFromTitle = (title: LessonItemTitle) => {
  return containerTitleToPreselectMap[title].shareType;
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
          <ContainerLink
            page={"download"}
            resourceTitle={lowerCaseTitle}
            onClick={onDownloadButtonClick}
            preselected={preselectedDownload}
            {...slugs}
          />
        )}
        {shareable && slugs && (
          <ContainerLink
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
