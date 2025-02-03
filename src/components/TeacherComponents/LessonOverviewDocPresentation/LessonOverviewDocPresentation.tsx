import { FC, memo } from "react";
import { OakBox } from "@oaknational/oak-components";

import AspectRatio from "@/components/SharedComponents/AspectRatio";

interface LessonOverviewPresentationProps {
  asset: string;
  title: string;
  isWorksheetLandscape?: boolean | null;
  isAdditionalMaterial?: boolean;
  docType: "additional material" | "lesson guide";
}

const LessonOverviewDocPresentation: FC<LessonOverviewPresentationProps> = ({
  asset,
  title,
  isWorksheetLandscape,
  docType,
}) => {
  const extractGoogleDocId = (url: string): string | null => {
    const pattern = /\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(pattern);
    return match ? (match[1] ?? null) : null;
  };

  const docId = extractGoogleDocId(asset);
  if (!docId) {
    return null;
  }

  const srcUrl = `https://docs.google.com/viewer?srcid=${docId}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`;

  return (
    <OakBox $ba={["border-solid-m"]} $width={"100%"}>
      <AspectRatio ratio={!isWorksheetLandscape ? "2:3" : "16:9"}>
        <iframe
          src={srcUrl}
          title={`${title} ${docType}`}
          width="100%"
          height="100%"
          // We know the google docs aren't accessible.
          className="pa11y-ignore"
          data-testid="overview-presentation-document"
          style={{
            border: "none",
          }}
          loading="eager"
        />
      </AspectRatio>
    </OakBox>
  );
};

export default memo(LessonOverviewDocPresentation);
