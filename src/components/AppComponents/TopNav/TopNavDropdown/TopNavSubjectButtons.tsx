import {
  OakLI,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { TopNavDropdownProps } from "./TopNavDropdown";

import { resolveOakHref } from "@/common-lib/urls";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData as TeachersData,
  TeachersBrowse,
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
  keyStageSlug,
  handleClick,
  focusManager,
  phase,
}: {
  selectedMenu?: TopNavDropdownProps["selectedMenu"];
  phase: "primary" | "secondary";
  subjects: TeachersBrowse["children"][number]["children"];
  keyStageSlug: string;
  handleClick: (subject: string, keystage: string) => void;
  focusManager?: DropdownFocusManager<TeachersData>;
}) => {
  return (
    <OakUL
      $display={"flex"}
      $flexGrow={1}
      $flexWrap={"wrap"}
      $gap={"spacing-16"}
      $reset
      id={`topnav-teachers-${keyStageSlug}-subjects`}
    >
      {subjects &&
        subjects.length > 0 &&
        subjects.map((subject) => {
          const { programmeCount, slug, programmeSlug } = subject;
          const buttonId = focusManager?.createId(
            `teachers-${phase}-${keyStageSlug}`,
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
                onClick={() => handleClick(slug, keyStageSlug)}
                onKeyDown={(e) =>
                  buttonId && focusManager?.handleKeyDown(e, buttonId)
                }
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
