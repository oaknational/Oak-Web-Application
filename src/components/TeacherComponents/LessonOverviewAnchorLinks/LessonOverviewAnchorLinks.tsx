import { FC } from "react";

import Button from "@/components/SharedComponents/Button";

type LessonOverviewAnchorLinksProps = {
  currentSectionId: string | null;
  links: {
    label: string;
    anchorId: string;
  }[];
};
const LessonOverviewAnchorLinks: FC<LessonOverviewAnchorLinksProps> = ({
  links,
  currentSectionId,
}) => {
  return (
    <>
      {links.map((link) => {
        const { label, anchorId } = link;

        const isCurrent = anchorId === currentSectionId;

        return (
          <Button
            onClick={() => {
              document.getElementById(anchorId)?.scrollIntoView();
            }}
            variant={isCurrent ? "brushNav" : "minimalNav"}
            $hoverStyles={["underline-link-text"]}
            label={label}
            disabled={isCurrent}
            isCurrent={isCurrent}
            icon={isCurrent ? "arrow-right" : undefined}
            iconBackground={isCurrent ? "transparent" : undefined}
            $iconPosition="trailing"
            key={label}
          />
        );
      })}
    </>
  );
};

export default LessonOverviewAnchorLinks;
