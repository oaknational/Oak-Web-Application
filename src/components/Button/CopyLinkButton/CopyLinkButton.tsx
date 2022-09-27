import { FC, useEffect, useState } from "react";

import { useToastContext, SHOW_DURATION } from "../../../context/Toast";
import ConfirmButton from "../ConfirmButton";

const CopyLinkButton: FC = () => {
  const [label, setLabel] = useState("Copy to clipboard");
  const { showToast, giveRole } = useToastContext();
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
      showToast(copyMessage);
      giveRole("alert");
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
