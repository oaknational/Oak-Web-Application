import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import { Heading, Hr } from "../Typography";
import ButtonAsLink, { ButtonAsLinkProps } from "../Button/ButtonAsLink";
import {
  PreselectedDownloadType,
  containerTitleToPreselectMap,
} from "../DownloadComponents/downloads.types";
import AnchorTarget from "../AnchorTarget";

function DownloadLink({
  resourceTitle,
  onClick,
  lessonSlug,
  unitSlug,
  programmeSlug,
  preselected,
}: {
  resourceTitle: string;
  onClick?: () => void;
  lessonSlug: string;
  unitSlug: string | null;
  programmeSlug: string | null;
  preselected: PreselectedDownloadType | null;
}) {
  const props: Pick<
    ButtonAsLinkProps,
    | "variant"
    | "iconBackground"
    | "icon"
    | "$iconPosition"
    | "label"
    | "onClick"
  > = {
    variant: "minimal",
    iconBackground: "black",
    icon: "arrow-right",
    $iconPosition: "trailing",
    onClick,
    label: `Download ${resourceTitle}`,
  };

  if (programmeSlug && unitSlug) {
    // Return link to lesson download page within its learning pathway
    return (
      <ButtonAsLink
        {...props}
        data-testid="download-button"
        page="lesson-downloads"
        lessonSlug={lessonSlug}
        unitSlug={unitSlug}
        programmeSlug={programmeSlug}
        query={{ preselected }}
      />
    );
  } else {
    // Return link to canonical lesson download page
    return (
      <ButtonAsLink
        {...props}
        data-testid="download-button"
        page="lesson-downloads-canonical"
        unitSlug={null}
        programmeSlug={null}
        lessonSlug={lessonSlug}
        query={{ preselected }}
      />
    );
  }
}

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
  anchorId: string;
  downloadable?: boolean;
  slugs?: Slugs;
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
    slugs,
    anchorId,
  } = props;
  const preselected = getPreselectedQueryFromTitle(title);

  const lowerCaseTitle = title.toLowerCase();

  return (
    <Flex $flexDirection="column" $position={"relative"}>
      <AnchorTarget id={anchorId} $paddingTop={24} />
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
          <DownloadLink
            resourceTitle={lowerCaseTitle}
            onClick={onDownloadButtonClick}
            preselected={preselected}
            {...slugs}
          />
        )}
      </Flex>

      <Box>{children}</Box>
      <Hr $color={"teachersPastelBlue"} $mt={[24, 56]} $mb={[12, 24]} />
    </Flex>
  );
};
