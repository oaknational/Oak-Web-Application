import { FC } from "react";

import AspectRatio from "../../AspectRatio";

import OverviewAssetWrap from "./OverviewAssetWrap";

interface OverviewPresentationProps {
  asset: string;
  title: string;
}

const OverviewPresentation: FC<OverviewPresentationProps> = ({
  asset,
  title,
}) => {
  const slidesId = asset.split("/")?.[5];
  return (
    <OverviewAssetWrap>
      <AspectRatio ratio={"16:9"}>
        <iframe
          src={`https://docs.google.com/presentation/d/${slidesId}/embed?start=false&amp;loop=false&amp;delayms=3000`}
          title={`slide deck: ${title}`}
          width="100%"
          height="100%"
          // We know the google slides aren't accessible.
          className="pa11y-ignore"
        />
      </AspectRatio>
    </OverviewAssetWrap>
  );
};

export default OverviewPresentation;
