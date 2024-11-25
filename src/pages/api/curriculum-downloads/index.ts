import type { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import { z } from "zod";
import capitalize from "lodash/capitalize";
import isUndefined from "lodash/isUndefined";
import omitBy from "lodash/omitBy";

import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023, {
  CurriculumOverviewMVData,
} from "@/node-lib/curriculum-api-2023";
import docx, {
  CombinedCurriculumData,
  CurriculumUnitsTabDataIncludeNewWithOrder,
} from "@/pages-helpers/curriculum/docx";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/docx/getMvRefreshTime";
import { logErrorMessage } from "@/utils/curriculum/testing";
import { ENABLE_NEW_CURRIC_MV } from "@/utils/curriculum/constants";

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

type getDataReturn =
  | { notFound: true }
  | {
      notFound: false;
      combinedCurriculumData: CombinedCurriculumData;
      ks4OptionSlug?: string;
      subjectSlug: string;
      phaseSlug: string;
      state: string;
      tierSlug?: string;
      childSubjectSlug?: string;
      dataWarnings: string[];
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

  let curriculumOverviewSanityData: CurriculumOverviewSanityData | null;
  let curriculumOverviewTabData: CurriculumOverviewMVData | null;
  let curriculumData: CurriculumUnitsTabDataIncludeNewWithOrder | null;
  const dataWarnings: string[] = [];

  try {
    const queryOpts = {
      subjectSlug,
      phaseSlug,
      ks4OptionSlug: ks4OptionSlug ?? null,
    };
    let curriculumDataUnsorted;
    if (ENABLE_NEW_CURRIC_MV) {
      curriculumDataUnsorted =
        await curriculumApi2023.curriculumSequence(queryOpts);
    } else {
      curriculumDataUnsorted =
        await curriculumApi2023.curriculumUnits(queryOpts);
    }

    // HACK: This sorts by examboard to push NULLs to the bottom of the list, to fix picking up the correct `unit_options`
    curriculumData = {
      ...curriculumDataUnsorted,
      units: [...curriculumDataUnsorted.units]
        .filter((a) => {
          if (a.keystage_slug === "ks4") {
            const unitIsChildSubject =
              !childSubjectSlug || a.subject_slug === childSubjectSlug;
            const unitHasCorrectTier =
              a.tier_slug === tierSlug || !tierSlug || !a.tier_slug;

            return unitIsChildSubject && unitHasCorrectTier;
          }
          return true;
        })
        .sort((a) => {
          if (a.examboard) {
            return -1;
          }
          return 1;
        })
        .map((unit) => {
          return {
            ...unit,
            order: unit.order === null ? -1000 : unit.order,
          };
        })
        .sort((a, b) => {
          return a.order - b.order;
        }),
    };

    curriculumOverviewTabData = await curriculumApi2023.curriculumOverview({
      subjectSlug,
      phaseSlug,
    });

    curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage({
      previewMode: false,
      ...{ subjectTitle: curriculumOverviewTabData.subjectTitle, phaseSlug },
    });

    if (!curriculumOverviewSanityData) {
      dataWarnings.push("Sanity CMS data is missing, dummy data will be used.");
      curriculumOverviewSanityData = {
        id: "001ae718-80a4-42ef-8dea-809528ecc847",
        subjectPrinciples: [
          "Subject principles are undefined for this record. Please check the CMS.",
        ],
        partnerBio:
          "Partner bio is undefined for this record. Please check the CMS.",
        curriculumPartner: {
          name: "Partner name is undefined for this record. Please check the CMS.",
          image: null,
        },
        curriculumPartnerOverviews: [],
        video: {
          title:
            "Video title is undefined for this record. Please check the CMS.",
          video: {
            asset: { assetId: "", playbackId: "undefined", thumbTime: null },
          },
        },
        curriculumExplainer: {
          explainerRaw: [
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "Aims and purpose",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "heading2",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
          ],
        },
        videoAuthor:
          "Video author is undefined for this record. Please check the CMS.",
        videoExplainer:
          "Video explainer is undefined for this record. Please check the CMS.",
      };
    }

    if (
      !curriculumOverviewSanityData ||
      !curriculumOverviewTabData ||
      !curriculumData
    ) {
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

  const subjectPhaseOptions = {
    subjects: await curriculumApi2023.subjectPhaseOptions({
      cycle: "2",
    }),
  };

  const subject = subjectPhaseOptions.subjects.find((subject) => {
    return subject.slug === subjectSlug;
  }) as SubjectPhasePickerData["subjects"][number] | undefined;
  const ks4Option =
    subject?.ks4_options?.find(
      (ks4_option) => ks4_option.slug === ks4OptionSlug,
    ) ?? null;

  const combinedCurriculumData: CombinedCurriculumData = {
    ...curriculumData,
    ...curriculumOverviewTabData,
    ...curriculumOverviewSanityData,
    ...{ state },
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
  if (mvRefreshTimeParsed !== actualMvRefreshTime) {
    const slugOb = omitBy(
      {
        subjectSlug,
        phaseSlug,
        state,
        ks4OptionSlug,
        tierSlug,
        childSubjectSlug,
        mvRefreshTime: actualMvRefreshTime,
      },
      isUndefined,
    ) as Record<string, string>;
    const newSlugs = new URLSearchParams(slugOb);

    const redirectUrl = `/api/curriculum-downloads/?${newSlugs}`;
    res.redirect(307, redirectUrl);
    return;
  }

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
    const buffer = await docx(data.combinedCurriculumData, {
      subjectSlug: data.subjectSlug,
      phaseSlug: data.phaseSlug,
      keyStageSlug: data.phaseSlug,
      ks4OptionSlug: data.ks4OptionSlug,
      tierSlug,
      childSubjectSlug,
    });

    const pageTitle: string = [
      data.combinedCurriculumData?.subjectTitle,
      data.combinedCurriculumData?.phaseTitle,
      data.combinedCurriculumData?.examboardTitle,
      capitalize(childSubjectSlug?.split("-").join(" ")),
      capitalize(tierSlug),
    ]
      .filter(Boolean)
      .join(" - ");

    const filename = `${pageTitle} - ${format(
      Date.now(),
      // Note: dashes "-" rather than ":" because colon is invalid on windows
      "dd-MM-yyyy",
    )}.docx`;

    res
      .setHeader("content-type", "application/msword")
      .setHeader("Netlify-Vary", "query")
      .setHeader(
        "Cache-Control",
        `public, durable, s-maxage=${s_maxage_seconds}, stale-while-revalidate=${stale_while_revalidate_seconds}`,
      )
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
