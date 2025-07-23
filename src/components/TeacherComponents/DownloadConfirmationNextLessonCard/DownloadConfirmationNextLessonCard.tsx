import { FC } from "react";
import {
  OakHeading,
  OakFlex,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { OnwardContentSelectedProperties } from "@/browser-lib/avo/Avo";

type DownloadConfirmationNextLessonCardProps = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  unitTitle: string;
  onwardContentSelected: (
    properties: Omit<
      OnwardContentSelectedProperties,
      "lessonReleaseDate" | "lessonReleaseCohort"
    >,
  ) => void;
};

const DownloadConfirmationNextLessonCard: FC<
  DownloadConfirmationNextLessonCardProps
> = ({
  programmeSlug,
  unitSlug,
  unitTitle,
  lessonSlug,
  lessonTitle,
  onwardContentSelected,
}) => {
  return (
    <OakGrid>
      <OakGridArea $colSpan={[12, 12, 6]}>
        <OakFlex
          $pa={["inner-padding-m", "inner-padding-m", "inner-padding-xl"]}
          $flexDirection={"column"}
          $minHeight={["all-spacing-17", "all-spacing-16", "all-spacing-17"]}
          $height={"100%"}
          $position={"relative"}
          $justifyContent={"space-between"}
          $wordWrap={"break-word"}
          $gap="all-spacing-4"
          $background={"aqua50"}
          $borderRadius="border-radius-s"
          $width={"100%"}
          $minWidth={["all-spacing-20", "all-spacing-19", "all-spacing-20"]}
          data-testid={`next-lesson-card`}
        >
          <OakHeading
            tag="h3"
            $font={"heading-6"}
            $mb={["space-between-s", "auto"]}
          >
            {lessonTitle}
          </OakHeading>

          <OakFlex
            $flexDirection={["column", "row", "row"]}
            $alignItems={["flex-start"]}
            $flexWrap={"wrap"}
            $gap="all-spacing-6"
          >
            <ButtonAsLink
              page={"lesson-overview"}
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              lessonSlug={lessonSlug}
              variant={"buttonStyledAsLink"}
              icon="chevron-right"
              $iconPosition="trailing"
              iconBackground="aqua50"
              label="See lesson"
              size="small"
              onClick={() => {
                onwardContentSelected({
                  lessonName: lessonTitle,
                  lessonSlug: lessonSlug,
                  unitSlug: unitSlug,
                  unitName: unitTitle,
                  onwardIntent: "view-lesson",
                });
              }}
            />

            <ButtonAsLink
              page={"lesson-downloads"}
              downloads="downloads"
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              lessonSlug={lessonSlug}
              variant={"buttonStyledAsLink"}
              icon="chevron-right"
              $iconPosition="trailing"
              label="Download resources"
              $background={"aqua50"}
              iconBackground="aqua50"
              size="small"
              $font={"heading-7"}
              onClick={() => {
                onwardContentSelected({
                  lessonName: lessonTitle,
                  lessonSlug: lessonSlug,
                  unitSlug: unitSlug,
                  unitName: unitTitle,
                  onwardIntent: "download-lesson-resources",
                });
              }}
            />
          </OakFlex>
        </OakFlex>
      </OakGridArea>
    </OakGrid>
  );
};

export default DownloadConfirmationNextLessonCard;
