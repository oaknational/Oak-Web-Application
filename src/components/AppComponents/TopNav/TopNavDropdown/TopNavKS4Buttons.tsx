import {
  OakUL,
  OakLI,
  OakPrimaryInvertedButton,
  parseColor,
  parseSpacing,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import {
  Ks4OptionsMenu,
  SubjectsMenu,
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
  subject,
  parentId,
  focusManager,
  onClick,
  onExamboardPanelClose,
}: {
  ks4Options: Ks4OptionsMenu[];
  subject: SubjectsMenu;
  parentId: string;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  onClick: (subject: SubjectsMenu, keystage: string) => void;
  onExamboardPanelClose: () => void;
}) => {
  const hasTierOnlyOptions = ks4Options.some((board) => {
    const hasTier = Boolean(board.programmeFactors?.tier?.slug);
    const hasExamBoard = Boolean(board.programmeFactors?.examboard?.slug);
    return hasTier && !hasExamBoard;
  });

  const hasExamBoardOptions = ks4Options.some((board) =>
    Boolean(board.programmeFactors?.examboard?.slug),
  );
  const panelTitle = `Choose ${
    hasTierOnlyOptions && !hasExamBoardOptions ? "tier" : "exam board"
  } for KS4 ${subject?.title}`;

  return (
    <OakFlex $flexDirection={"column"} $minWidth="spacing-240">
      <OakHeading
        $font={"heading-7"}
        tag="h6"
        $mt={"spacing-0"}
        $mb={"spacing-16"}
      >
        {panelTitle}
      </OakHeading>
      <OakUL
        $reset
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        id={`topnav-teachers-ks4-examboards-${subject?.slug}`}
        role="list"
      >
        {ks4Options
          .toSorted((a, b) => a.title.localeCompare(b.title))
          .map((child) => {
            const title =
              child.programmeFactors?.tier?.slug &&
              child.title.toLowerCase() !== child.programmeFactors.tier?.slug
                ? `${child.title} (${child.programmeFactors.tier?.description})`
                : child.title;

            const buttonId = focusManager?.createId(child.slug, parentId);

            return (
              <OakLI key={child.slug}>
                <ExamBoardButton
                  element={Link}
                  href={child.href}
                  width={"fit-content"}
                  id={buttonId}
                  onKeyDown={(e: React.KeyboardEvent) =>
                    focusManager?.handleTabKeyDown(
                      e,
                      buttonId!,
                      onExamboardPanelClose,
                    )
                  }
                  onClick={() => {
                    onClick(subject, "ks4");
                    onExamboardPanelClose();
                  }}
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
