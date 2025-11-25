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
      $gap={"spacing-12"}
      $background={"bg-decorative4-very-subdued"}
      $pa={"spacing-16"}
      $borderRadius={"border-radius-s"}
    >
      <OakBox>
        <OakHeading tag="h5" $font={"heading-5"}>
          {title}
        </OakHeading>
        <OakFlex $gap={"spacing-4"} $alignItems={"center"}>
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
