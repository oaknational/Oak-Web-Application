import {
  OakUL,
  OakLI,
  OakPrimaryInvertedButton,
  parseColor,
  parseSpacing,
  OakBox,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import {
  ExamboardNavItemProps,
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const ExamBoardButton = styled(OakPrimaryInvertedButton)`
  && {
    border: 1px solid ${parseColor("border-neutral-lighter")};
    border-radius: ${parseSpacing("spacing-4")};
  }
`;

export const TopNavKS4Buttons = ({
  ks4Options,
  selectedSubject,
  parentId,
  focusManager,
  subjectSlug,
  keystageSlug,
  phaseSlug,
}: {
  ks4Options: TeachersBrowse[];
  selectedSubject: TeachersBrowse | null;
  parentId: string;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  subjectSlug: string;
  keystageSlug: string;
  phaseSlug: string;
}) => {
  const hasTierOnlyOptions = ks4Options.some((board) => {
    const hasTier = Boolean(
      (board.navItemProps as ExamboardNavItemProps).programmeFactors?.tier
        ?.slug,
    );
    const hasExamBoard = Boolean(
      (board.navItemProps as ExamboardNavItemProps).programmeFactors?.examboard
        ?.slug,
    );
    return hasTier && !hasExamBoard;
  });

  const hasExamBoardOptions = ks4Options.some((board) =>
    Boolean(
      (board.navItemProps as ExamboardNavItemProps).programmeFactors?.examboard
        ?.slug,
    ),
  );
  const panelTitle = `Choose ${
    hasTierOnlyOptions && !hasExamBoardOptions ? "tier" : "exam board"
  } for KS4 ${selectedSubject?.title}`;

  return (
    <OakFlex $flexDirection={"column"}>
      <OakBox $width={"max-content"} $position={"relative"}>
        <OakHeading
          $font={"heading-7"}
          tag="h6"
          $mt={"spacing-0"}
          $mb={"spacing-16"}
        >
          {panelTitle}
        </OakHeading>
      </OakBox>
      <OakUL
        $reset
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        id={`topnav-teachers-ks4-examboards-${selectedSubject?.slug}`}
        role="list"
      >
        {ks4Options
          .toSorted((a, b) => a.title.localeCompare(b.title))
          .map((child) => {
            if (child.navItemProps.type !== "examboardNavItem") {
              return null;
            }
            const title =
              child.navItemProps.programmeFactors?.tier?.slug &&
              child.title.toLowerCase() !==
                child.navItemProps.programmeFactors.tier?.slug
                ? `${child.title} (${child.navItemProps.programmeFactors.tier?.description})`
                : child.title;

            const tierSlug = child.navItemProps.programmeFactors?.tier?.slug;
            const examboardSlug =
              child.navItemProps.programmeFactors?.examboard?.slug;
            const key = `${tierSlug ?? ""}${tierSlug ? "-" : ""}${examboardSlug}`;

            const buttonId = focusManager?.createId(
              parentId,
              `${subjectSlug}-${phaseSlug}-${keystageSlug}-${key}`,
            );
            return (
              <OakLI key={key}>
                <ExamBoardButton
                  element={Link}
                  href={child.navItemProps.href}
                  data-testid={key}
                  width={"fit-content"}
                  id={buttonId}
                  onKeyDown={(e: React.KeyboardEvent) =>
                    focusManager?.handleTabKeyDown(e, buttonId!)
                  }
                >
                  {title}
                </ExamBoardButton>
              </OakLI>
            );
          })}
      </OakUL>
    </OakFlex>
  );
};
