import { isUndefined, omitBy } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { getMvRefreshTime } from "@/pages-helpers/curriculum/downloads/getMvRefreshTime";
import { getFilename } from "@/utils/curriculum/formatting";
import docx from "@/pages-helpers/curriculum/docx";
import xlsxNationalCurriculum from "@/pages-helpers/curriculum/xlsx";
import { zipFromFiles } from "@/utils/curriculum/zip";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023, {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { logErrorMessage } from "@/utils/curriculum/testing";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CombinedCurriculumData } from "@/utils/curriculum/types";
import {
  DOWNLOAD_TYPE_LABELS,
  DOWNLOAD_TYPES,
  DownloadTypes,
} from "@/components/CurriculumComponents/CurriculumDownloadView/helper";

const stale_while_revalidate_seconds = 60 * 3;
const s_maxage_seconds = 60 * 60 * 24;

export const curriculumDownloadQuerySchema = z.object({
  types: z.preprocess(
    (val) => {
      return String(val).split(",");
    },
    z.array(z.enum(DOWNLOAD_TYPES)),
  ),
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
      ks4Options: Ks4Option[];
      isWithinArchive?: boolean;
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
  let curriculumData: CurriculumUnitsTabData | null;
  const dataWarnings: string[] = [];

  try {
    const queryOpts = {
      subjectSlug,
      phaseSlug,
      ks4OptionSlug: ks4OptionSlug ?? null,
    };
    const curriculumDataUnsorted =
      await curriculumApi2023.curriculumSequence(queryOpts);

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
      subjectTitle: curriculumOverviewTabData.subjectTitle,
      phaseSlug,
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
        curriculumSeoTextRaw: null,
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

  const curriculumPhaseOptions = {
    subjects: await curriculumApi2023.curriculumPhaseOptions(),
  };

  const subject = curriculumPhaseOptions.subjects.find((subject) => {
    return subject.slug === subjectSlug;
  });

  if (!subject) {
    return { notFound: true };
  }

  const ks4Options = subject.ks4_options ?? [];
  const ks4Option =
    ks4Options.find((ks4_option) => ks4_option.slug === ks4OptionSlug) ?? null;

  const combinedCurriculumData: CombinedCurriculumData = {
    ...curriculumData,
    ...curriculumOverviewTabData,
    ...curriculumOverviewSanityData,
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

export async function getFile({
  types,
  subjectSlug,
  phaseSlug,
  ks4OptionSlug,
  state,
  tierSlug,
  childSubjectSlug,
}: {
  types: DownloadTypes[];
  subjectSlug: string;
  phaseSlug: string;
  ks4OptionSlug?: string;
  state: "new" | "published";
  tierSlug?: string;
  childSubjectSlug?: string;
}) {
  const data = await getData({
    subjectSlug,
    phaseSlug,
    ks4OptionSlug,
    state,
    tierSlug,
    childSubjectSlug,
  });

  if (data.notFound) {
    return;
  }

  const implementationGuides = await CMSClient.implementationGuides({
    subjectTitle: data.combinedCurriculumData.subjectTitle,
    phaseSlug,
  });

  const allHandlers = [
    {
      type: "curriculumPlan",
      handler: docx,
      getFilename: (data: getDataReturn) => {
        if (data.notFound) {
          throw new Error("Data not found");
        }
        return getFilename("docx", {
          subjectTitle: data.combinedCurriculumData.subjectTitle,
          phaseTitle: data.combinedCurriculumData.phaseTitle,
          examboardTitle: data.combinedCurriculumData?.examboardTitle,
          childSubjectSlug,
          tierSlug,
          prefix: "Curriculum-plan",
          isWithinArchive: data.isWithinArchive,
        });
      },
    },
    {
      type: "nationalCurriculum",
      handler: xlsxNationalCurriculum,
      getFilename: (data: getDataReturn) => {
        if (data.notFound) {
          throw new Error("Data not found");
        }
        return getFilename("xlsx", {
          subjectTitle: data.combinedCurriculumData.subjectTitle,
          phaseTitle: data.combinedCurriculumData.phaseTitle,
          examboardTitle: data.combinedCurriculumData?.examboardTitle,
          childSubjectSlug,
          tierSlug,
          prefix: "NC-alignment",
          isWithinArchive: data.isWithinArchive,
        });
      },
    },
    ...(
      [
        "curriculumQuality",
        "whatsIncluded",
        "assessment",
        "commonQuestions",
        "equipmentList",
      ] as const
    )
      .filter((type) => {
        return !!implementationGuides?.[type];
      })
      .map((type) => {
        return {
          type: type,
          handler: async () => {
            if (implementationGuides?.[type]?.asset?.url) {
              const res = await fetch(implementationGuides[type].asset.url);
              return Buffer.from(await res.arrayBuffer());
            } else {
              throw new Error(`Implementation guide for ${type} not found`);
            }
          },
          getFilename: (data: getDataReturn) => {
            const definition = DOWNLOAD_TYPE_LABELS.find(
              ({ id }) => id === type,
            );
            if (data.notFound || !definition) {
              throw new Error("Data not found");
            }
            return getFilename("pdf", {
              subjectTitle: data.combinedCurriculumData.subjectTitle,
              phaseTitle: data.combinedCurriculumData.phaseTitle,
              examboardTitle: data.combinedCurriculumData?.examboardTitle,
              childSubjectSlug,
              tierSlug,
              prefix:
                DOWNLOAD_TYPE_LABELS.find(({ id }) => id === type)?.label ??
                type,
              isWithinArchive: data.isWithinArchive,
            });
          },
        };
      }),
  ] as const;

  const handlers = allHandlers.filter(({ type }) => {
    return types.includes(type);
  });

  const promises = handlers.map(async ({ handler, getFilename }) => {
    const arrayBuffer = Buffer.from(
      await handler(
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
      ),
    );

    const filename = getFilename({
      ...data,
      isWithinArchive: handlers.length > 1,
    });

    return { filename, buffer: arrayBuffer };
  });

  const files = await Promise.all(promises);

  let outputBuffer: Uint8Array;
  let outputFileName: string;
  if (files.length > 1) {
    outputBuffer = await zipFromFiles(files);
    outputFileName = getFilename("zip", {
      subjectTitle: data.combinedCurriculumData.subjectTitle,
      phaseTitle: data.combinedCurriculumData.phaseTitle,
      examboardTitle: data.combinedCurriculumData?.examboardTitle,
      childSubjectSlug,
      tierSlug,
      prefix: "Curriculum downloads",
    });
  } else if (files.length === 1 && files[0]) {
    outputBuffer = files[0].buffer;
    outputFileName = files[0].filename;
  } else {
    throw new Error("Invalid file list");
  }

  return {
    buffer: outputBuffer,
    filename: outputFileName,
    size: outputBuffer.length,
  };
}

export async function getFileSize(data: {
  types: DownloadTypes[];
  subjectSlug: string;
  phaseSlug: string;
  ks4OptionSlug?: string;
  state: "new" | "published";
  tierSlug?: string;
  childSubjectSlug?: string;
}) {
  const file = await getFile(data);
  return file?.size ?? -1;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>,
) {
  const {
    types,
    mvRefreshTime,
    subjectSlug,
    phaseSlug,
    state,
    ks4OptionSlug,
    tierSlug,
    childSubjectSlug,
  } = curriculumDownloadQuerySchema.parse(req.query);

  const mvRefreshTimeParsed = Number.parseInt(mvRefreshTime);
  const actualMvRefreshTime = await getMvRefreshTime();

  // Note: Disable this check to allow 'new' documents
  if (state === "new") {
    res.status(404).end();
    return;
  }

  // Check if we should redirect (new cache-hit)
  if (
    (["curriculumPlan", "nationalCurriculum"] as const).some((type) =>
      types.includes(type),
    ) &&
    mvRefreshTimeParsed !== actualMvRefreshTime
  ) {
    const slugOb = omitBy(
      {
        types,
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

    // Netlify-Vary is a hack to hopefully resolve
    res.setHeader("Netlify-Vary", "query").redirect(307, redirectUrl);
    return;
  }

  const fileData = await getFile({
    types,
    subjectSlug,
    phaseSlug,
    ks4OptionSlug,
    state,
    tierSlug,
    childSubjectSlug,
  });

  if (!fileData) {
    res.status(404).end();
    return;
  }

  res
    .setHeader("content-type", "application/msword")
    .setHeader(
      "Cache-Control",
      `public, durable, s-maxage=${s_maxage_seconds}, stale-while-revalidate=${stale_while_revalidate_seconds}`,
    )
    .setHeader(
      "Content-Disposition",
      `attachment; filename="${fileData.filename}`,
    )
    .setHeader("x-filename", `${fileData.filename}`)
    .status(200)
    .send(Buffer.from(fileData.buffer));
  return;
}
