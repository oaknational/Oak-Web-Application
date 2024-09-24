import {
  OakBox,
  OakFlex,
  OakFlexProps,
  OakIcon,
  OakIconName,
} from "@oaknational/oak-components";

export const alertTypes = {
  info: {
    icon: "info",
    iconColorFilter: "black",
    backgroundColour: "lavender30",
    borderColour: "lavender",
  },
  neutral: {
    icon: "info",
    iconColorFilter: "black",
    backgroundColour: "grey20",
    borderColour: "grey40",
  },
  success: {
    icon: "success",
    iconColorFilter: "black",
    backgroundColour: "mint30",
    borderColour: "mint110",
  },
  alert: {
    icon: "warning",
    iconColorFilter: "black",
    backgroundColour: "lemon30",
    borderColour: "lemon50",
  },
  error: {
    icon: "error",
    iconColorFilter: "red",
    backgroundColour: "red30",
    borderColour: "red",
  },
} as const;

type AlertProps = {
  icon?: OakIconName;
  type?: "info" | "neutral" | "success" | "alert" | "error";
  message: string;
} & OakFlexProps;

export default function Alert(props: AlertProps) {
  const { type = "info", icon, message } = props;
  const iconResult = icon || alertTypes[type]?.icon;
  const iconColorFilterResult = alertTypes[type]?.iconColorFilter;

  return (
    <OakFlex
      data-testid="oak-inline-banner"
      $background={alertTypes[type]?.backgroundColour}
      $pa={"inner-padding-m"}
      $borderRadius={"border-radius-m"}
      $borderStyle={"solid"}
      $borderColor={alertTypes[type]?.borderColour}
      $flexDirection={"row"}
      $gap="space-between-xs"
      $alignItems={"center"}
      {...props}
    >
      <OakBox>
        <OakIcon
          iconName={iconResult || "info"}
          $colorFilter={iconColorFilterResult}
          $width="all-spacing-7"
          $height="all-spacing-7"
          data-testid="inline-banner-icon"
        />
      </OakBox>
      <OakBox $font={"body-2"} data-testid="inline-banner-message">
        {message}
      </OakBox>
    </OakFlex>
  );
}
