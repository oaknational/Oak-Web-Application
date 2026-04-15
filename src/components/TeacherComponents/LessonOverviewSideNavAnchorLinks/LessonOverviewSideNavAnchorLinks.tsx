import { FC } from "react";
import {
  OakFlex,
  OakLI,
  OakSideMenuNavLink,
  OakUL,
} from "@oaknational/oak-components";

import { getContainerId } from "../LessonItemContainer/LessonItemContainer";
import {
  LessonOverviewDownloadAllButton,
  LessonOverviewDownloadAllButtonProps,
} from "../LessonOverviewDownloadAllButton/LessonOverviewDownloadAllButton";

type LessonOverviewSideNavAnchorLinksProps = {
  contentRestricted: boolean;
  currentSectionId: string | null;
  links: {
    label: string;
    anchorId: string;
    subheading?: string;
  }[];
  downloadAllButtonProps: LessonOverviewDownloadAllButtonProps;
};

const LessonOverviewSideNavAnchorLinks: FC<
  LessonOverviewSideNavAnchorLinksProps
> = ({
  links,
  currentSectionId,
  contentRestricted,
  downloadAllButtonProps,
}) => {
  return (
    <OakFlex $flexDirection="column" $gap="spacing-32">
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
      </OakUL>

      <LessonOverviewDownloadAllButton
        {...downloadAllButtonProps}
        width="fit-content"
        sizeVariant="large"
      />
    </OakFlex>
  );
};

export default LessonOverviewSideNavAnchorLinks;
