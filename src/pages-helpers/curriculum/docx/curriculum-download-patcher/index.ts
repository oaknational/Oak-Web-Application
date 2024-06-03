import { Element } from "xml-js";

import {
  destroyPastTag,
  mapOverElements,
  modifyXmlByRootSelector,
  pipeElementThrough,
  withBlock,
} from "../docx";

import { subjectPatch } from "./patches/subject";
import { tableOfContentsPatch } from "./patches/tableOfContents";
import { subjectExplainerPatch } from "./patches/subjectExplainer";
import { partnerDetailPatch } from "./patches/partnerDetail";
import { partnerNamePatch } from "./patches/partnerName";
import { threadsTablePatch } from "./patches/threadsTable";
import { mainThreadsPatch } from "./patches/mainThreads";
import { coverPatch } from "./patches/cover";
import { backPatch } from "./patches/back";
import { threadOverviewTitlePatch } from "./patches/threadOverviewTitle";
import { unitsPatch } from "./patches/units";

import {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabData;

async function patchFile(
  uint8Array: Uint8Array,
  combinedCurriculumData: CombinedCurriculumData,
  isCycle2Review = false,
) {
  // NOTE: This is really inefficient at the moment, that's fine for now though
  const moddedFile = await modifyXmlByRootSelector(
    uint8Array,
    "w:document",
    async (doc) => {
      const docMod1 = await mapOverElements(
        doc,
        (el: Element, parent?: Element) => {
          return pipeElementThrough(el, parent, [
            coverPatch(combinedCurriculumData),
            subjectPatch(combinedCurriculumData),
            threadOverviewTitlePatch(combinedCurriculumData),
            tableOfContentsPatch(),
            subjectExplainerPatch(combinedCurriculumData),
            partnerDetailPatch(combinedCurriculumData),
            partnerNamePatch(combinedCurriculumData),
            threadsTablePatch(combinedCurriculumData),
            backPatch(combinedCurriculumData),
            unitsPatch(combinedCurriculumData, isCycle2Review),
          ]);
        },
      );

      // TODO: This should be merged into the above process.
      const docMod2 = await withBlock(
        docMod1!,
        "THREAD_PAGE",
        async (el: Element, parent?: Element) => {
          return pipeElementThrough(el, parent, [
            mainThreadsPatch(combinedCurriculumData),
          ]);
        },
      );

      const docMod3 = destroyPastTag(docMod2!, "END_OF_DOCUMENT");

      if (!docMod3) {
        throw new Error("Invalid document!");
      }

      return docMod3;
    },
  );

  return moddedFile;
}

export async function CurriculumDownlodsCycle1Patch(
  uint8Array: Uint8Array,
  combinedCurriculumData: CombinedCurriculumData,
) {
  return patchFile(uint8Array, combinedCurriculumData, false);
}

export async function CurriculumDownlodsCycle2Patch(
  uint8Array: Uint8Array,
  combinedCurriculumData: CombinedCurriculumData,
) {
  return patchFile(uint8Array, combinedCurriculumData, true);
}
