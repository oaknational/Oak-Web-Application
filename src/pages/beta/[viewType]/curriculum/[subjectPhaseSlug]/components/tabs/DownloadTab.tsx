import React, { FC } from "react";

import Box from "@/components/Box/Box";
import { Heading } from "@/components/Typography";

type DownloadTabProps = {
  slug: string;
};

const DownloadTab: FC<DownloadTabProps> = (props: DownloadTabProps) => {
  const { slug } = props;
  return (
    <Box $maxWidth={"80%"} $ma={"auto"} $pb={80}>
      <Heading tag="h1" $font={"heading-2"}>
        Download
      </Heading>
      {slug}
    </Box>
  );
};
export default DownloadTab;
