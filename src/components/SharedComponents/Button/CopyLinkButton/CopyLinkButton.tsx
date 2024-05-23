import { FC, useEffect, useState } from "react";

import { useToastContext, SHOW_DURATION } from "@/context/Toast";
import IconButton from "@/components/SharedComponents/Button/IconButton";

type CopyLinkButtonProps = {
  href?: string;
};

const CopyLinkButton: FC<CopyLinkButtonProps> = (props) => {
  const [label, setLabel] = useState("Copy link to clipboard");
  const { showToast } = useToastContext();
  const [active, setActive] = useState(false);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setActive(false);
        setLabel("Copy link to clipboard");
      }, SHOW_DURATION);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const copyLink = () => {
    if (navigator.clipboard) {
      const urlToCopy = props.href || window.location.href;
      navigator.clipboard.writeText(urlToCopy);

      const copyMessage = "Link copied to clipboard";
      setLabel(copyMessage);
      setAnnounce(copyMessage);
      showToast(copyMessage, "alert");
      setActive(true);

      setTimeout(() => {
        setAnnounce(""); // used for aria-live announcement
      }, 1000);
    } else {
      alert("Please update your browser to support this feature");
    }
  };

  return (
    <>
      <IconButton
        icon={"share"}
        htmlButtonProps={{ title: label }}
        aria-label={label}
        onClick={copyLink}
        background={"blue"}
        iconAnimateTo={active ? "tick" : undefined}
      />
      {/* Live region for aria-live announcements */}
      {announce && (
        <div
          aria-relevant="all"
          aria-live="polite"
          style={{ position: "absolute", left: "-9999px" }}
          data-testid="announce"
        >
          {announce}
        </div>
      )}
    </>
  );
};

export default CopyLinkButton;
