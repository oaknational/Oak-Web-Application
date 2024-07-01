import { relative } from "path";
import { readFile, stat } from "fs/promises";

import { glob } from "glob";
import JSZip from "jszip";

import type {
  CurriculumOverviewMVData,
  CurriculumUnitsTabDataIncludeNew,
} from "../../../../node-lib/curriculum-api-2023";
import type { CurriculumOverviewSanityData } from "../../../../common-lib/cms-types";

import * as builder from "./builder";

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
  const basedir = "./src/pages-helpers/curriculum/docx/v2/empty-document.docx";
  const files = await glob(`${basedir}/**/*`, { dot: true });

  const zip = new JSZip();
  for await (const file of files) {
    const zippath = relative(basedir, file);
    const res = await stat(file);
    if (res.isDirectory()) {
      zip.folder(zippath);
    } else {
      zip.file(zippath, await readFile(file));
    }
  }

  // Run through the builders
  await builder.frontCover(zip, { data });
  await builder.tableOfContents(zip, { data });
  await builder.ourCurriculum(zip);
  await builder.threadsExplainer(zip, { data, slugs });
  await builder.subjectExplainer(zip, { data });
  await builder.subjectPrincipals(zip, { data });
  await builder.ourPartner(zip, { data });
  await builder.units(zip, { data, slugs });
  await builder.threadsOverview(zip, { data });
  await builder.threadsDetail(zip, { data });
  await builder.backCover(zip, { data });

  return await zip.generateAsync({
    type: "uint8array",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
  });
}
