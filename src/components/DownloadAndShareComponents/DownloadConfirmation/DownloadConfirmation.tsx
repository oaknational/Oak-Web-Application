import { FC } from "react";

import Flex from "@/components/Flex";
import { Heading, P } from "@/components/Typography";
import Svg from "@/components/Svg";
import Box from "@/components/Box";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import NextLessonContainer from "@/components/DownloadComponents/NextLessonContainer";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

type DownloadConfirmationProps = {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  isCanonical: boolean;
  unitTitle?: string | null;
  nextLessons?: NextLesson[];
};

const DownloadConfirmation: FC<DownloadConfirmationProps> = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
  isCanonical,
  unitTitle,
  nextLessons,
}) => {
  const displayNextLessonContainer =
    !isCanonical && unitSlug && programmeSlug && unitTitle;
  const isNextLessons = nextLessons && nextLessons.length > 0;

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
          {unitSlug && programmeSlug ? (
            <ButtonAsLink
              page={"lesson-overview"}
              lessonSlug={lessonSlug}
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              label="Back to lesson"
              variant={"buttonStyledAsLink"}
              icon="chevron-left"
              iconBackground="oakGrey1"
              data-testid="back-to-lesson-link"
              size="small"
            />
          ) : (
            <ButtonAsLink
              page={"lesson-overview-canonical"}
              lessonSlug={lessonSlug}
              label="Back to lesson"
              variant={"buttonStyledAsLink"}
              icon="chevron-left"
              iconBackground="oakGrey1"
              data-testid="back-to-lesson-link"
              size="small"
            />
          )}

          <Heading tag="h1" $font={["heading-4", "heading-3"]}>
            Thanks for downloading
          </Heading>
          <Box $maxWidth={[360, 524]}>
            <P $font={"body-1"}>
              We hope you find the resources useful. Click the question mark in
              the bottom-right corner to share your feedback.
            </P>
          </Box>
        </Flex>
      </Flex>

      {displayNextLessonContainer && isNextLessons && (
        <NextLessonContainer
          programmeSlug={programmeSlug}
          unitSlug={unitSlug}
          unitTitle={unitTitle}
          nextLessons={nextLessons}
        />
      )}
    </>
  );
};

export default DownloadConfirmation;
