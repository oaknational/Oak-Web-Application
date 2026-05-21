import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { resolveOakHref } from "@/common-lib/urls";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData,
  TeachersSubNavData as TeachersData,
  SubjectsNavItem,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { filtersToQuery } from "@/utils/curriculum/filtering";

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

  const queryParams = new URLSearchParams(
    filtersToQuery(
      {
        childSubjects: [],
        years: [],
        subjectCategories: [],
        tiers: [],
        threads: [],
        pathways: [],
        keystages: [keyStageSlug || ""],
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

  const href =
    programmeCount > 1 && keyStageSlug
      ? // If there are multiple programmes, link to the programme listing page
        resolveOakHref({
          page: "programme-index",
          subjectSlug,
          keyStageSlug,
        })
      : resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug:
            programmeSlug?.replace(/-ks\d+(?=-|$)/, "") ?? // remove keystage but keep other options
            `${subjectSlug}-${phaseSlug}`,
          tab: "units",
        });

  return href + (queryParams ? `?${queryParams}` : "");
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
  const handleSubjectClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
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
          const { programmeCount, slug, programmeSlug } = subject;
          const buttonId = focusManager?.createId(
            `teachers-${selectedMenu}-${keyStageSlug}`,
            slug,
          );

          return (
            <OakLI key={subject.title}>
              <OakSubjectIconButton
                variant={"horizontal"}
                element={Link}
                subjectIconName={getValidSubjectIconName(slug)}
                href={getSubjectLinkHref({
                  programmeCount,
                  subjectSlug: slug,
                  programmeSlug,
                  keyStageSlug,
                  phaseSlug: selectedMenu as "primary" | "secondary",
                })}
                selected={selectedSubject?.title === subject.title}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
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
