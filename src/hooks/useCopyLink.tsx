import { useState } from "react";

import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

export const useCopyLink = ({
  linkToCopy,
  copyActivated,
}: {
  linkToCopy: string | null;
  copyActivated?: () => void;
}) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const { setCurrentToastProps } = useOakNotificationsContext();

  const handleClick = () => {
    if (!linkToCopy) return;
    if (!linkCopied && copyActivated) {
      copyActivated();
    }

    setLinkCopied(true);
    // copy url to clipboard
    navigator.clipboard.writeText(linkToCopy);
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
