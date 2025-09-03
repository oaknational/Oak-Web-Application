import { useState } from "react";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";

export const useTeacherShareButton = ({
  shareUrl,
  shareActivated,
}: {
  shareUrl: string | null;
  shareActivated?: () => void;
}) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const { setCurrentToastProps } = useOakToastContext();

  const handleClick = () => {
    if (!shareUrl) return;
    if (!linkCopied && shareActivated) {
      shareActivated();
    }

    setLinkCopied(true);
    // copy url to clipboard
    navigator.clipboard.writeText(shareUrl);
    setCurrentToastProps({
      message: "Link copied to clipboard",
      variant: "green",
      autoDismiss: true,
      showIcon: true,
    });
  };
  return {
    handleClick,
    linkCopied,
  };
};
