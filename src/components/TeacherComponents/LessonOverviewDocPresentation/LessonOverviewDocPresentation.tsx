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
  const convertToPreviewUrl = (url: string) => {
    const docsPath = url.split("/edit")[0];

    return docsPath + "/preview";
  };
  const srcUrl = convertToPreviewUrl(asset);

  return (
    <OakBox $ba={["border-solid-m"]} $width={"100%"}>
      <AspectRatio ratio={isWorksheetLandscape ? "16:9" : "2:3"}>
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
