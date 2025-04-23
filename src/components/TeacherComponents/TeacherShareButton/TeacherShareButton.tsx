import { useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakSecondaryButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";

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
              aria-live="polite"
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
            aria-live="polite"
          >
            Link copied to clipboard
          </OakHeading>
        </OakFlex>
      )}
    </OakFlex>
  );
};
