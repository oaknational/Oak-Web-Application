import { join } from "path";

import { format } from "date-fns";

import type {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "../../../node-lib/curriculum-api-2023";
import type { CurriculumOverviewSanityData } from "../../../common-lib/cms-types";

import * as builder from "./builder";
import {
  cmToEmu,
  cmToTwip,
  createImage,
  generateEmptyDocx,
  insertFooters,
  insertImages,
} from "./docx";

import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

export type CombinedCurriculumData = CurriculumUnitsTabData &
  CurriculumOverviewMVData &
  CurriculumOverviewSanityData;

export type Slugs = {
  subjectSlug: string;
  phaseSlug?: string;
  ks4OptionSlug?: string;
  keyStageSlug?: string;
  tierSlug?: string;
  childSubjectSlug?: string;
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

export default async function docx(
  data: CombinedCurriculumData,
  slugs: Slugs,
  ks4Options: Ks4Option[],
) {
  const zip = await generateEmptyDocx();

  const images = await insertImages(
    zip,
    {
      footerImage: join(
        process.cwd(),
        "src/pages-helpers/curriculum/docx/builder/images/footer-logo.png",
      ),
    },
    "footer-default.xml",
  );

  const footers = await insertFooters(zip, {
    default: `
      <w:p>
        <w:pPr>
            <w:jc w:val="right"/>
        </w:pPr>
        <w:r>
            <w:rPr>
                  <w:rFonts
                    w:ascii="Arial"
                    w:eastAsia="Arial"
                    w:hAnsi="Arial"
                    w:cs="Arial"
                  />
                  <w:rtl w:val="0"/>
            </w:rPr>
            <w:t xml:space="preserve">Exported ${format(
              new Date(),
              "dd MMMM yyyy",
            )}     </w:t>
            <w:tab/>
        </w:r>
        <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
            </w:rPr>
            <w:fldChar w:fldCharType="begin"/>
            <w:instrText xml:space="preserve">PAGE</w:instrText>
            <w:fldChar w:fldCharType="separate"/>
            <w:fldChar w:fldCharType="end"/>
        </w:r>
        <w:r>
            <w:rPr>
                <w:rtl w:val="0"/>
            </w:rPr>
        </w:r>
        <w:r>
            ${createImage(images.footerImage, {
              width: cmToEmu(5.33),
              height: cmToEmu(0.55),
              xPos: cmToEmu(0.001),
              yPos: cmToEmu(0.001),
              xPosAnchor: "margin",
              yPosAnchor: "line",
              isDecorative: true,
            })}
        </w:r>
    </w:p>
    `,
  });

  // Run through the builders
  const runners = {
    frontCover: async () => await builder.frontCover(zip, { data, slugs }),
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
    tableOfContents: async () =>
      await builder.tableOfContents(zip, { data, ks4Options }),
    tableOfContentsPageLayout: async () =>
      await builder.pageLayout(zip, {
        footers,
        margins: {
          top: cmToTwip(1.25),
          right: cmToTwip(1.25),
          bottom: cmToTwip(2.5),
          left: cmToTwip(1.25),
          header: cmToTwip(1.5),
          footer: cmToTwip(1.5),
        },
      }),
    ourCurriculum: async () => await builder.ourCurriculum(zip),
    threadsExplainer: async () =>
      await builder.threadsExplainer(zip, { slugs, data }),
    subjectExplainer: async () => await builder.subjectExplainer(zip, { data }),
    subjectPrincipals: async () => await builder.subjectPrincipals(),
    ourPartner: async () => await builder.ourPartner(zip, { data }),
    units: async () => await builder.units(zip, { data, slugs, ks4Options }),
    threadsOverview: async () => await builder.threadsOverview(zip, { data }),
    threadsOverviewPageLayout: async () =>
      await builder.pageLayout(zip, {
        footers,
        margins: {
          top: cmToTwip(1.5),
          right: cmToTwip(1.5),
          bottom: cmToTwip(2.5),
          left: cmToTwip(1.5),
          header: cmToTwip(1.5),
          footer: cmToTwip(1.5),
        },
      }),
    threadsDetail: async () => await builder.threadsDetail(zip, { data }),
    threadsDetailPageLayout: async () =>
      await builder.pageLayout(zip, {
        footers,
        margins: {
          top: cmToTwip(1.75),
          right: cmToTwip(1.75),
          bottom: cmToTwip(2.5),
          left: cmToTwip(1.75),
          header: cmToTwip(1.5),
          footer: cmToTwip(1.5),
        },
      }),
    backCover: async () => await builder.backCover(zip, { data }),
    backCoverPageLayout: async () =>
      await builder.pageLayout(zip, {
        footers,
        isLast: true,
        margins: {
          top: cmToTwip(1.25),
          right: cmToTwip(1.25),
          bottom: cmToTwip(2.5),
          left: cmToTwip(1.25),
          header: cmToTwip(1.5),
          footer: cmToTwip(1.5),
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
