import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";
import ExamBoardPanel from "../ExamBoardPanel/ExamBoardPanel";
import { MaybeVisuallyHidden } from "../TopNav";
import { createFocusId } from "../DropdownFocusManager/focusTree";

import { TopNavDropdownProps } from "./TopNavDropdown";

import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData as TeachersData,
  SubjectsNavItem,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const TopNavSubjectButtons = ({
  selectedMenu,
  subjects,
  selectedSubject,
  keyStageSlug,
  handleClick,
  focusManager,
  phase,
  onExamBoardPanelOpen,
  closeExamBoardPanel,
}: {
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  phase: "primary" | "secondary";
  subjects: SubjectsNavItem[];
  selectedSubject: SubjectsNavItem | null;
  keyStageSlug: string;
  handleClick: (subject: string, keystage: string) => void;
  focusManager?: DropdownFocusManager<TeachersData>;
  onExamBoardPanelOpen?: (subject: SubjectsNavItem) => void;
  closeExamBoardPanel: () => void;
}) => {
  const handleSubjectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    subject: SubjectsNavItem,
  ) => {
    if (subject.examBoards && subject.examBoards.length > 0) {
      e.preventDefault();
      onExamBoardPanelOpen?.(subject);
      return;
    }

    handleClick(subject.slug, keyStageSlug);
  };

  const focusFirstExamBoardControl = (subjectSlug: string) => {
    const examBoardPanelId = `topnav-teachers-${keyStageSlug}-examboards-${subjectSlug}`;
    const panel = document.getElementById(examBoardPanelId);
    const firstFocusable = panel?.querySelector<HTMLElement>(
      "input:not([disabled]), button:not([disabled]), [role='radio']:not([aria-disabled='true'])",
    );
    firstFocusable?.focus();
  };

  return (
    <>
      <OakUL
        $display={"flex"}
        $flexGrow={1}
        $flexWrap={"wrap"}
        $alignContent={"baseline"}
        $gap={"spacing-16"}
        $reset
        id={`topnav-teachers-${keyStageSlug}-subjects`}
      >
        {subjects &&
          subjects.length > 0 &&
          subjects.map((subject) => {
            const { slug, href } = subject;
            const buttonId = createFocusId(
              "teachers",
              `teachers-${phase}-${keyStageSlug}`,
              slug,
            );

            return (
              <OakLI key={subject.title}>
                <OakSubjectIconButton
                  variant={"horizontal"}
                  element={subject.examBoards?.length ? "button" : Link}
                  data-testid={`topnav-subject-button-${slug}`}
                  subjectIconName={getValidSubjectIconName(slug)}
                  selected={selectedSubject?.title === subject.title}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleSubjectClick(e, subject)
                  }
                  href={href}
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    if (e.key === "Enter" && subject.examBoards?.length) {
                      e.preventDefault();
                      onExamBoardPanelOpen?.(subject);

                      requestAnimationFrame(() => {
                        focusFirstExamBoardControl(subject.slug);
                      });
                      return;
                    }
                    focusManager?.handleKeyDown(e, buttonId);
                  }}
                  phase={
                    subject.nonCurriculum
                      ? "non-curriculum"
                      : (selectedMenu as "primary" | "secondary")
                  }
                  id={buttonId}
                  aria-disabled={selectedMenu !== phase}
                >
                  {subject.title}
                </OakSubjectIconButton>
              </OakLI>
            );
          })}
      </OakUL>
      {subjects.map(
        (subject) =>
          subject.examBoards &&
          subject.examBoards?.length > 0 && (
            <MaybeVisuallyHidden
              shouldDisplay={selectedSubject === subject}
              hiddenElementId={`teachers-examboards-${subject.slug}`}
              key={subject.slug}
            >
              <ExamBoardPanel
                examBoards={subject.examBoards}
                phaseSlug={phase}
                keystageSlug={keyStageSlug}
                selectedSubject={subject}
                focusManager={focusManager}
                onClick={handleClick}
                onLeave={closeExamBoardPanel}
              />
            </MaybeVisuallyHidden>
          ),
      )}
    </>
  );
};

export default TopNavSubjectButtons;
