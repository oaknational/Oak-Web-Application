import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import errorReporter from "@/common-lib/error-reporter";
import {
  getUserListContentResponse,
  UserlistContentApiResponse,
} from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

const reportError = errorReporter("educatorApi");

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);

  if (!userId) {
    return res.status(200).json({});
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
        const unitSlug = contentList.content.unit_slug;
        const unitTitle = browseData.unit_title;
        const optionalityTitle = browseData.optionality_title;
        const savedAt = contentList.created_at;
        const year = browseData.year;
        const keystage = browseData.keystage;
        const subject = browseData.subject;
        const tier = browseData.tier;
        const examboard = browseData.examboard;
        const unitOrder = browseData.unit_order;
        const yearOrder = browseData.year_order;
        const lessons = browseData.lessons.map((lesson) => ({
          slug: lesson.slug,
          title: lesson.title,
          state: lesson._state,
          order: lesson.order,
        }));

        if (!acc[programmeSlug]) {
          acc[programmeSlug] = {
            subject,
            keystage,
            tier,
            examboard,
            year,
            units: [],
          };
        }
        acc[programmeSlug].units.push({
          unitSlug,
          unitTitle,
          optionalityTitle,
          savedAt,
          lessons,
          unitOrder,
          yearOrder,
        });
      }
      return acc;
    }, {} as UserlistContentApiResponse);

    return res.status(200).json(myLibraryData);
  } catch (err) {
    reportError(err, {
      code: "educator-api/failed-to-get-saved-units",
      meta: {
        userId,
      },
    });

    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
