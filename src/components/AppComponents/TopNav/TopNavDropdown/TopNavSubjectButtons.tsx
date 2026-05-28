import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { TopNavDropdownProps } from "./TopNavDropdown";

import { resolveOakHref } from "@/common-lib/urls";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData as TeachersData,
  TeachersBrowse,
  SubjectsNavItem,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";

export const getSubjectLinkHref = ({
  subject,
  keyStageSlug,
  phaseSlug,
}: {
  subject: SubjectsNavItem;
  keyStageSlug: string;
  phaseSlug: "primary" | "secondary";
}): string => {
  if (keyStageSlug === "early-years-foundation-stage") {
    return resolveOakHref({
      page: "unit-index",
      programmeSlug: subject.programmeSlug!,
    });
  }

  return resolveOakHref({
    page: "teacher-programme",
    subjectPhaseSlug: getSubjectPhaseSlug({
      subject: subject.slug,
      phaseSlug: phaseSlug,
      pathwaySlug: subject.pathwaySlug ? subject.pathwaySlug : null,
    }),
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
  phase,
  onExamBoardPanelOpen,
}: {
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  phase: "primary" | "secondary";
  subjects: TeachersBrowse["children"][number]["children"];
  selectedSubject: SubjectsNavItem | null;
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
          const { slug } = subject;
          const buttonId = focusManager?.createId(
            `teachers-${phase}-${keyStageSlug}`,
            slug,
          );

          const href = getSubjectLinkHref({
            subject: subject,
            keyStageSlug,
            phaseSlug: selectedMenu as "primary" | "secondary",
          });

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
                aria-disabled={selectedMenu !== phase}
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
