import React, { FC } from "react";

import {
  CurriculumDownloadsTabData,
  Subject,
  Phase,
} from "@/node-lib/curriculum-api-2023";
import Box from "@/components/Box/Box";
import { Heading, LI, UL } from "@/components/Typography";
import Flex from "@/components/Flex/Flex";

export type DownloadsTabProps = {
  data: CurriculumDownloadsTabData;
  subject: Subject;
  phase: Phase;
};

const DownloadsTab: FC<DownloadsTabProps> = (props: DownloadsTabProps) => {
  const { data, subject, phase } = props;
  const { urls } = data;
  return (
    <Box $width={"80%"} $ma={"auto"} $pb={80}>
      <Flex $width={"100%"} $mv={10}>
        <Box $pt={20} $mr={16} $pb={48} $maxWidth={["100%"]}>
          <Heading
            tag="h2"
            $font={["heading-5", "heading-6"]}
            data-testid="heading"
          >
            {subject.title} {phase.title} - Downloads
          </Heading>
          <UL>
            {urls.map((url) => (
              <LI>{url}</LI>
            ))}
          </UL>
        </Box>
      </Flex>
    </Box>
  );
};
export default DownloadsTab;
