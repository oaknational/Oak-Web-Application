import { FC, useState } from "react";

import IconButton from "../IconButton";

const CopyLinkButton: FC = () => {
  const [label, setLabel] = useState("Copy to clipboard");

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setLabel("Copied to clipboard");
    }
  };

  return (
    <IconButton
      icon={"Share"}
      aria-label={label}
      onClick={() => {
        copyLink();
      }}
    />
  );
};

export default CopyLinkButton;
