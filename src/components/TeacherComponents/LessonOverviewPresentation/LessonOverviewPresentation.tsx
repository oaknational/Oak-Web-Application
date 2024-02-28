import { FC, memo, useState } from "react";

import AspectRatio from "@/components/SharedComponents/AspectRatio";
import Box from "@/components/SharedComponents/Box";

interface LessonOverviewPresentationProps {
  asset: string | null;
  title: string;
  isWorksheetLandscape?: boolean | null;
  isWorksheet: boolean;
  isAdditionalMaterial?: boolean;
}

const LessonOverviewPresentation: FC<LessonOverviewPresentationProps> = ({
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
      : `https://docs.google.com/presentation/d/${slidesId}/embed?start=false&amp;loop=false&amp`;
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

export default memo(LessonOverviewPresentation);
