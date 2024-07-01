import type { NextApiRequest, NextApiResponse } from "next";

import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { formattedDate } from "@/components/CurriculumComponents/DocxPOC/util";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023, {
  CurriculumOverviewMVData,
} from "@/node-lib/curriculum-api-2023";
import docx, {
  CombinedCurriculumData,
  CurriculumUnitsTabDataIncludeNewWithOrder,
} from "@/pages-helpers/curriculum/docx/v2";
import { fetchSubjectPhasePickerData } from "@/pages/teachers/curriculum";

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
}): Promise<getDataReturn> {
  const { subjectSlug, phaseSlug, examboardSlug, state } = opts;

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

  const subjectPhaseOptions = await fetchSubjectPhasePickerData();

  const subject = subjectPhaseOptions.subjects.find(
    (subject) => subject.slug === subjectSlug,
  ) as SubjectPhasePickerData["subjects"][number] | undefined;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>,
) {
  const [subjectSlug = "", phaseSlug = "", state = "", examboardSlug = ""] =
    Array.isArray(req.query.slugs) ? req.query.slugs : [req.query.slugs];

  const data = await getData({
    subjectSlug,
    phaseSlug,
    examboardSlug,
    state,
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
      ?.subjectTitle} - ${data.combinedCurriculumData
      ?.phaseTitle} - (${state})${
      data.combinedCurriculumData.examboardTitle
        ? ` - ${data.combinedCurriculumData.examboardTitle}`
        : ""
    }`;

    const filename = `${pageTitle} - ${formattedDate(new Date())}.docx`;

    res
      .setHeader("content-type", "application/msword")
      .setHeader("Content-Disposition", `attachment; filename="${filename}`)
      .status(200)
      .send(Buffer.from(buffer));
    return;
  } else {
    res.status(404).end();
    return;
  }
}
