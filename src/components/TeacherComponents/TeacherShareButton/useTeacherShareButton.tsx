import { useState } from "react";
import { OakFlex, OakIcon, OakHeading } from "@oaknational/oak-components";

export const useTeacherShareButton = ({
  shareUrl,
  shareActivated,
}: {
  shareUrl: string | null;
  shareActivated?: () => void;
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
  return {
    handleClick,
    linkCopied,
    copiedComponent: <LinkCopied linkCopied={linkCopied} />,
  };
};

export const LinkCopied = ({ linkCopied }: { linkCopied: boolean }) => {
  return (
    <OakFlex
      $alignItems={"center"}
      $visibility={linkCopied ? "visible" : "hidden"}
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
  );
};
