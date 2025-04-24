import { useState } from "react";

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
  };
};
