import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { resolveOakHref } from "@/common-lib/urls";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData,
  TeachersSubNavData as TeachersData,
  SubjectsNavItem,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export const getSubjectLinkHref = ({
  programmeCount,
  subjectSlug,
  programmeSlug,
  keyStageSlug,
  phaseSlug,
}: {
  programmeCount: number;
  subjectSlug: string;
  programmeSlug: string | null;
  keyStageSlug?: string;
  phaseSlug: "primary" | "secondary";
}): string => {
  if (keyStageSlug === "early-years-foundation-stage") {
    return resolveOakHref({
      page: "unit-index",
      programmeSlug: programmeSlug!,
    });
  }

  if (programmeCount > 1 && keyStageSlug) {
    return resolveOakHref({
      page: "programme-index",
      subjectSlug,
      keyStageSlug,
    });
  }

  return resolveOakHref({
    page: "teacher-programme",
    subjectPhaseSlug:
      programmeSlug?.replace(/-ks\d+(?=-|$)/, "") ??
      `${subjectSlug}-${phaseSlug}`,
    tab: "units",
    query: keyStageSlug ? { keystages: keyStageSlug } : undefined,
  });
};

const TopNavSubjectButtons = ({
  selectedMenu,
  subjects,
  selectedSubject,
  keyStageSlug,
  handleClick,
  focusManager,
  onSubjectLeave,
  onSubjectBlur,
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
  onSubjectLeave?: (subject: SubjectsNavItem) => void;
  onSubjectBlur?: (subject: SubjectsNavItem) => void;
  onExamBoardPanelOpen?: (subject: SubjectsNavItem) => void;
}) => {
  const router = useRouter();
  const handleSubjectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    subject: SubjectsNavItem,
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
    const href = getSubjectLinkHref({
      programmeCount: subject.programmeCount,
      subjectSlug: subject.slug,
      programmeSlug: subject.programmeSlug,
      keyStageSlug,
      phaseSlug: selectedMenu as "primary" | "secondary",
    });

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
          const { slug } = subject;
          const buttonId = focusManager?.createId(
            `teachers-${selectedMenu}-${keyStageSlug}`,
            slug,
          );

          return (
            <OakLI key={subject.title}>
              <OakSubjectIconButton
                variant={"horizontal"}
                data-testid={`topnav-subject-button-${slug}`}
                subjectIconName={getValidSubjectIconName(slug)}
                selected={selectedSubject?.title === subject.title}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleSubjectClick(e, subject)
                }
                onMouseLeave={() => onSubjectLeave?.(subject)}
                onBlur={() => onSubjectBlur?.(subject)}
                onKeyDown={(e) => {
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
