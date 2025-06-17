import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import errorReporter from "@/common-lib/error-reporter";
import {
  getUserListContentResponse,
  UserlistContentApiResponse,
} from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";
import OakError from "@/errors/OakError";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

const reportError = errorReporter("educatorApi");

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);

  if (!userId) {
    return res.status(401).json({});
  }

  const educatorApi = await getAuthenticatedEducatorApi(getToken);

  try {
    const result = await educatorApi.getUserListContent({
      userId,
    });
    const parsedUnits = getUserListContentResponse.parse(result);

    const myLibraryData = parsedUnits.content_lists.reduce((acc, unit) => {
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

        const uniqueProgrammeIdentifier = `${programmeSlug}${useSubjectCategory ? subjectCategory : ""}`;

        if (!acc[uniqueProgrammeIdentifier]) {
          acc[uniqueProgrammeIdentifier] = {
            programmeSlug,
            subject: browseData.subject,
            subjectSlug: browseData.subject_slug,
            subjectCategory: useSubjectCategory ? subjectCategory : null,
            keystage: browseData.keystage,
            keystageSlug: browseData.keystage_slug,
            pathway: browseData.pathway,
            tier: browseData.tier,
            examboard: browseData.examboard,
            units: [],
          };
        }
        acc[uniqueProgrammeIdentifier].units.push({
          unitSlug: contentList.unit_slug,
          unitTitle: browseData.unit_title,
          optionalityTitle: browseData.optionality_title || null,
          savedAt: unit.created_at,
          lessons,
          unitOrder: browseData.unit_order,
          yearOrder: browseData.year_order,
          year: browseData.year,
        });
      }
      return acc;
    }, {} as UserlistContentApiResponse);

    return res.status(200).json(myLibraryData);
  } catch (err) {
    const error = new OakError({
      code: "educator-api/failed-to-get-saved-units",
      meta: {
        userId,
        error: err,
      },
    });
    reportError(error);

    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
