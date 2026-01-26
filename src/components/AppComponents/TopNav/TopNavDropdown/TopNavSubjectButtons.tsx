import {
  OakLI,
  OakPrimaryInvertedButton,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";

import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

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
}: {
  selectedMenu: keyof TeachersSubNavData;
  subjects: TeachersSubNavData[
    | "primary"
    | "secondary"]["keystages"][number]["subjects"];
  nonCurriculumSubjects?: TeachersSubNavData[
    | "primary"
    | "secondary"]["keystages"][number]["subjects"];
  keyStageSlug: string;
  keyStageTitle: string;
  handleClick?: () => void;
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
          const { programmeCount, subjectSlug, programmeSlug } = subject;

          return (
            <OakLI key={subject.title}>
              <OakSubjectIconButton
                variant={"horizontal"}
                element={Link}
                subjectIconName={getValidSubjectIconName(subjectSlug)}
                href={resolveOakHref(
                  getSubjectLinkProps({
                    programmeCount,
                    subjectSlug,
                    programmeSlug,
                    keyStageSlug,
                  }),
                )}
                onClick={handleClick}
                phase={selectedMenu as "primary" | "secondary"}
                id={`topnav-teachers-subject-${subjectSlug}`}
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
          const { programmeCount, subjectSlug, programmeSlug } = subject;

          return (
            <OakLI key={subject.subjectSlug}>
              <OakSubjectIconButton
                variant={"horizontal"}
                key={subjectSlug}
                element={Link}
                subjectIconName={getValidSubjectIconName(subjectSlug)}
                href={resolveOakHref(
                  getSubjectLinkProps({
                    programmeCount,
                    subjectSlug,
                    programmeSlug,
                    keyStageSlug,
                  }),
                )}
                onClick={handleClick}
                phase={"non-curriculum"}
              >
                {subject.title}
              </OakSubjectIconButton>
            </OakLI>
          );
        })}
      <OakLI>
        <OakPrimaryInvertedButton
          element="a"
          iconName="arrow-right"
          isTrailingIcon
          href={resolveOakHref({ page: "subject-index", keyStageSlug })}
        >
          All {keyStageTitle} subjects
        </OakPrimaryInvertedButton>
      </OakLI>
    </OakUL>
  );
};

export default TopNavSubjectButtons;
