import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakPrimaryButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";
import { useState } from "react";

export const TeacherShareButton = ({
  label,
  shareUrl,
  shareActivated,
  variant,
}: {
  label: string;
  shareUrl: string | null;
  shareActivated?: () => void;
  variant: "primary" | "secondary";
}) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleClick = () => {
    if (!shareUrl) return;
    if (!linkCopied && shareActivated) {
      shareActivated();
    }

    setLinkCopied(true);
    // copy url to clipboard
    navigator.clipboard.writeText(shareUrl);
  };

  if (variant === "primary") {
    return (
      <OakFlex $flexDirection={"column"} $position={"relative"}>
        <OakPrimaryButton
          onClick={handleClick}
          disabled={!shareUrl}
          iconName="share"
          isTrailingIcon
          ph={["inner-padding-xs", "inner-padding-m"]}
        >
          {label}
        </OakPrimaryButton>
        {linkCopied && (
          <OakFlex
            $alignItems={"center"}
            $position={"absolute"}
            $top={["all-spacing-10", "all-spacing-11"]}
          >
            <OakIcon iconName={"tick"} $colorFilter={"text-success"} />
            <OakHeading
              tag="h2"
              $font={"heading-light-7"}
              $color={"text-success"}
            >
              Link copied to clipboard
            </OakHeading>
          </OakFlex>
        )}
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
      {linkCopied && (
        <OakFlex
          $alignItems={"center"}
          $position={"absolute"}
          $top={"all-spacing-8"}
        >
          <OakIcon iconName={"tick"} $colorFilter={"text-success"} />
          <OakHeading
            tag="h2"
            $font={"heading-light-7"}
            $color={"text-success"}
          >
            Link copied to clipboard
          </OakHeading>
        </OakFlex>
      )}
    </OakFlex>
  );
};
