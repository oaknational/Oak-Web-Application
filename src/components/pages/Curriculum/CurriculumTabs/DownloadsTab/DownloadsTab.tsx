import React, { FC } from "react";

import Box from "@/components/Box/Box";
import { Heading, LI, UL } from "@/components/Typography";
import { CurriculumDownloadsTabData } from "@/node-lib/curriculum-api-2023";

type DownloadsTabProps = {
  data: CurriculumDownloadsTabData;
};

const DownloadsTab: FC<DownloadsTabProps> = (props: DownloadsTabProps) => {
  return (
    <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
      <Heading tag="h1" $font={"heading-2"} data-testid="downloads-heading">
        Downloads
      </Heading>
      <UL>
        {props.data.urls.map((url) => (
          <LI key={url}>{url}</LI>
        ))}
      </UL>
    </Box>
  );
};
export default DownloadsTab;
