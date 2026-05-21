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
    const parentPrefix =
      focusManager?.createId("teachers-secondary-ks4", selectedSubject.slug) ??
      `teachers-secondary-ks4-${selectedSubject.slug}`;
    const panelId = `topnav-teachers-ks4-examboards-${selectedSubject.slug}`;

    // Wait for panel children to render before moving focus.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const panel = document.getElementById(panelId);
        const firstExamBoard = panel?.querySelector<HTMLElement>(
          `button[id^="${parentPrefix}-"]`,
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
    const activeElement = document.activeElement as HTMLElement;
    if (!activeElement.id) return;

    if (e.key === "Tab" && focusManager) {
      const parentIdPrefix = focusManager.createId(
        "teachers-secondary-ks4",
        selectedSubject.slug,
      );
      const allButtons = Array.from(
        document.querySelectorAll(`[id^="${parentIdPrefix}-"]`),
      ) as HTMLElement[];

      if (allButtons.length === 0) return;

      const currentIndex = allButtons.findIndex(
        (btn) => btn.id === activeElement.id,
      );
      if (currentIndex === -1) return;

      e.preventDefault();
      focusNextExamBoard(allButtons, currentIndex, !e.shiftKey);
    }

    focusManager?.handleEscapeKey({ event: e, elementId: activeElement.id });
  };

  return (
    <OakFlex $flexDirection={"column"}>
      <OakBox $width={"fit-content"} $position={"relative"}>
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
          onChange={(e) => navigateToSubject({ examBoardSlug: e.target.value })}
          value={selectedSubject.slug}
          $gap="spacing-12"
        >
          {examBoards.map((examBoard) => {
            const parentId =
              focusManager?.createId(
                "teachers-secondary-ks4",
                selectedSubject.slug,
              ) ?? `teachers-secondary-ks4-${selectedSubject.slug}`;
            const buttonId =
              focusManager?.createId(parentId, examBoard.slug) ??
              `${parentId}-${examBoard.slug}`;

            const key = buttonId || `${selectedSubject.slug}-${examBoard.slug}`;
            const isSelected = selectedSubject.slug === examBoard.slug;
            const selectedIndex = isSelected ? 0 : -1;
            const tabIndex = focusManager ? selectedIndex : 0;

            return (
              <button
                key={key}
                id={buttonId}
                type="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigateToSubject({ examBoardSlug: examBoard.slug });
                  }
                }}
                tabIndex={tabIndex}
                style={{
                  display: "inline-block",
                  padding: 0,
                  margin: 0,
                  border: "none",
                  background: "none",
                }}
              >
                <OakRadioAsButton
                  data-testid={buttonId}
                  colorScheme="primary"
                  displayValue={examBoard.title}
                  value={examBoard.slug}
                  width={"fit-content"}
                />
              </button>
            );
          })}
        </OakRadioGroup>
      </OakUL>
    </OakFlex>
  );
};

export default ExamBoardPanel;
