import {
  OakBox,
  OakFlex,
  OakHeading,
  OakSecondaryButton,
  OakUL,
  parseSpacing,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import {
  SubjectsNavItem,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { convertUnitSlugToTitle } from "@/components/TeacherViews/Search/helpers";
import { resolveOakHref } from "@/common-lib/urls";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";

export type ExamBoardPanelProps = {
  examBoards: Array<{
    slug: string;
    title: string;
    programmeSlug: string;
    tierSlug: string | null;
  }>;
  selectedSubject: SubjectsNavItem;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  onClick: (examBoardSlug: string, keystageSlug: string) => void;
  onClose: () => void;
  onLeave: () => void;
};

const ExamBoardPanel = ({
  examBoards: examboards,
  selectedSubject,
  focusManager,
  onClick,
  onClose,
  onLeave,
}: ExamBoardPanelProps) => {
  const router = useRouter();
  const parentId = focusManager?.createId(
    "teachers-secondary-ks4",
    selectedSubject.slug,
  );

  useEffect(() => {
    if (!focusManager || !parentId) return;

    focusManager.registerChildren(
      parentId,
      examboards.map((board) => board.slug),
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

  const navigateToSubject = (href: string) => {
    router.push(href);

    onClick(selectedSubject.slug, "ks4");
    onClose();
  };

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

    const radios = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(
        `input[name="exam-boards-${selectedSubject.slug}"]`,
      ),
    );

    if (radios.length === 0) return;

    const currentIndex = radios.indexOf(activeElement);
    if (currentIndex === -1) return;

    e.preventDefault();

    if (focusManager) {
      focusNextExamBoard(radios, currentIndex, !e.shiftKey);
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
          Choose exam board for KS4{" "}
          {convertUnitSlugToTitle(selectedSubject.slug, false)}
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
          .toSorted((a, b) => a.title.localeCompare(b.title))
          .map((examboard) => {
            const title =
              examboard.tierSlug &&
              examboard.title.toLowerCase() !== examboard.tierSlug
                ? `${examboard.title} (${examboard.tierSlug.charAt(0).toUpperCase() + examboard.tierSlug.slice(1)})`
                : examboard.title;
            const key = examboard.tierSlug
              ? `exam-board-${examboard.slug}-${examboard.tierSlug}`
              : `exam-board-${examboard.slug}`;

            const href = resolveOakHref({
              page: "teacher-programme",
              subjectPhaseSlug: getTeacherSubjectPhaseSlug({
                subjectSlug: selectedSubject?.slug,
                phaseSlug: "secondary",
                examboardSlug: examboard.slug,
                pathwaySlug: null,
                subjectParentTitle: selectedSubject?.subjectParent ?? undefined,
              }),
              tab: "units",
              query: {
                keystages: "ks4",
                tiers: examboard.tierSlug ?? undefined,
                child_subjects: selectedSubject.subjectParent
                  ? selectedSubject.slug
                  : undefined,
              },
            });

            return (
              <OakSecondaryButton
                element="a"
                href={href}
                key={key}
                data-testid={key}
                onClick={() => navigateToSubject(href)}
                width={"fit-content"}
              >
                {title}
              </OakSecondaryButton>
            );
          })}
      </OakUL>
    </OakFlex>
  );
};

export default ExamBoardPanel;
