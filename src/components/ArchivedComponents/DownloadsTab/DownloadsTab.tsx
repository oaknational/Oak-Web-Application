import React, { FC } from "react";
import { OakHeading, OakLI, OakUL } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import { CurriculumDownloadsTabData } from "@/node-lib/curriculum-api-2023";

type DownloadsTabProps = {
  data: CurriculumDownloadsTabData;
};

const DownloadsTab: FC<DownloadsTabProps> = (props: DownloadsTabProps) => {
  return (
    <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
      <OakHeading tag="h1" $font={"heading-2"} data-testid="downloads-heading">
        Downloads
      </OakHeading>
      <OakUL>
        {props.data.urls.map((url) => (
          <OakLI key={url}>{url}</OakLI>
        ))}
      </OakUL>
    </Box>
  );
};
export default DownloadsTab;
