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

    const myLibraryData = parsedUnits.users_content.reduce((acc, unit) => {
      const contentList = unit.users_content_lists;
      const browseData = contentList?.content.browse_mv[0];
      if (contentList && browseData) {
        const programmeSlug = contentList.content.programme_slug;
        const lessons = browseData.lessons.map((lesson) => ({
          slug: lesson.slug,
          title: lesson.title,
          state: lesson._state,
          order: lesson.order,
        }));

        if (!acc[programmeSlug]) {
          acc[programmeSlug] = {
            subject: browseData.subject,
            subjectSlug: browseData.subject_slug,
            subjectCategories: browseData.subject_categories,
            keystage: browseData.keystage,
            keystageSlug: browseData.keystage_slug,
            tier: browseData.tier,
            examboard: browseData.examboard,
            units: [],
          };
        }
        acc[programmeSlug].units.push({
          unitSlug: contentList.content.unit_slug,
          unitTitle: browseData.unit_title,
          optionalityTitle: browseData.optionality_title || null,
          savedAt: contentList.created_at,
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
