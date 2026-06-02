import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData,
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
  onExamBoardPanelOpen,
}: {
  selectedMenu: keyof TeachersSubNavData;
  selectedSubject: SubjectsNavItem | null;
  subjects: TeachersSubNavData[
    | "primary"
    | "secondary"]["children"][number]["children"];
  keyStageSlug: string;
  handleClick: (subject: string, keystage: string) => void;
  focusManager?: DropdownFocusManager<TeachersData>;
  onExamBoardPanelOpen?: (subject: SubjectsNavItem) => void;
}) => {
  const router = useRouter();
  const handleSubjectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    subject: SubjectsNavItem,
    href?: string,
  ) => {
    if (
      keyStageSlug === "ks4" &&
      subject.examBoards &&
      subject.examBoards.length > 0
    ) {
      e.preventDefault();
      onExamBoardPanelOpen?.(subject);
      return;
    }

    if (href) {
      router.push(href);
    }
    handleClick(subject.slug, keyStageSlug);
  };

  const focusFirstExamBoardControl = (subjectSlug: string) => {
    const examBoardPanelId = `topnav-teachers-ks4-examboards-${subjectSlug}`;
    const panel = document.getElementById(examBoardPanelId);
    const firstFocusable = panel?.querySelector<HTMLElement>(
      "input:not([disabled]), button:not([disabled]), [role='radio']:not([aria-disabled='true'])",
    );
    firstFocusable?.focus();
  };

  return (
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
          const buttonId = focusManager?.createId(
            `teachers-${selectedMenu}-${keyStageSlug}`,
            slug,
          );

          return (
            <OakLI key={subject.title}>
              <OakSubjectIconButton
                variant={"horizontal"}
                element={subject.examBoards?.length ? "button" : "a"}
                data-testid={`topnav-subject-button-${slug}`}
                subjectIconName={getValidSubjectIconName(slug)}
                selected={selectedSubject?.title === subject.title}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleSubjectClick(e, subject, href)
                }
                href={href}
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                  if (
                    e.key === "Enter" &&
                    keyStageSlug === "ks4" &&
                    subject.examBoards?.length
                  ) {
                    e.preventDefault();
                    onExamBoardPanelOpen?.(subject);

                    requestAnimationFrame(() => {
                      focusFirstExamBoardControl(subject.slug);
                    });
                    return;
                  }
                  focusManager?.handleKeyDown(e, buttonId!);
                }}
                phase={
                  subject.nonCurriculum
                    ? "non-curriculum"
                    : (selectedMenu as "primary" | "secondary")
                }
                id={buttonId}
              >
                {subject.title}
              </OakSubjectIconButton>
            </OakLI>
          );
        })}
    </OakUL>
  );
};

export default TopNavSubjectButtons;
