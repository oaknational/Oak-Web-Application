import { ReactNode } from "react";
import {
  OakIcon,
  OakIconName,
  OakUiRoleToken,
  OakFlex,
  OakP,
  OakAllSpacingToken,
} from "@oaknational/oak-components";

export interface CurricInfoCardProps {
  children: ReactNode;
  iconName?: OakIconName;
  background: OakUiRoleToken;
  iconHeight: OakAllSpacingToken;
  iconWidth: OakAllSpacingToken;
}

export default function CurricInfoCard({
  children,
  iconName = "books",
  iconHeight,
  iconWidth,
  background,
}: Readonly<CurricInfoCardProps>) {
  return (
    <OakFlex
      $flexGrow={1}
      $flexBasis={0}
      $borderRadius={"border-radius-m"}
      $background={background}
      $borderColor={"border-decorative1-stronger"}
      $ba={"border-solid-m"}
      $flexDirection="column"
      $alignItems={"flex-start"}
      $pa={"spacing-24"}
    >
      <OakIcon
        iconName={iconName}
        $mb={"spacing-16"}
        iconHeight={iconHeight}
        iconWidth={iconWidth}
        data-testid={`icon-${iconName}`}
      />
      <OakP $font="heading-light-6" $textAlign={"left"} $color={"text-primary"}>
        {children}
      </OakP>
    </OakFlex>
  );
}
