import { ReactNode } from "react";
import {
  OakIcon,
  OakIconName,
  OakUiRoleToken,
  OakFlex,
  OakP,
  OakAllSpacingToken,
  OakImage,
} from "@oaknational/oak-components";

import { Image } from "@/common-lib/cms-types";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

type AboutUsInfoCardBaseProps = {
  children: ReactNode;
  background: OakUiRoleToken;
  borderColor?: OakUiRoleToken;
  iconHeight: OakAllSpacingToken;
  iconWidth: OakAllSpacingToken;
};

type AboutUsInfoCardPropsWithIconName = AboutUsInfoCardBaseProps & {
  iconName: OakIconName;
  icon?: never;
};

type AboutUsInfoCardPropsWithIconAsset = AboutUsInfoCardBaseProps & {
  icon: Image;
  iconName?: never;
};

export type AboutUsInfoCardProps =
  | AboutUsInfoCardPropsWithIconName
  | AboutUsInfoCardPropsWithIconAsset;

export default function AboutUsInfoCard({
  children,
  iconName,
  icon,
  iconHeight,
  iconWidth,
  background,
  borderColor = "border-decorative1-stronger",
}: Readonly<AboutUsInfoCardProps>) {
  return (
    <OakFlex
      $flexGrow={1}
      $flexBasis={0}
      $borderRadius={"border-radius-m"}
      $background={background}
      $borderColor={borderColor}
      $ba={"border-solid-m"}
      $flexDirection="column"
      $alignItems={"flex-start"}
      $pa={"spacing-24"}
    >
      {iconName && (
        <OakIcon
          iconName={iconName}
          iconHeight={iconHeight}
          iconWidth={iconWidth}
          data-testid={`icon-${iconName}`}
        />
      )}
      {icon && (
        <OakImage
          src={getProxiedSanityAssetUrl(icon.asset?.url) ?? ""}
          alt={icon.altText ?? ""}
          $objectFit={"contain"}
          $width={iconWidth}
          $height={iconHeight}
        />
      )}
      {typeof children === "string" ? (
        <OakP
          $mt="spacing-16"
          $font="heading-light-6"
          $textAlign={"left"}
          $color={"text-primary"}
        >
          {children}
        </OakP>
      ) : (
        children
      )}
    </OakFlex>
  );
}
