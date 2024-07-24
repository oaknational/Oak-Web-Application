import type { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";

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

type getDataReturn =
  | { notFound: true }
  | {
      notFound: false;
      combinedCurriculumData: CombinedCurriculumData;
      examboardSlug: string;
      subjectSlug: string;
      phaseSlug: string;
      state: string;
      dataWarnings: string[];
    };
async function getData(opts: {
  subjectSlug: string;
  phaseSlug: string;
  examboardSlug: string;
  state: string;
  tierSlug: string;
  childSubjectSlug: string;
}): Promise<getDataReturn> {
  const {
    subjectSlug,
    phaseSlug,
    examboardSlug,
    state,
    childSubjectSlug,
    tierSlug,
  } = opts;

  let curriculumOverviewSanityData: CurriculumOverviewSanityData | null;
  let curriculumOverviewTabData: CurriculumOverviewMVData | null;
  let curriculumData: CurriculumUnitsTabDataIncludeNewWithOrder | null;
  const dataWarnings: string[] = [];

  try {
    const curriculumDataUnsorted =
      await curriculumApi2023.curriculumUnitsIncludeNew({
        subjectSlug,
        phaseSlug,
        examboardSlug,
        state,
      });

    // HACK: This sorts by examboard to push NULLs to the bottom of the list, to fix picking up the correct `unit_options`
    curriculumData = {
      ...curriculumDataUnsorted,
      units: [...curriculumDataUnsorted.units]
        .filter((a) => {
          if (a.keystage_slug === "ks4") {
            if (a.subject_slug && childSubjectSlug) {
              return a.subject_slug === childSubjectSlug;
            }
            if (a.tier_slug && tierSlug) {
              return a.tier_slug === tierSlug;
            }
            return true;
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
    try {
      curriculumOverviewTabData = await curriculumApi2023.curriculumOverview({
        subjectSlug,
        phaseSlug,
      });
    } catch (error) {
      dataWarnings.push("Overview data is missing, dummy data will be used.");
      curriculumOverviewTabData = {
        curriculaDesc:
          "Curricula description is undefined for this record. Please check the CMS.",
        subjectTitle:
          "Subject title is undefined for this record. Please check the CMS.",
        phaseTitle:
          "Phase title is undefined for this record. Please check the CMS.",
        examboardTitle: null,
      };
    }

    curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage({
      previewMode: false,
      ...{ subjectSlug, phaseSlug },
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
        video: {
          title:
            "Video title is undefined for this record. Please check the CMS.",
          video: {
            asset: { assetId: "", playbackId: "undefined", thumbTime: null },
          },
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
    return {
      notFound: true,
    };
  }

  const subjectPhaseOptions = {
    subjects: await curriculumApi2023.subjectPhaseOptionsIncludeNew(),
  };

  const subject = subjectPhaseOptions.subjects.find((subject) => {
    return subject.slug === subjectSlug && subject.state === state;
  }) as SubjectPhasePickerData["subjects"][number] | undefined;
  const examboard =
    subject?.examboards?.find(
      (examboard) => examboard.slug === examboardSlug,
    ) ?? null;

  const combinedCurriculumData: CombinedCurriculumData = {
    ...curriculumData,
    ...curriculumOverviewTabData,
    ...curriculumOverviewSanityData,
    ...{ state },
    examboardTitle: examboard?.title ?? null,
  };

  return {
    notFound: false,
    combinedCurriculumData,
    examboardSlug,
    subjectSlug,
    phaseSlug,
    state,
    dataWarnings,
  };
}

const stale_while_revalidate_seconds = 60 * 3;
const s_maxage_seconds = 60 * 60 * 24;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>,
) {
  const slugs = Array.isArray(req.query.slugs)
    ? req.query.slugs
    : [req.query.slugs];
  const [
    mvRefreshTimeRaw = "",
    subjectSlug = "",
    phaseSlug = "",
    state = "",
    examboardSlug = "",
    tierSlug = "",
    childSubjectSlug = "",
  ] = slugs;

  const mvRefreshTime = parseInt(mvRefreshTimeRaw);
  const actualMvRefreshTime = await getMvRefreshTime();

  // Check if we should redirect (new cache-hit)
  if (mvRefreshTime !== actualMvRefreshTime) {
    const newSlugs = [...slugs];
    newSlugs[0] = String(actualMvRefreshTime);
    const redirectUrl = `/api/curriculum-downloads/${newSlugs.join("/")}`;
    res.redirect(307, redirectUrl);
    return;
  }

  const data = await getData({
    subjectSlug,
    phaseSlug,
    examboardSlug,
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
      examboardSlug: data.examboardSlug,
    });

    const pageTitle: string = `${data.combinedCurriculumData
      ?.subjectTitle} - ${data.combinedCurriculumData?.phaseTitle}${
      data.combinedCurriculumData.examboardTitle
        ? ` - ${data.combinedCurriculumData.examboardTitle}`
        : ""
    }`;

    const filename = `${pageTitle} - ${format(
      Date.now(),
      // Note: dashes "-" rather than ":" because colon is invalid on windows
      "dd-MM-yyyy",
    )}.docx`;

    res
      .setHeader("content-type", "application/msword")
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
