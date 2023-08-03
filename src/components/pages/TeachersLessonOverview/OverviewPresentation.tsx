import { FC } from "react";

import AspectRatio from "../../AspectRatio";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

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
    <AspectRatio ratio={isWorksheetPortrait ? "2:3" : "16:9"}>
      <BoxBorders />
      <iframe
        src={`https://docs.google.com/presentation/d/${slidesId}/embed?start=false&amp;loop=false&amp;delayms=3000`}
        title={`slide deck: ${title}`}
        width="100%"
        height="100%"
        // We know the google slides aren't accessible.
        className="pa11y-ignore"
        data-testid="overview-presentation"
        style={{
          border: "none",
        }}
      />
    </AspectRatio>
  );
};

export default OverviewPresentation;
