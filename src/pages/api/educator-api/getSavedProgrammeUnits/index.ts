import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import errorReporter from "@/common-lib/error-reporter";
import { getProgrammeUnitsResponse } from "@/node-lib/educator-api/queries/getProgrammeUnits/getProgrammeUnits.types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

const reportError = errorReporter("educatorApi");

type ProgrammeUnitsResponse = Record<
  string,
  Array<{
    unitSlug: string;
    unitTitle: string;
    savedAt: Date;
    year: string;
    keystage: string;
    subject: string;
    lessons: Array<{
      slug: string;
      title: string;
      state: string;
      order: number;
    }>;
  }>
>;

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);

  if (!userId) {
    return res.status(200).json([]);
  }

  const educatorApi = await getAuthenticatedEducatorApi(getToken);

  try {
    const result = await educatorApi.getProgrammeUnits({
      userId,
    });
    const parsedUnits = getProgrammeUnitsResponse.parse(result);

    const programmeUnits = parsedUnits.users_content.reduce((acc, unit) => {
      const contentList = unit.users_content_lists;
      const browseData = contentList?.content.browse_mv[0];
      if (contentList && browseData) {
        const programmeSlug = contentList.content.programme_slug;
        const unitSlug = contentList.content.unit_slug;
        const unitTitle = browseData.unit_title;
        const savedAt = new Date(contentList.created_at);
        const year = browseData.year;
        const keystage = browseData.keystage;
        const subject = browseData.subject;
        const lessons = browseData.supplementary_data.map((lesson) => ({
          slug: lesson.slug,
          title: lesson.title,
          state: lesson._state,
          order: lesson.order,
        }));

        if (!acc[programmeSlug]) {
          acc[programmeSlug] = [];
        }
        acc[programmeSlug].push({
          unitSlug,
          unitTitle,
          savedAt,
          year,
          keystage,
          subject,
          lessons,
        });
      }
      return acc;
    }, {} as ProgrammeUnitsResponse);

    return res.status(200).json(programmeUnits);
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
