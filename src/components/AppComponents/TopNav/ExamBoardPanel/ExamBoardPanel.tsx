import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLI,
  OakPrimaryInvertedButton,
  OakUL,
  parseColor,
  parseSpacing,
} from "@oaknational/oak-components";
import { useEffect } from "react";
import styled from "styled-components";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";
import {
  createFocusId,
  getExamBoardFocusSlug,
} from "../DropdownFocusManager/focusTree";

import {
  SubjectsNavItem,
  TeachersSubNavData,
  ProgrammeFactorButton,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
export type ExamBoardPanelProps = {
  examBoards: ProgrammeFactorButton[];
  phaseSlug: "primary" | "secondary";
  viewType: string;
  selectedSubject: SubjectsNavItem;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  onClick: (examBoardSlug: string, viewType: string) => void;
  onLeave: () => void;
};

const ExamBoardButton = styled(OakPrimaryInvertedButton)`
  && {
    border: 1px solid ${parseColor("border-neutral-lighter")};
    border-radius: ${parseSpacing("spacing-4")};
  }
`;

const ExamBoardPanel = ({
  examBoards: examboards,
  phaseSlug,
  viewType,
  selectedSubject,
  focusManager,
  onClick,
  onLeave,
}: ExamBoardPanelProps) => {
  const subjectId =
    createFocusId(
      "teachers",
      `teachers-${phaseSlug}-${viewType}`,
      selectedSubject.slug,
    ) ?? `teachers-${phaseSlug}-${viewType}-${selectedSubject.slug}`;

  useEffect(() => {
    const panelId = `topnav-teachers-${viewType}-examboards-${selectedSubject.slug}`;

    // Wait for panel children to render before moving focus.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const panel = document.getElementById(panelId);
        const firstExamBoard = panel?.querySelector<HTMLElement>(
          'a[data-testid^="exam-board-"]',
        );
        firstExamBoard?.focus();
      });
    });
  }, [focusManager, viewType, selectedSubject.slug, examboards]);

  if (!examboards || examboards.length === 0) {
    return null;
  }

  const hasTierOnlyOptions = examboards.some((board) => {
    const hasTier = Boolean(board.programmeFactors?.tier?.slug);
    const hasExamBoard = Boolean(board.programmeFactors?.examboard?.slug);
    return hasTier && !hasExamBoard;
  });

  const hasExamBoardOptions = examboards.some((board) =>
    Boolean(board.programmeFactors?.examboard?.slug),
  );

  const panelTitle = `Choose ${
    hasTierOnlyOptions && !hasExamBoardOptions ? "tier" : "exam board"
  } for KS4 ${selectedSubject.title}`;

  const sortedExamBoards = examboards.toSorted((a, b) =>
    a.buttonTitle.localeCompare(b.buttonTitle),
  );

  const handleExamBoardKeyDown = (
    e: React.KeyboardEvent,
    buttonId: string,
    index: number,
  ) => {
    if (e.key === "Escape") {
      focusManager?.handleEscapeKey({ event: e, elementId: buttonId });
      return;
    }

    if (e.key !== "Tab") return;

    const leavingPanel =
      (!e.shiftKey && index === sortedExamBoards.length - 1) ||
      (e.shiftKey && index === 0);

    if (leavingPanel) {
      onLeave();
    }

    focusManager?.handleKeyDown(e, buttonId);
  };

  return (
    <OakFlex $flexDirection={"column"}>
      <OakBox $position={"relative"}>
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
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        $reset
        id={`topnav-teachers-${viewType}-examboards-${selectedSubject.slug}`}
        role="list"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          gap: parseSpacing("spacing-16"),
        }}
      >
        {sortedExamBoards.map((examboard, index) => {
          const title =
            examboard.programmeFactors?.tier?.slug &&
            examboard.buttonTitle.toLowerCase() !==
              examboard.programmeFactors.tier?.slug
              ? `${examboard.buttonTitle} (${examboard.programmeFactors.tier?.description})`
              : examboard.buttonTitle;
          const buttonId =
            createFocusId(
              "teachers",
              subjectId,
              getExamBoardFocusSlug(examboard),
            ) ?? `${subjectId}-${getExamBoardFocusSlug(examboard)}`;
          const key = examboard.programmeFactors?.tier?.slug
            ? `exam-board-${examboard.programmeFactors.examboard?.slug}-${examboard.programmeFactors.tier?.slug}`
            : `exam-board-${examboard.programmeFactors?.examboard?.slug}`;

          return (
            <OakLI key={key}>
              <ExamBoardButton
                element="a"
                href={examboard.href}
                id={buttonId}
                data-testid={key}
                onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) =>
                  handleExamBoardKeyDown(e, buttonId, index)
                }
                onClick={() => onClick(selectedSubject.slug, viewType)}
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

export default ExamBoardPanel;
