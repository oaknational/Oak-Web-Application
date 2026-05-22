import {
  OakBox,
  OakFlex,
  OakHeading,
  OakRadioAsButton,
  OakRadioGroup,
  OakUL,
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
import { filtersToQuery } from "@/utils/curriculum/filtering";

export type ExamBoardPanelProps = {
  examBoards: Array<{
    slug: string;
    title: string;
    programmeSlug: string;
    tierSlug: string | null;
  }>;
  selectedSubject: SubjectsNavItem;
  focusManager?: DropdownFocusManager<TeachersSubNavData>;
  onClick: (examBoardSlug: string, programmeSlug: string) => void;
  onClose: () => void;
  onLeave: () => void;
};

const ExamBoardPanel = ({
  examBoards,
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
      examBoards.map((board) => board.slug),
    );

    return () => {
      focusManager.unregisterChildren(parentId);
    };
  }, [focusManager, parentId, examBoards]);

  useEffect(() => {
    const panelId = `topnav-teachers-ks4-examboards-${selectedSubject.slug}`;

    // Wait for panel children to render before moving focus.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const panel = document.getElementById(panelId);
        const firstExamBoard = panel?.querySelector<HTMLElement>(
          `input[name="exam-boards-${selectedSubject.slug}"]`,
        );
        firstExamBoard?.focus();
      });
    });
  }, [focusManager, selectedSubject.slug, examBoards]);

  const getQueryParams = (hasParentSubject: boolean) =>
    new URLSearchParams(
      filtersToQuery(
        {
          childSubjects: hasParentSubject ? [selectedSubject.slug] : [],
          years: [],
          subjectCategories: [],
          tiers: [],
          threads: [],
          pathways: [],
          keystages: ["ks4"],
        },
        {
          childSubjects: [],
          years: [],
          subjectCategories: [],
          tiers: [],
          threads: [],
          pathways: [],
          keystages: [],
        },
      ),
    ).toString();

  if (!examBoards || examBoards.length === 0) {
    return null;
  }

  const navigateToSubject = ({ examBoardSlug }: { examBoardSlug: string }) => {
    if (examBoardSlug === null) return;
    const href = resolveOakHref({
      page: "teacher-programme",
      subjectPhaseSlug: getTeacherSubjectPhaseSlug({
        subjectSlug: selectedSubject?.slug,
        phaseSlug: "secondary",
        examboardSlug: examBoardSlug,
        pathwaySlug: null,
        subjectParentTitle: selectedSubject?.subjectParent ?? undefined,
      }),
      tab: "units",
    });
    const queryParams = getQueryParams(Boolean(selectedSubject.subjectParent));

    router.push(queryParams ? `${href}?${queryParams}` : href);

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

    if (e.key === "Enter") {
      navigateToSubject({
        examBoardSlug: activeElement?.getAttribute("value") ?? "",
      });
      return;
    }

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
      >
        <OakRadioGroup
          name={`exam-boards-${selectedSubject.slug}`}
          onChange={(e) => {
            navigateToSubject({ examBoardSlug: e.target.value });
          }}
          $gap="spacing-12"
        >
          {examBoards
            .toSorted((a, b) => a.title.localeCompare(b.title))
            .map((examBoard) => {
              let title = examBoard.tierSlug
                ? `${examBoard.title} (${examBoard.tierSlug.charAt(0).toUpperCase() + examBoard.tierSlug.slice(1)})`
                : examBoard.title;
              if (selectedSubject.slug === "maths")
                title =
                  examBoard.title.charAt(0).toUpperCase() +
                  examBoard.title.slice(1).toLowerCase();

              return (
                <OakRadioAsButton
                  key={
                    examBoard.tierSlug
                      ? `${examBoard.slug}-${examBoard.tierSlug}`
                      : examBoard.slug
                  }
                  data-testid={
                    examBoard.tierSlug
                      ? `exam-board-${examBoard.slug}-${examBoard.tierSlug}`
                      : `exam-board-${examBoard.slug}`
                  }
                  colorScheme="primary"
                  displayValue={title}
                  value={examBoard.slug}
                  width={"fit-content"}
                />
              );
            })}
        </OakRadioGroup>
      </OakUL>
    </OakFlex>
  );
};

export default ExamBoardPanel;
