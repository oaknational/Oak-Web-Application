import { FC, useState } from "react";

import { useToastContext } from "../../../context/Toast";
import ConfirmButton from "../ConfirmButton";

const CopyLinkButton: FC = () => {
  const [label, setLabel] = useState("Copy to clipboard");
  const { showToast } = useToastContext();

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      const copyMessage = "Copied to clipboard";
      setLabel(copyMessage);
      showToast(copyMessage);
    }
  };

  return (
    <ConfirmButton
      icon={"Share"}
      aria-label={label}
      onClick={copyLink}
      background={"teachersHighlight"}
    />
  );
};

export default CopyLinkButton;
