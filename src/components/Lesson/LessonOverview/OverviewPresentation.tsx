import { FC, memo, useState } from "react";

import AspectRatio from "../../AspectRatio";

import Box from "@/components/Box";

interface OverviewPresentationProps {
  asset: string | null;
  title: string;
  isWorksheetLandscape?: boolean | null;
  isWorksheet: boolean;
  isAdditionalMaterial?: boolean;
}

const OverviewPresentation: FC<OverviewPresentationProps> = ({
  asset,
  title,
  isWorksheetLandscape,
  isWorksheet,
  isAdditionalMaterial,
}) => {
  const [slidesId] = useState(asset ? asset.split("/")?.[5] : null);
  const isWorksheetPortrait = !isWorksheetLandscape && isWorksheet;
  const srcUrl =
    isAdditionalMaterial && asset
      ? `https://docs.google.com/document/d/${slidesId}/pub?embedded=true`
      : `https://docs.google.com/presentation/d/${slidesId}/embed?start=false&amp;loop=false&amp;delayms=3000`;
  return (
    <Box $ba={[3]} $width={"100%"}>
      <AspectRatio ratio={isWorksheetPortrait ? "2:3" : "16:9"}>
        <iframe
          src={srcUrl}
          title={`slide deck: ${title}`}
          width="100%"
          height="100%"
          // We know the google slides aren't accessible.
          className="pa11y-ignore"
          data-testid="overview-presentation"
          style={{
            border: "none",
          }}
          loading="eager"
        />
      </AspectRatio>
    </Box>
  );
};

export default memo(OverviewPresentation);
