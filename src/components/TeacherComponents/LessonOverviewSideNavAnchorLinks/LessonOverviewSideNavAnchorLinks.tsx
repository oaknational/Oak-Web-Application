import { FC } from "react";
import { OakLI, OakSideMenuNavLink, OakUL } from "@oaknational/oak-components";

import { getContainerId } from "../LessonItemContainer/LessonItemContainer";
import {
  LessonOverviewHeaderDownloadAllButton,
  LessonOverviewHeaderDownloadAllButtonProps,
} from "../LessonOverviewHeaderDownloadAllButton/LessonOverviewHeaderDownloadAllButton";

type LessonOverviewSideNavAnchorLinksProps = {
  contentRestricted: boolean;
  currentSectionId: string | null;
  links: {
    label: string;
    anchorId: string;
    subheading?: string;
  }[];
} & LessonOverviewHeaderDownloadAllButtonProps;

const LessonOverviewSideNavAnchorLinks: FC<
  LessonOverviewSideNavAnchorLinksProps
> = ({
  links,
  currentSectionId,
  contentRestricted,
  ...downloadButtonProps
}) => {
  return (
    <OakUL $reset $display="flex" $gap="spacing-16" $flexDirection="column">
      {links.map((link, index) => {
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
          <OakLI key={`${label}-${index}`}>
            <OakSideMenuNavLink
              onClick={() => {
                document.getElementById(anchorId)?.scrollIntoView();
                document.getElementById(getContainerId(anchorId))?.focus();
              }}
              item={item}
              isSelected={isCurrent}
              $pt={"spacing-8"}
              $pb={"spacing-8"}
            />
          </OakLI>
        );
      })}
      <LessonOverviewHeaderDownloadAllButton {...downloadButtonProps} />
    </OakUL>
  );
};

export default LessonOverviewSideNavAnchorLinks;
