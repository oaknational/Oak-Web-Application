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

const ENABLE_TIMER = false;
const measure = (key: string, fn: () => void | Promise<void>) => {
  if (!ENABLE_TIMER) {
    const v = fn();
    return v;
  }
  let err: unknown;
  let v;
  console.time(key);
  try {
    v = fn();
  } catch (_err: unknown) {
    err = _err;
  } finally {
    console.timeEnd(key);
  }

  if (err) throw err;
  return v;
};

export default async function docx(data: CombinedCurriculumData, slugs: Slugs) {
  const zip = await generateEmptyDocx();

  // Run through the builders
  const runners = {
    frontCover: async () => await builder.frontCover(zip, { data }),
    frontCoverPageLayout: async () =>
      await builder.pageLayout(zip, {
        margins: {
          top: cmToTwip(1.5),
          right: cmToTwip(1.5),
          bottom: cmToTwip(1.5),
          left: cmToTwip(1.5),
          header: cmToTwip(1.5),
          footer: cmToTwip(1.5),
        },
      }),
    tableOfContents: async () => await builder.tableOfContents(zip, { data }),
    tableOfContentsPageLayout: async () =>
      await builder.pageLayout(zip, {
        margins: {
          top: cmToTwip(1.25),
          right: cmToTwip(1.25),
          bottom: cmToTwip(1.25),
          left: cmToTwip(1.25),
          header: cmToTwip(1.25),
          footer: cmToTwip(1.25),
        },
      }),
    ourCurriculum: async () => await builder.ourCurriculum(zip),
    threadsExplainer: async () =>
      await builder.threadsExplainer(zip, { slugs }),
    subjectExplainer: async () => await builder.subjectExplainer(zip, { data }),
    subjectPrincipals: async () =>
      await builder.subjectPrincipals(zip, { data }),
    ourPartner: async () => await builder.ourPartner(zip, { data }),
    units: async () => await builder.units(zip, { data, slugs }),
    threadsOverview: async () => await builder.threadsOverview(zip, { data }),
    threadsOverviewPageLayout: async () =>
      await builder.pageLayout(zip, {
        margins: {
          top: cmToTwip(1.5),
          right: cmToTwip(1.5),
          bottom: cmToTwip(1.5),
          left: cmToTwip(1.5),
          header: cmToTwip(1.5),
          footer: cmToTwip(1.5),
        },
      }),
    threadsDetail: async () => await builder.threadsDetail(zip, { data }),
    threadsDetailPageLayout: async () =>
      await builder.pageLayout(zip, {
        margins: {
          top: cmToTwip(1.75),
          right: cmToTwip(1.75),
          bottom: cmToTwip(1.75),
          left: cmToTwip(1.75),
          header: cmToTwip(1.75),
          footer: cmToTwip(1.75),
        },
      }),
    backCover: async () => await builder.backCover(zip, { data }),
    backCoverPageLayout: async () =>
      await builder.pageLayout(zip, {
        isLast: true,
        margins: {
          top: cmToTwip(1.25),
          right: cmToTwip(1.25),
          bottom: cmToTwip(1.25),
          left: cmToTwip(1.25),
          header: cmToTwip(1.25),
          footer: cmToTwip(1.25),
        },
      }),
  };

  // Note: Just some code to messure some timings.
  await measure("total", async () => {
    for (const [key, runner] of Object.entries(runners)) {
      await measure(key, async () => {
        await runner();
      });
    }
  });

  return await zip.zipToBuffer();
}
