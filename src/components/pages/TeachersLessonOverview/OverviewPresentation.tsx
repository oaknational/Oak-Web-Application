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
  return (
    <OverviewAssetWrap>
      <AspectRatio ratio={"16:9"}>
        <iframe
          role="iframe"
          src={`${asset}/embed?start=false&amp;loop=false&amp;delayms=3000`}
          title={title}
          width="100%"
          height="100%"
        />
      </AspectRatio>
    </OverviewAssetWrap>
  );
};

export default OverviewPresentation;
