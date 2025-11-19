import {
  OakBox,
  OakFlex,
  OakFlexProps,
  OakIcon,
  OakIconName,
  OakIconProps,
} from "@oaknational/oak-components";

type AlertType = "info" | "neutral" | "success" | "alert" | "error";

const alertTypes: Record<
  AlertType,
  {
    icon: OakIconName;
    iconColorFilter: OakIconProps["$colorFilter"];
    backgroundColour: OakFlexProps["$background"];
    borderColour: OakFlexProps["$borderColor"];
  }
> = {
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
  type?: AlertType;
  message: string;
} & OakFlexProps;

export default function Alert(props: AlertProps) {
  const { type = "info", icon, message, ...rest } = props;
  const iconResult = icon ?? alertTypes[type].icon;
  const iconColorFilterResult = alertTypes[type]?.iconColorFilter;

  return (
    <OakFlex
      data-testid="oak-inline-banner"
      $background={alertTypes[type]?.backgroundColour}
      $pa={"spacing-16"}
      $borderRadius={"border-radius-m2"}
      $borderStyle={"solid"}
      $borderColor={alertTypes[type]?.borderColour}
      $flexDirection={"row"}
      $gap="spacing-12"
      $alignItems={"center"}
      {...rest}
    >
      <OakBox>
        <OakIcon
          iconName={iconResult}
          $colorFilter={iconColorFilterResult}
          $width="spacing-32"
          $height="spacing-32"
          data-testid="inline-banner-icon"
        />
      </OakBox>
      <OakBox $font={"body-2"} data-testid="inline-banner-message">
        {message}
      </OakBox>
    </OakFlex>
  );
}
