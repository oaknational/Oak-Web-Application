import { OakFlex, OakSecondaryButton } from "@oaknational/oak-components";
import { useState } from "react";

export const TeacherShareButton = ({
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

  return (
    <OakFlex $flexDirection={"column"}>
      <OakSecondaryButton onClick={handleClick} disabled={!shareUrl}>
        Share with teacher
      </OakSecondaryButton>
      {linkCopied && <div>Link copied to clipboard</div>}
    </OakFlex>
  );
};
