import { FC } from "react";

import AspectRatio from "../../AspectRatio";

import OverviewAssetWrap from "./OverviewAssetWrap";

interface OverviewPresentationProps {
  asset: string;
  lessonTitle: string;
}

const OverviewPresentation: FC<OverviewPresentationProps> = ({
  asset,
  lessonTitle,
}) => {
  return (
    <OverviewAssetWrap>
      <AspectRatio ratio={"16:9"}>
        <iframe
          role="iframe"
          src={asset}
          title={lessonTitle}
          width="100%"
          height="100%"
        />
      </AspectRatio>
    </OverviewAssetWrap>
  );
};

export default OverviewPresentation;
