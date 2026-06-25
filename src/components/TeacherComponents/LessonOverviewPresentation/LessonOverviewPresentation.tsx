import { FC, memo, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakSmallTertiaryInvertedButton,
  parseColor,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import AspectRatio from "@/components/SharedComponents/AspectRatio";

const StyledSlideIframe = styled.iframe`
  border: 0;
`;

const SlideEmbedFocusContainer = styled.div`
  height: 100%;
  width: 100%;

  &:focus,
  &:focus-visible {
    outline: 4px solid ${parseColor("text-primary")};
    outline-offset: 4px;
  }
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
  const presentationEditUrl = slidesId
    ? `https://docs.google.com/presentation/d/${slidesId}/edit`
    : null;
  const srcUrl =
    isAdditionalMaterial && asset
      ? `https://docs.google.com/document/d/${slidesId}/pub?embedded=true`
      : `https://docs.google.com/presentation/d/${slidesId}/embed?start=false&amp;loop=false&amp`;
  return (
    <OakFlex $flexDirection="column" $gap="spacing-12">
      <OakBox $ba={["border-solid-m"]} $width={"100%"}>
        <AspectRatio ratio={isWorksheetPortrait ? "2:3" : "16:9"}>
          <SlideEmbedFocusContainer
            tabIndex={0}
            data-testid="overview-presentation-focus-target"
            aria-label={`Slide deck preview for ${title}`}
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
              loading="eager"
            />
          </SlideEmbedFocusContainer>
        </AspectRatio>
      </OakBox>
      {!isAdditionalMaterial && presentationEditUrl && (
        <OakSmallTertiaryInvertedButton
          element={Link}
          href={presentationEditUrl}
          target="_blank"
          rel="noopener noreferrer"
          iconName="external"
          isTrailingIcon
          data-testid="open-presentation-in-google-slides"
        >
          Open in Google Slides
        </OakSmallTertiaryInvertedButton>
      )}
    </OakFlex>
  );
};

export default memo(LessonOverviewPresentation);
