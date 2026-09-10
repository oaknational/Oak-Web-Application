import { FC, memo } from "react";
import { OakBox } from "@oaknational/oak-components";
import styled from "styled-components";

import AspectRatio from "@/components/SharedComponents/AspectRatio";
import errorReporter from "@/common-lib/error-reporter";

const StyledIframe = styled.iframe<{ shouldZoom: boolean }>`
  ${({ shouldZoom }) =>
    shouldZoom === true &&
    ` @media (min-width: 750px) {
          zoom: 0.8;
        }
          @media (max-width: 750px) {
          zoom: 0.5;
        }
    `}
`;

interface LessonOverviewPresentationProps {
  asset: string;
  title: string;
  isWorksheetLandscape?: boolean | null;
  docType: "additional material" | "lesson guide";
}

const reportError = errorReporter("googleDocPreview");

const convertToPreviewUrl = (url: string) => {
  if (!url.includes("/edit")) {
    return null;
  }
  const docsPath = url.split("/edit")[0];

  return docsPath + "/preview";
};

const LessonOverviewDocPresentation: FC<LessonOverviewPresentationProps> = ({
  asset,
  title,
  isWorksheetLandscape,
  docType,
}) => {
  const srcUrl = convertToPreviewUrl(asset);

  if (!srcUrl) {
    reportError(
      new Error(
        `Unable to generate google doc preview url for asset with url: ${asset}`,
      ),
    );
    return null;
  }

  const shouldBeNonInteractive =
    docType === "lesson guide" || docType === "additional material";

  return (
    <OakBox $ba={["border-solid-m"]} $width={"100%"}>
      <AspectRatio ratio={isWorksheetLandscape ? "16:9" : "2:3"}>
        <StyledIframe
          src={srcUrl}
          title={`${title} ${docType}`}
          width="100%"
          height="100%"
          data-testid="overview-presentation-document"
          style={{
            border: "none",
          }}
          loading="eager"
          shouldZoom={isWorksheetLandscape ?? false}
          // We know the google docs aren't accessible.
          className="pa11y-ignore"
          // avoid focus traps
          tabIndex={shouldBeNonInteractive ? -1 : undefined}
          aria-hidden={shouldBeNonInteractive ? "true" : undefined}
        />
      </AspectRatio>
    </OakBox>
  );
};

export default memo(LessonOverviewDocPresentation);
