import { FC } from "react";
import {
  OakBox,
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
import { LessonResource } from "../../../app/(core)/programmes/[subjectPhaseSlug]/units/[unitSlug]/lessons/[lessonSlug]/Components/getLessonResources";
import { DISPLAY_TITLES_BY_RESOURCE } from "../../../app/(core)/programmes/[subjectPhaseSlug]/units/[unitSlug]/lessons/[lessonSlug]/Components/lessonResourceConstants";

type LessonOverviewSideNavAnchorLinksProps = {
  contentRestricted: boolean;
  currentSectionId: string | null;
  links: SideNavLink[];
  downloadAllButtonProps: LessonOverviewDownloadAllButtonProps;
};

export type SideNavLink = {
  label: string;
  anchorId: string;
  subheading?: string;
};

export function getSideNavLinksFromResources(
  resources: LessonResource[],
): SideNavLink[] {
  const hasStarterQuiz = resources.some(
    (r) => r.resourceType === "starter-quiz",
  );
  const hasExitQuiz = resources.some((r) => r.resourceType === "exit-quiz");
  const hasBothQuizzes = hasStarterQuiz && hasExitQuiz;

  const links: SideNavLink[] = [];
  let quizLinkAdded = false;

  for (const resource of resources) {
    const isQuizResource =
      resource.resourceType === "starter-quiz" ||
      resource.resourceType === "exit-quiz";

    if (isQuizResource) {
      // Only add the quiz link once, at the position of the first quiz
      if (!quizLinkAdded) {
        if (hasBothQuizzes) {
          links.push({
            label: "Quizzes",
            anchorId: resource.anchorId, // "quiz" for first quiz when both exist
            subheading: `${DISPLAY_TITLES_BY_RESOURCE["starter-quiz"]} \n${DISPLAY_TITLES_BY_RESOURCE["exit-quiz"]}`,
          });
        } else if (hasStarterQuiz) {
          links.push({
            label: "Quizzes",
            anchorId: resource.anchorId, // "starter-quiz"
            subheading: DISPLAY_TITLES_BY_RESOURCE["starter-quiz"],
          });
        } else if (hasExitQuiz) {
          links.push({
            label: "Quizzes",
            anchorId: resource.anchorId, // "exit-quiz"
            subheading: DISPLAY_TITLES_BY_RESOURCE["exit-quiz"],
          });
        }
        quizLinkAdded = true;
      }
    } else {
      links.push({
        label: resource.title,
        anchorId: resource.resourceType,
      });
    }
  }

  return links;
}

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

      <OakBox $ml="spacing-16" $display={["block", "block", "none"]}>
        <LessonOverviewDownloadAllButton
          {...downloadAllButtonProps}
          width="fit-content"
          sizeVariant="small"
        />
      </OakBox>
      <OakBox $ml="spacing-16" $display={["none", "none", "block"]}>
        <LessonOverviewDownloadAllButton
          {...downloadAllButtonProps}
          width="fit-content"
          sizeVariant="large"
        />
      </OakBox>
    </OakFlex>
  );
};

export default LessonOverviewSideNavAnchorLinks;
