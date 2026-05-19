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

export const getSubjectLinkHref = ({
  programmeCount,
  subjectSlug,
  programmeSlug,
  keyStageSlug,
}: {
  programmeCount: number;
  subjectSlug: string;
  programmeSlug: string | null;
  keyStageSlug?: string;
}): string => {
  return programmeCount > 1 && keyStageSlug
    ? // If there are multiple programmes, link to the programme listing page
      resolveOakHref({
        page: "programme-index",
        subjectSlug,
        keyStageSlug,
      })
    : // If there is only one programme, link to the unit listing page for that programme
      resolveOakHref({
        page: "unit-index",
        programmeSlug: programmeSlug!,
      });
};

const TopNavSubjectButtons = ({
  selectedMenu,
  subjects,
  selectedSubject,
  keyStageSlug,
  handleClick,
  focusManager,
  onSubjectHover,
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
  onSubjectHover?: (subject: SubjectsNavItem) => void;
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
                })}
                selected={selectedSubject?.title === subject.title}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  handleSubjectClick(e, subject)
                }
                onMouseEnter={() => onSubjectHover?.(subject)}
                onFocus={() => onSubjectHover?.(subject)}
                onMouseLeave={() => onSubjectLeave?.(subject)}
                onBlur={() => onSubjectBlur?.(subject)}
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
