import { useState } from "react";

import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

export const useTeacherShareButton = ({
  shareUrl,
  shareActivated,
}: {
  shareUrl: string | null;
  shareActivated?: () => void;
}) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const { setCurrentToastProps } = useOakNotificationsContext();

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
