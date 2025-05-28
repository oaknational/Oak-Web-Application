import type { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import { z } from "zod";
import { capitalize, isUndefined, omitBy } from "lodash";

import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import curriculumApi2023, {
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/docx/getMvRefreshTime";
import { logErrorMessage } from "@/utils/curriculum/testing";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import xlsxNationalCurriculum from "@/pages-helpers/curriculum/xlsx";

export const curriculumDownloadQuerySchema = z.object({
  mvRefreshTime: z.string(),
  subjectSlug: z.string(),
  phaseSlug: z.string(),
  state: z.enum(["new", "published"]),
  ks4OptionSlug: z.string().optional(),
  tierSlug: z.string().optional(),
  childSubjectSlug: z.string().optional(),
});

export type curriculumDownloadQueryProps = z.infer<
  typeof curriculumDownloadQuerySchema
>;

export type Output = CurriculumUnitsTabData & {
  examboardTitle: string | null;
} 

type getDataReturn =
  | { notFound: true }
  | {
      notFound: false;
      combinedCurriculumData: Output;
      ks4OptionSlug?: string;
      subjectSlug: string;
      phaseSlug: string;
      state: string;
      tierSlug?: string;
      childSubjectSlug?: string;
      dataWarnings: string[];
      ks4Options: Ks4Option[];
    };
async function getData(opts: {
  subjectSlug: string;
  phaseSlug: string;
  ks4OptionSlug?: string;
  state: string;
  tierSlug?: string;
  childSubjectSlug?: string;
}): Promise<getDataReturn> {
  const {
    subjectSlug,
    phaseSlug,
    ks4OptionSlug,
    state,
    childSubjectSlug,
    tierSlug,
  } = opts;

  let curriculumData: CurriculumUnitsTabData | null;
  const dataWarnings: string[] = [];

  try {
    const queryOpts = {
      subjectSlug,
      phaseSlug,
      ks4OptionSlug: ks4OptionSlug ?? null,
    };
    curriculumData = await curriculumApi2023.curriculumSequence(queryOpts);

    if (!curriculumData) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    logErrorMessage(error);
    return {
      notFound: true,
    };
  }

  const curriculumPhaseOptions = {
    subjects: await curriculumApi2023.curriculumPhaseOptions(),
  };

  const subject = curriculumPhaseOptions.subjects.find((subject) => {
    return subject.slug === subjectSlug;
  }) as SubjectPhasePickerData["subjects"][number] | undefined;

  if (!subject) {
    return { notFound: true };
  }

  const ks4Options = subject.ks4_options ?? [];
  const ks4Option =
    ks4Options.find((ks4_option) => ks4_option.slug === ks4OptionSlug) ?? null;

  const combinedCurriculumData: Output = {
    ...curriculumData,
    examboardTitle: ks4Option?.title ?? null,
  };

  return {
    notFound: false,
    combinedCurriculumData,
    ks4OptionSlug,
    subjectSlug,
    phaseSlug,
    state,
    tierSlug,
    childSubjectSlug,
    dataWarnings,
    ks4Options,
  };
}

const stale_while_revalidate_seconds = 60 * 3;
const s_maxage_seconds = 60 * 60 * 24;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>,
) {
  const {
    mvRefreshTime,
    subjectSlug,
    phaseSlug,
    state,
    ks4OptionSlug,
    tierSlug,
    childSubjectSlug,
  } = curriculumDownloadQuerySchema.parse(req.query);

  const mvRefreshTimeParsed = parseInt(mvRefreshTime);
  const actualMvRefreshTime = await getMvRefreshTime();

  // Note: Disable this check to allow 'new' documents
  if (state === "new") {
    res.status(404).end();
    return;
  }

  // Check if we should redirect (new cache-hit)
  // if (mvRefreshTimeParsed !== actualMvRefreshTime) {
  //   const slugOb = omitBy(
  //     {
  //       subjectSlug,
  //       phaseSlug,
  //       state,
  //       ks4OptionSlug,
  //       tierSlug,
  //       childSubjectSlug,
  //       mvRefreshTime: actualMvRefreshTime,
  //     },
  //     isUndefined,
  //   ) as Record<string, string>;
  //   const newSlugs = new URLSearchParams(slugOb);

  //   const redirectUrl = `/api/curriculum-downloads/?${newSlugs}`;

  //   // Netlify-Vary is a hack to hopefully resolve
  //   res.setHeader("Netlify-Vary", "query").redirect(307, redirectUrl);
  //   return;
  // }

  const data = await getData({
    subjectSlug,
    phaseSlug,
    ks4OptionSlug,
    state,
    tierSlug,
    childSubjectSlug,
  });

  // FIXME: Poor use of types here
  if (!data.notFound) {
    const buffer = await xlsxNationalCurriculum(
      data.combinedCurriculumData,
      {
        subjectSlug: data.subjectSlug,
        phaseSlug: data.phaseSlug,
        keyStageSlug: data.phaseSlug,
        ks4OptionSlug: data.ks4OptionSlug,
        tierSlug,
        childSubjectSlug,
      },
      data.ks4Options,
    );

    const pageTitle: string = [
      "testing",
      capitalize(childSubjectSlug?.split("-").join(" ")),
      capitalize(tierSlug),
    ]
      .filter(Boolean)
      .join(" - ");

    const filename = `${pageTitle} - ${format(
      Date.now(),
      // Note: dashes "-" rather than ":" because colon is invalid on windows
      "dd-MM-yyyy",
    )}.xlsx`;

    res
      .setHeader("content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .setHeader("Netlify-Vary", "query")
      // .setHeader(
      //   "Cache-Control",
      //   `public, durable, s-maxage=${s_maxage_seconds}, stale-while-revalidate=${stale_while_revalidate_seconds}`,
      // )
      .setHeader("Content-Disposition", `attachment; filename="${filename}`)
      .setHeader("x-filename", `${filename}`)
      .status(200)
      .send(Buffer.from(buffer));
    return;
  } else {
    res.status(404).end();
    return;
  }
}
