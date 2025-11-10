import { FC } from "react";
import { OakLI, OakSideMenuNavLink, OakUL } from "@oaknational/oak-components";

import { getContainerId } from "../LessonItemContainer/LessonItemContainer";
// import {
//   LessonPageLinkAnchorId,
//   LessonPageLinkDetails,
//   LessonPageLinks,
// } from "../helpers/lessonHelpers/lesson.helpers";

type LessonOverviewSideNavAnchorLinksProps = {
  contentRestricted: boolean;
  currentSectionId: string | null;
  // links: Partial<LessonPageLinks>;
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
      {
        // (Object.entries(links) as Array<
        //     [LessonPageLinkAnchorId, LessonPageLinkDetails]
        //   >)
        // .map(([anchorId, link], index) => {
        links.map((link, index) => {
          const { label, anchorId, subheading } = link;

          const linkRestricted =
            contentRestricted && anchorId !== "lesson-details";
          const targetId = linkRestricted ? "restricted-content" : anchorId;

          const isCurrent = anchorId === currentSectionId;
          const item = {
            heading: label,
            href: `#${targetId}`,
            subheading,
          };

          return (
            <OakLI key={`${anchorId}-${index}`}>
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
        })
      }
    </OakUL>
  );
};

export default LessonOverviewSideNavAnchorLinks;
