import { kebabCase } from "lodash";

import { UserlistContentApiResponse } from "../../queries/getUserListContent/getUserListContent.types";

import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import type { CollectionData } from "@/components/TeacherViews/MyLibrary/MyLibrary";

export const buildCollectionData = (
  savedProgrammeUnits: UserlistContentApiResponse,
): CollectionData =>
  Object.entries(savedProgrammeUnits)
    .map(([uniqueProgrammeKey, programmeData]) => {
      const {
        programmeSlug,
        keystage,
        pathway,
        pathwaySlug,
        subject,
        subjectParent,
        examboard,
        examboardSlug,
        tier,
        units,
        subjectSlug,
        keystageSlug,
        subjectCategory,
        phaseSlug,
      } = programmeData;

      const subjectCategoryHeading = `${subjectCategory ? `${subjectCategory} ` : ""}`;

      const subheading = `${subjectCategoryHeading}${examboard ? examboard + " " : ""}${tier ? tier + " " : ""}${pathway ? pathway + " " : ""}${keystage}`;

      const programmeTitle = `${subject}${subjectCategoryHeading && ":"} ${subheading}`;
      const subjectCategoryQuery = subjectCategory
        ? `${kebabCase(subjectCategory.toLocaleLowerCase().replaceAll("&", "and"))}`
        : undefined;

      const subjectPhaseSlug = getTeacherSubjectPhaseSlug({
        subjectSlug,
        phaseSlug,
        examboardSlug,
        pathwaySlug,
        subjectParentTitle: subjectParent,
      });

      units.sort(
        (a, b) => a.yearOrder - b.yearOrder || a.unitOrder - b.unitOrder,
      );

      return {
        subject,
        subjectSlug,
        keystageSlug,
        subheading,
        keystage,
        units,
        programmeSlug,
        programmeTitle,
        subjectCategoryQuery,
        uniqueProgrammeKey,
        subjectPhaseSlug,
      };
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      return (
        a.subject.localeCompare(b.subject) ||
        a.subheading.localeCompare(b.subheading)
      );
    });
