import React, { FC } from "react";

import Box from "@/components/Box/Box";
import { Heading, LI, UL } from "@/components/Typography";
import { CurriculumDownloadsTabData } from "@/node-lib/curriculum-api-2023";

type DownloadTabProps = {
  data: CurriculumDownloadsTabData;
};

const DownloadTab: FC<DownloadTabProps> = (props: DownloadTabProps) => {
  return (
    <Box $maxWidth={"80%"} $ma={"auto"} $pb={80}>
      <Heading tag="h1" $font={"heading-2"} data-testid="heading">
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
export default DownloadTab;
