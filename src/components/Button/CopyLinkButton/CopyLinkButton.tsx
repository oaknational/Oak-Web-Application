import { FC, useEffect, useState } from "react";

import { useToastContext, SHOW_DURATION } from "../../../context/Toast";
import IconButton from "../IconButton";

const CopyLinkButton: FC = () => {
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

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      const copyMessage = "Copied to clipboard";
      setLabel(copyMessage);
      showToast(copyMessage, "alert");
      setActive(true);
    } else {
      alert("Please update your browser to support this feature");
    }
  };

  return (
    <IconButton
      icon={"share"}
      aria-label={label}
      onClick={copyLink}
      background={"teachersHighlight"}
      iconAnimateTo={active ? "tick" : undefined}
    />
  );
};

export default CopyLinkButton;
