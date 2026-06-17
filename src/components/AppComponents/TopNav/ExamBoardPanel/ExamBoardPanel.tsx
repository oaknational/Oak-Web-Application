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
  SubjectsNavItem,
  TeachersSubNavData,
  ProgrammeFactorButton,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
export type ExamBoardPanelProps = {
  examBoards: ProgrammeFactorButton[];
  selectedSubject: SubjectsNavItem;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  onClick: (examBoardSlug: string, keystageSlug: string) => void;
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
  selectedSubject,
  focusManager,
  onClick,
  onLeave,
}: ExamBoardPanelProps) => {
  const parentId = focusManager?.createId(
    "teachers-secondary-ks4",
    selectedSubject.slug,
  );

  useEffect(() => {
    if (!focusManager || !parentId) return;

    focusManager.registerChildren(
      parentId,
      examboards.map((board) => {
        return (
          board.programmeFactors?.examboard?.slug ??
          board.programmeFactors?.tier?.slug ??
          ""
        );
      }),
    );

    return () => {
      focusManager.unregisterChildren(parentId);
    };
  }, [focusManager, parentId, examboards]);

  useEffect(() => {
    const panelId = `topnav-teachers-ks4-examboards-${selectedSubject.slug}`;

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
  }, [focusManager, selectedSubject.slug, examboards]);

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

  const focusNextExamBoard = (
    allButtons: HTMLElement[],
    currentIndex: number,
    isForward: boolean,
  ) => {
    if (!focusManager) return;
    const nextIndex = isForward ? currentIndex + 1 : currentIndex - 1;
    const shouldCycleToParent =
      (isForward && currentIndex === allButtons.length - 1) ||
      (!isForward && currentIndex === 0);

    if (shouldCycleToParent) {
      const parentId = focusManager.createId(
        "teachers-secondary-ks4",
        selectedSubject.slug,
      );
      const subjectsContainer = document.getElementById(
        "topnav-teachers-ks4-subjects",
      );
      const subjectButtons = Array.from(
        subjectsContainer?.querySelectorAll<HTMLElement>("a, button, input") ??
          [],
      );
      const parentIndex = subjectButtons.findIndex((el) => el.id === parentId);
      const siblingIndex = isForward ? parentIndex + 1 : parentIndex - 1;
      const siblingElement =
        siblingIndex >= 0 ? subjectButtons[siblingIndex] : undefined;

      if (siblingElement) {
        siblingElement.focus();
        onLeave();
      } else {
        document.getElementById(parentId)?.focus();
      }
    } else {
      allButtons[nextIndex]?.focus();
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const activeElement = document.activeElement as HTMLElement | null;

    if (!activeElement || e.key !== "Tab") {
      if (e.key === "Escape" && activeElement?.id) {
        focusManager?.handleEscapeKey({
          event: e,
          elementId: activeElement.id,
        });
      }
      return;
    }

    const links = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(
        'a[data-testid^="exam-board-"]',
      ),
    );

    if (links.length === 0) return;

    const currentIndex = links.indexOf(activeElement);
    if (currentIndex === -1) return;

    e.preventDefault();

    if (focusManager) {
      focusNextExamBoard(links, currentIndex, !e.shiftKey);
      return;
    }

    const submenuContainer = e.currentTarget.closest(
      `[data-testid="submenu-container"]`,
    ) as HTMLElement | null;

    const closeButton = submenuContainer
      ?.closest('[role="dialog"]')
      ?.querySelector<HTMLElement>('button[aria-label="Close"]');
    const focusables = Array.from(
      submenuContainer?.querySelectorAll<HTMLElement>(
        `a[href], button:not([disabled]), input:not([disabled])`,
      ) ?? [],
    );

    if (closeButton && !focusables.includes(closeButton)) {
      focusables.push(closeButton);
    }

    const activeIndex = focusables.indexOf(activeElement);
    if (activeIndex === -1) {
      focusables[0]?.focus();
      return;
    }

    const nextIndex = e.shiftKey
      ? (activeIndex - 1 + focusables.length) % focusables.length
      : (activeIndex + 1) % focusables.length;
    focusables[nextIndex]?.focus();
  };

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
        $display={"flex"}
        $flexDirection={"column"}
        $gap={"spacing-8"}
        $reset
        id={`topnav-teachers-ks4-examboards-${selectedSubject.slug}`}
        onKeyDown={handleListKeyDown}
        role="list"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          gap: parseSpacing("spacing-16"),
        }}
      >
        {examboards
          .toSorted((a, b) => a.buttonTitle.localeCompare(b.buttonTitle))
          .map((examboard) => {
            const title =
              examboard.programmeFactors?.tier?.slug &&
              examboard.buttonTitle.toLowerCase() !==
                examboard.programmeFactors.tier?.slug
                ? `${examboard.buttonTitle} (${examboard.programmeFactors.tier?.description})`
                : examboard.buttonTitle;
            const key = examboard.programmeFactors?.tier?.slug
              ? `exam-board-${examboard.programmeFactors.examboard?.slug}-${examboard.programmeFactors.tier?.slug}`
              : `exam-board-${examboard.programmeFactors?.examboard?.slug}`;

            return (
              <OakLI key={key}>
                <ExamBoardButton
                  element="a"
                  href={examboard.href}
                  data-testid={key}
                  onClick={() => onClick(selectedSubject.slug, "ks4")}
                  width={"fit-content"}
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
