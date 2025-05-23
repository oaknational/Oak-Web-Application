import { FC } from "react";
import { OakSideMenuNavLink, OakUL } from "@oaknational/oak-components";

import { getContainerId } from "../LessonItemContainer/LessonItemContainer";

type LessonOverviewSideNavAnchorLinksProps = {
  currentSectionId: string | null;
  links: {
    label: string;
    anchorId: string;
    subheading?: string;
  }[];
};
const LessonOverviewSideNavAnchorLinks: FC<
  LessonOverviewSideNavAnchorLinksProps
> = ({ links, currentSectionId }) => {
  return (
    <OakUL
      $reset
      $display="flex"
      $gap="space-between-s"
      $flexDirection="column"
    >
      {" "}
      {links.map((link, index) => {
        const { label, anchorId, subheading } = link;

        const isCurrent = anchorId === currentSectionId;
        const item = {
          heading: label,
          href: `#${anchorId}`,
          subheading,
        };

        return (
          <OakSideMenuNavLink
            onClick={() => {
              document.getElementById(anchorId)?.scrollIntoView();
              document.getElementById(getContainerId(anchorId))?.focus();
            }}
            item={item}
            isSelected={isCurrent}
            key={`${label}-${index}`}
          />
        );
      })}
    </OakUL>
  );
};

export default LessonOverviewSideNavAnchorLinks;
