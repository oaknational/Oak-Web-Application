import {
  OakFlex,
  OakSecondaryButton,
  OakSmallPrimaryInvertedButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";

export const TeacherShareButton = ({
  label,
  variant,
  handleClick,
  shareUrl,
}: {
  label: string;
  variant: "primary" | "secondary" | "dropdown";
  handleClick: () => void;
  shareUrl: string | null;
}) => {
  if (variant === "primary") {
    return (
      <OakFlex $flexDirection={"column"} $position={"relative"}>
        <OakSecondaryButton
          onClick={handleClick}
          disabled={!shareUrl}
          iconName="share"
          isTrailingIcon
          ph={["inner-padding-xs", "inner-padding-l"]}
          pv={["inner-padding-ssx", "inner-padding-s"]}
        >
          {label}
        </OakSecondaryButton>
      </OakFlex>
    );
  } else if (variant === "dropdown") {
    return (
      <OakSmallPrimaryInvertedButton
        rel="nofollow"
        onClick={handleClick}
        disabled={!shareUrl}
        iconName="share"
        isTrailingIcon
      >
        {label}
      </OakSmallPrimaryInvertedButton>
    );
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $position={"relative"}
      $pb={["inner-padding-m", "inner-padding-none", "inner-padding-none"]}
    >
      <OakSmallSecondaryButton
        rel="nofollow"
        onClick={handleClick}
        disabled={!shareUrl}
        iconName="share"
        isTrailingIcon
      >
        {label}
      </OakSmallSecondaryButton>
    </OakFlex>
  );
};
