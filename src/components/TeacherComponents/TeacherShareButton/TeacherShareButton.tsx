import {
  OakFlex,
  OakSecondaryButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";

export const TeacherShareButton = ({
  label,
  variant,
  handleClick,
  shareUrl,
}: {
  label: string;
  variant: "primary" | "secondary";
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
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $position={"relative"}
      $pb={["inner-padding-m", "inner-padding-none", "inner-padding-none"]}
    >
      <OakSmallSecondaryButton
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
