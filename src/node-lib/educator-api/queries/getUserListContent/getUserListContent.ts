import {
  getUserListContentResponse,
  UserlistContentApiResponse,
} from "./getUserListContent.types";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import { GetToken } from "clerk";

/**
 * Fetches the units a user has saved, keyed by a programme identifier which
 * distinguishes programmes that share a slug but differ by subject category
 */
export const getUserListContent = async (
  getToken: GetToken,
  userId: string,
): Promise<UserlistContentApiResponse> => {
  const educatorApi = await getAuthenticatedEducatorApi(getToken);
  const result = await educatorApi.getUserListContent({ userId });
  const parsedUnits = getUserListContentResponse.parse(result);

  return parsedUnits.content_lists.reduce((acc, unit) => {
    const contentList = unit.content;
    const browseData = contentList?.browse_mv[0];
    if (contentList && browseData) {
      const programmeSlug = contentList.programme_slug;
      const lessons = browseData.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        state: lesson._state,
        order: lesson.order,
      }));

      // Subject categories are not included in the programme slug but we want to keep them distinct
      const subjectCategory = browseData.subject_categories?.[0];
      const useSubjectCategory =
        subjectCategory && subjectCategory !== browseData.subject;

      const uniqueProgrammeIdentifier = `${programmeSlug}${useSubjectCategory ? "-" + subjectCategory : ""}`;

      acc[uniqueProgrammeIdentifier] ??= {
        programmeSlug,
        subject: browseData.subject,
        subjectSlug: browseData.subject_slug,
        subjectCategory: useSubjectCategory ? subjectCategory : null,
        subjectParent: browseData.subject_parent,
        keystage: browseData.keystage,
        keystageSlug: browseData.keystage_slug,
        phaseSlug: browseData.phase_slug,
        pathway: browseData.pathway,
        pathwaySlug: browseData.pathway_slug,
        tier: browseData.tier,
        examboard: browseData.examboard,
        examboardSlug: browseData.examboard_slug,
        units: [],
      };
      acc[uniqueProgrammeIdentifier].units.push({
        unitSlug: contentList.unit_slug,
        unitTitle: browseData.unit_title,
        optionalityTitle: browseData.optionality_title || null,
        savedAt: unit.created_at,
        lessons,
        unitOrder: browseData.unit_order,
        yearOrder: browseData.year_order,
        year: browseData.year,
        yearSlug: browseData.year_slug,
        tier: browseData.tier,
        examboard: browseData.examboard,
        pathway: browseData.pathway,
      });
    }
    return acc;
  }, {} as UserlistContentApiResponse);
};
