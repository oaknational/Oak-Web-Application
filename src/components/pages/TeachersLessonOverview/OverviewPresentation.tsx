import { FC } from "react";

import AspectRatio from "../../AspectRatio";

import OverviewAssetWrap from "./OverviewAssetWrap";

interface OverviewPresentationProps {
  asset: string;
  title: string;
  isPortrait?: boolean;
  isWorksheet: boolean;
}

const OverviewPresentation: FC<OverviewPresentationProps> = ({
  asset,
  title,
  isPortrait,
  isWorksheet,
}) => {
  const slidesId = asset.split("/")?.[5];
  const isWorksheetPortrait = isPortrait && isWorksheet;
  return (
    <OverviewAssetWrap>
      <AspectRatio ratio={isWorksheetPortrait ? "2:3" : "16:9"}>
        <iframe
          src={`https://docs.google.com/presentation/d/${slidesId}/embed?start=false&amp;loop=false&amp;delayms=3000`}
          title={`slide deck: ${title}`}
          width="100%"
          height="100%"
          // We know the google slides aren't accessible.
          className="pa11y-ignore"
          data-testid="overview-presentation"
        />
      </AspectRatio>
    </OverviewAssetWrap>
  );
};

export default OverviewPresentation;
