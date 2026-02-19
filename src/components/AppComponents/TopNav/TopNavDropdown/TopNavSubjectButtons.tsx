import {
  OakLI,
  OakPrimaryInvertedButton,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import {
  TeachersSubNavData,
  TeachersSubNavData as TeachersData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export const getSubjectLinkProps = ({
  programmeCount,
  subjectSlug,
  programmeSlug,
  keyStageSlug,
}: {
  programmeCount: number;
  subjectSlug: string;
  programmeSlug: string | null;
  keyStageSlug?: string;
}): ResolveOakHrefProps => {
  return programmeCount > 1 && keyStageSlug
    ? // If there are multiple programmes, link to the programme listing page
      {
        page: "programme-index",
        subjectSlug,
        keyStageSlug,
      }
    : // If there is only one programme, link to the unit listing page for that programme
      {
        page: "unit-index",
        programmeSlug: programmeSlug!,
      };
};

const TopNavSubjectButtons = ({
  selectedMenu,
  subjects,
  nonCurriculumSubjects,
  keyStageSlug,
  keyStageTitle,
  handleClick,
  focusManager,
}: {
  selectedMenu: keyof TeachersSubNavData;
  subjects: TeachersSubNavData[
    | "primary"
    | "secondary"]["children"][number]["children"];
  nonCurriculumSubjects?: TeachersSubNavData[
    | "primary"
    | "secondary"]["children"][number]["children"];
  keyStageSlug: string;
  keyStageTitle: string;
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
      {(subjects &&
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
                href={resolveOakHref(
                  getSubjectLinkProps({
                    programmeCount,
                    subjectSlug: slug,
                    programmeSlug,
                    keyStageSlug,
                  }),
                )}
                onClick={() => handleClick(slug, keyStageSlug)}
                onKeyDown={(e) =>
                  buttonId && focusManager?.handleKeyDown(e, buttonId)
                }
                phase={selectedMenu as "primary" | "secondary"}
                id={buttonId}
              >
                {subject.title}
              </OakSubjectIconButton>
            </OakLI>
          );
        })) ??
        null}
      {nonCurriculumSubjects &&
        nonCurriculumSubjects.length > 0 &&
        nonCurriculumSubjects.map((subject) => {
          const { programmeCount, slug, programmeSlug } = subject;
          const buttonId = focusManager?.createId(
            `teachers-${selectedMenu}-${keyStageSlug}`,
            slug,
          );

          return (
            <OakLI key={subject.slug}>
              <OakSubjectIconButton
                variant={"horizontal"}
                key={subject.slug}
                element={Link}
                subjectIconName={getValidSubjectIconName(subject.slug)}
                href={resolveOakHref(
                  getSubjectLinkProps({
                    programmeCount,
                    subjectSlug: subject.slug,
                    programmeSlug,
                    keyStageSlug,
                  }),
                )}
                onClick={() => handleClick(subject.slug, keyStageSlug)}
                onKeyDown={(e) =>
                  buttonId && focusManager?.handleKeyDown(e, buttonId)
                }
                phase={"non-curriculum"}
                id={buttonId}
              >
                {subject.title}
              </OakSubjectIconButton>
            </OakLI>
          );
        })}
      <OakLI>
        <OakPrimaryInvertedButton
          id={focusManager?.createId(
            `teachers-${selectedMenu}-${keyStageSlug}`,
            "all-keystages-button",
          )}
          element={Link}
          iconName="arrow-right"
          isTrailingIcon
          onClick={() => handleClick("all", keyStageSlug)}
          onKeyDown={(e) =>
            focusManager?.handleKeyDown(
              e,
              focusManager.createId(
                `teachers-${selectedMenu}-${keyStageSlug}`,
                "all-keystages-button",
              ),
            )
          }
          href={resolveOakHref({ page: "subject-index", keyStageSlug })}
        >
          All {keyStageTitle} subjects
        </OakPrimaryInvertedButton>
      </OakLI>
    </OakUL>
  );
};

export default TopNavSubjectButtons;
