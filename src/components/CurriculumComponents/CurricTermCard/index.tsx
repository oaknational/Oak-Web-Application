import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakSpan,
} from "@oaknational/oak-components";
import { ReactNode } from "react";

export type CurricTermCardProps = {
  title: string;
  children: ReactNode;
  coveredNumberOfLessons: number;
  totalNumberOfLessons: number;
};
export function CurricTermCard({
  title,
  children,
  coveredNumberOfLessons,
  totalNumberOfLessons,
}: Readonly<CurricTermCardProps>) {
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"all-spacing-3"}
      $background={"bg-decorative4-very-subdued"}
      $pa={"inner-padding-m"}
      $borderRadius={"border-radius-s"}
    >
      <OakBox>
        <OakHeading tag="h5" $font={"heading-5"}>
          {title}
        </OakHeading>
        <OakFlex $gap={"all-spacing-1"} $alignItems={"center"}>
          <OakSpan>
            {coveredNumberOfLessons}/{totalNumberOfLessons} lessons scheduled
          </OakSpan>
          <OakIcon iconName="info" />
        </OakFlex>
      </OakBox>
      {children}
    </OakFlex>
  );
}
