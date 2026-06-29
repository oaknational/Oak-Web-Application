import { FC, memo, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakFocusIndicator,
} from "@oaknational/oak-components";
import styled from "styled-components";

import AspectRatio from "@/components/SharedComponents/AspectRatio";

const StyledSlideIframe = styled.iframe`
  border: 0;
`;

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
      : `https://docs.google.com/presentation/d/${slidesId}/embed?start=false&loop=false`;
  return (
    <OakFlex $flexDirection="column" $gap="spacing-12">
      <OakBox $ba={["border-solid-m"]} $width={"100%"}>
        <AspectRatio ratio={isWorksheetPortrait ? "2:3" : "16:9"}>
          <OakFocusIndicator
            tabIndex={0}
            style={{ width: "100%", height: "100%" }}
            role="group"
            data-testid="overview-presentation-focus-target"
            aria-label={`${isAdditionalMaterial ? "Document" : "Slide deck"} preview for ${title}`}
          >
            <StyledSlideIframe
              src={srcUrl}
              title={`Presentation: ${title}`}
              width="100%"
              height="100%"
              // We know the google slides aren't accessible.
              className="pa11y-ignore"
              data-testid="overview-presentation"
              allowFullScreen
              // Keep the embedded player out of the tab order to avoid keyboard traps.
              tabIndex={-1}
              aria-hidden="true"
              loading="eager"
            />
          </OakFocusIndicator>
        </AspectRatio>
      </OakBox>
    </OakFlex>
  );
};

export default memo(LessonOverviewPresentation);
