import React, { FC } from "react";

import Box from "@/components/Box/Box";
import { Heading } from "@/components/Typography";
import { CurriculumDownloadTabData } from "@/node-lib/curriculum-api-2023";

type DownloadTabProps = {
  data: CurriculumDownloadTabData;
  slug: string;
};

const DownloadTab: FC<DownloadTabProps> = (props: DownloadTabProps) => {
  const { slug } = props;
  return (
    <Box $maxWidth={"80%"} $ma={"auto"} $pb={80}>
      <Heading tag="h1" $font={"heading-2"} data-testid="heading">
        Downloads
      </Heading>
      {slug}
    </Box>
  );
};
export default DownloadTab;
