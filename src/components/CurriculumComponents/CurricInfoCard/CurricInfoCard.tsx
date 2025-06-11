import { ReactNode } from "react";
import {
  OakIcon,
  OakIconName,
  OakColorToken,
  OakFlex,
  OakP,
  OakAllSpacingToken,
} from "@oaknational/oak-components";

export interface CurricInfoCardProps {
  children: ReactNode;
  iconName?: OakIconName;
  background: OakColorToken;
  iconHeight: OakAllSpacingToken;
  iconWidth: OakAllSpacingToken;
}

export default function CurricInfoCard({
  children,
  iconName = "books",
  iconHeight,
  iconWidth,
  background,
}: CurricInfoCardProps) {
  return (
    <OakFlex
      $flexGrow={1}
      $flexBasis={["auto", 0]}
      $borderRadius={"border-radius-m"}
      $background={background}
      $borderColor={"mint110"}
      $ba={"border-solid-m"}
      $flexDirection="column"
      $alignItems={"flex-start"}
      $pa={"inner-padding-xl"}
    >
      <OakIcon
        iconName={iconName}
        $mb={"space-between-s"}
        iconHeight={iconHeight}
        iconWidth={iconWidth}
      />
      <OakP $font="heading-light-6" $textAlign={"left"} $color={"black"}>
        {children}
      </OakP>
    </OakFlex>
  );
}
