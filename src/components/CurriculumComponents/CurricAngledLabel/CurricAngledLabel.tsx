import { OakSpan } from "@oaknational/oak-components";

type CurricAngledLabelProps = {
  children: React.ReactNode;
};

export const CurricAngledLabel = ({ children }: CurricAngledLabelProps) => {
  return (
    <OakSpan
      $background="bg-decorative1-main"
      $pa="inner-padding-ssx"
      $borderRadius="border-radius-square"
      style={{
        display: "inline-block",
        transform: "rotate(-0.381deg)",
      }}
    >
      {children}
    </OakSpan>
  );
};
