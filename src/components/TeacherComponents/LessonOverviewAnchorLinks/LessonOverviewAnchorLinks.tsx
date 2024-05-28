import { FC } from "react";

import { getContainerId } from "../LessonItemContainer/LessonItemContainer";

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
              document.getElementById(getContainerId(anchorId))?.focus();
            }}
            variant={isCurrent ? "brushNav" : "minimalNav"}
            $hoverStyles={["underline-link-text"]}
            label={label}
            isCurrent={isCurrent}
            icon={isCurrent ? "arrow-right" : undefined}
            iconBackground={isCurrent ? "transparent" : undefined}
            aria-current={isCurrent ? "true" : undefined}
            $iconPosition="trailing"
            key={label}
          />
        );
      })}
    </>
  );
};

export default LessonOverviewAnchorLinks;
