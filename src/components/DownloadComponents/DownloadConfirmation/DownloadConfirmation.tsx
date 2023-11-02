import { FC } from "react";

import Flex from "@/components/Flex";
import { Heading, P } from "@/components/Typography";
import Svg from "@/components/Svg";
import Box from "@/components/Box";
import ButtonAsLink from "@/components/Button/ButtonAsLink";

type DownloadConfirmationProps = {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
};

const DownloadConfirmation: FC<DownloadConfirmationProps> = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
}) => {
  if (programmeSlug === null || unitSlug === null) {
    return null;
  }
  return (
    <Flex
      $flexDirection={["column", "row"]}
      $alignItems={["flex-start", "center"]}
      $gap={[24, 24, 120]}
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

      <Flex $flexDirection={"column"} $gap={24}>
        <Box>
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
          />
        </Box>
        <Box $maxWidth={600}>
          <Heading tag="h2" $font={["heading-4", "heading-3"]} $mb={24}>
            Thanks for downloading
          </Heading>
          <Box $maxWidth={[360, 524]}>
            <P $font={"body-1"}>
              We hope you find the resources useful. Click the question mark in
              the bottom-right corner to share your feedback.
            </P>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DownloadConfirmation;
