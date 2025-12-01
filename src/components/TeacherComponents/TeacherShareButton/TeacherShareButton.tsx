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
          ph={["spacing-8", "spacing-20"]}
          pv={["spacing-4", "spacing-12"]}
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
      $pb={["spacing-16", "spacing-0", "spacing-0"]}
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
