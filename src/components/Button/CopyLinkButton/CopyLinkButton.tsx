import { FC, useEffect, useState } from "react";

import { useToastContext, SHOW_DURATION } from "../../../context/Toast";
import ConfirmButton from "../ConfirmButton";

type CopyLinkButtonProps = {
  shareTitle: string;
  shareText: string;
};

const CopyLinkButton: FC<CopyLinkButtonProps> = ({ shareTitle, shareText }) => {
  const [label, setLabel] = useState("Copy to clipboard");
  const { showToast } = useToastContext();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setActive(false);
      }, SHOW_DURATION);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const copyLink = async () => {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Page shared", "alert");
        setActive(true);
      } catch (error) {
        console.error(`Failed to share: ${error}`);
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url);
      const copyMessage = "Copied to clipboard";
      setLabel(copyMessage);
      showToast(copyMessage, "alert");
      setActive(true);
    }
  };

  return (
    <ConfirmButton
      icon={"Share"}
      aria-label={label}
      onClick={copyLink}
      background={"teachersHighlight"}
      animate={active}
    />
  );
};

export default CopyLinkButton;
