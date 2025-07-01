import { FC } from "react";
import { OakLI, OakSideMenuNavLink, OakUL } from "@oaknational/oak-components";

import { getContainerId } from "../LessonItemContainer/LessonItemContainer";

type LessonOverviewSideNavAnchorLinksProps = {
  contentRestricted: boolean;
  currentSectionId: string | null;
  links: {
    label: string;
    anchorId: string;
    subheading?: string;
  }[];
};
const LessonOverviewSideNavAnchorLinks: FC<
  LessonOverviewSideNavAnchorLinksProps
> = ({ links, currentSectionId, contentRestricted }) => {
  return (
    <OakUL
      $reset
      $display="flex"
      $gap="space-between-s"
      $flexDirection="column"
    >
      {links.map((link, index) => {
        const { label, anchorId, subheading } = link;

        const linkRestricted =
          contentRestricted &&
          anchorId !== "lesson-guide" &&
          anchorId !== "lesson-details";
        const targetId = linkRestricted ? "restricted-content" : anchorId;

        const isCurrent = anchorId === currentSectionId;
        const item = {
          heading: label,
          href: `#${targetId}`,
          subheading,
        };

        return (
          <OakLI key={`${label}-${index}`}>
            <OakSideMenuNavLink
              onClick={() => {
                document.getElementById(anchorId)?.scrollIntoView();
                document.getElementById(getContainerId(anchorId))?.focus();
              }}
              item={item}
              isSelected={isCurrent}
              $pt={"inner-padding-xs"}
              $pb={"inner-padding-xs"}
            />
          </OakLI>
        );
      })}
    </OakUL>
  );
};

export default LessonOverviewSideNavAnchorLinks;
