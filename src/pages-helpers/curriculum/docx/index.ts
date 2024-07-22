import type {
  CurriculumOverviewMVData,
  CurriculumUnitsTabDataIncludeNew,
} from "../../../node-lib/curriculum-api-2023";
import type { CurriculumOverviewSanityData } from "../../../common-lib/cms-types";

import * as builder from "./builder";
import { cmToTwip, generateEmptyDocx } from "./docx";

type CurriculumUnitsTabDataIncludeNewUnit =
  CurriculumUnitsTabDataIncludeNew["units"][number] & {
    order: NonNullable<
      CurriculumUnitsTabDataIncludeNew["units"][number]["order"]
    >;
  };
export type CurriculumUnitsTabDataIncludeNewWithOrder = {
  units: CurriculumUnitsTabDataIncludeNewUnit[];
};

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabDataIncludeNewWithOrder;

export type Slugs = {
  subjectSlug: string;
  phaseSlug?: string;
  examboardSlug?: string;
  keyStageSlug?: string;
};

export default async function docx(data: CombinedCurriculumData, slugs: Slugs) {
  const zip = await generateEmptyDocx();

  // Run through the builders
  await builder.frontCover(zip, { data });
  await builder.pageLayout(zip, {
    margins: {
      top: cmToTwip(1.5),
      right: cmToTwip(1.5),
      bottom: cmToTwip(1.5),
      left: cmToTwip(1.5),
      header: cmToTwip(1.5),
      footer: cmToTwip(1.5),
    },
  });
  await builder.tableOfContents(zip, { data });
  await builder.pageLayout(zip, {
    margins: {
      top: cmToTwip(1.25),
      right: cmToTwip(1.25),
      bottom: cmToTwip(1.25),
      left: cmToTwip(1.25),
      header: cmToTwip(1.25),
      footer: cmToTwip(1.25),
    },
  });
  await builder.ourCurriculum(zip);
  await builder.threadsExplainer(zip, { slugs });
  await builder.subjectExplainer(zip, { data });
  await builder.subjectPrincipals(zip, { data });
  await builder.ourPartner(zip, { data });
  await builder.units(zip, { data, slugs });
  await builder.threadsOverview(zip, { data });
  await builder.pageLayout(zip, {
    margins: {
      top: cmToTwip(1.5),
      right: cmToTwip(1.5),
      bottom: cmToTwip(1.5),
      left: cmToTwip(1.5),
      header: cmToTwip(1.5),
      footer: cmToTwip(1.5),
    },
  });
  await builder.threadsDetail(zip, { data });
  await builder.pageLayout(zip, {
    margins: {
      top: cmToTwip(1.75),
      right: cmToTwip(1.75),
      bottom: cmToTwip(1.75),
      left: cmToTwip(1.75),
      header: cmToTwip(1.75),
      footer: cmToTwip(1.75),
    },
  });
  await builder.backCover(zip, { data });
  await builder.pageLayout(zip, {
    isLast: true,
    margins: {
      top: cmToTwip(1.25),
      right: cmToTwip(2.25),
      bottom: cmToTwip(1.25),
      left: cmToTwip(2.25),
      header: cmToTwip(1.25),
      footer: cmToTwip(1.25),
    },
  });

  return await zip.generateAsync({
    type: "uint8array",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
  });
}
