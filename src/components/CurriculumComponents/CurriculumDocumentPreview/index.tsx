import { ComponentProps, FC } from "react";
import { OakBox, OakTypography } from "@oaknational/oak-components";

type OakBoxProps = ComponentProps<typeof OakBox>;
const CurriculumDocumentPreview: FC<OakBoxProps> = ({ props }) => {
  return (
    <OakBox
      {...props}
      style={{
        aspectRatio: "2 / 3",
        background: "#eee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OakTypography $font={["body-2", "body-1"]} $color="grey50">
        Document preview
      </OakTypography>
    </OakBox>
  );
};

export default CurriculumDocumentPreview;
