import { FC } from "react";

import AspectRatio from "../../AspectRatio";

import Box from "@/components/Box";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders";

interface OverviewPresentationProps {
  asset: string;
  title: string;
  isWorksheetLandscape?: boolean;
  isWorksheet: boolean;
}

const OverviewPresentation: FC<OverviewPresentationProps> = ({
  asset,
  title,
  isWorksheetLandscape,
  isWorksheet,
}) => {
  const slidesId = asset.split("/")?.[5];
  const isWorksheetPortrait = !isWorksheetLandscape && isWorksheet;
  return (
    <Box $width={"100%"}>
      <AspectRatio ratio={isWorksheetPortrait ? "2:3" : "16:9"}>
        <iframe
          src={`https://docs.google.com/presentation/d/${slidesId}/embed?start=false&amp;loop=false&amp;delayms=3000`}
          title={`slide deck: ${title}`}
          width="101%"
          height="100%"
          // We know the google slides aren't accessible.
          className="pa11y-ignore"
          data-testid="overview-presentation"
          style={{
            border: "none",
          }}
        />
            <BoxBorders gapPosition="rightTop"/>
      </AspectRatio>
    </Box>
  );
};

export default OverviewPresentation;
