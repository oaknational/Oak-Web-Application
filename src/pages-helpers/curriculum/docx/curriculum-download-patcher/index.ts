import { Element } from "xml-js";

import {
  mapOverElements,
  modifyXmlByRootSelector,
  pipeElementThrough,
  withBlock,
} from "../docx";

import { unitsTablePatch } from "./patches/unitsTable";
import { subjectPatch } from "./patches/subject";
import { tableOfContentsPatch } from "./patches/tableOfContents";
import { subjectExplainerPatch } from "./patches/subjectExplainer";
import { partnerDetailPatch } from "./patches/partnerDetail";
import { partnerNamePatch } from "./patches/partnerName";
import { yearPatch } from "./patches/year";
import { threadsTablePatch } from "./patches/threadsTable";
import { endOfDocumentPatch } from "./patches/endOfDocument";
import { unitTitlePatch } from "./patches/unitTitle";
import { unitNumberPatch } from "./patches/unitNumber";
import { unitLessonsPatch } from "./patches/unitLessons";
import { unitYearPatch } from "./patches/unitYear";
import { unitThreadsPatch } from "./patches/unitThreads";
import { unitPreviousPatch } from "./patches/unitPrevious";
import { unitNextPatch } from "./patches/unitNext";
import { mainThreadsPatch } from "./patches/mainThreads";
import { notUndefined } from "./patches/util";
import { coverPatch } from "./patches/cover";
import { backPatch } from "./patches/back";

import {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabData;

export default async function CurriculumDownlodsPatch(
  uint8Array: Uint8Array,
  combinedCurriculumData: CombinedCurriculumData,
  examboardSlug: string,
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
            coverPatch(combinedCurriculumData, examboardSlug),
            unitsTablePatch(combinedCurriculumData),
            subjectPatch(combinedCurriculumData),
            tableOfContentsPatch(),
            subjectExplainerPatch(combinedCurriculumData),
            partnerDetailPatch(combinedCurriculumData),
            partnerNamePatch(combinedCurriculumData),
            yearPatch(),
            threadsTablePatch(combinedCurriculumData),
            backPatch(combinedCurriculumData),
            endOfDocumentPatch(),
          ]);
        },
      );

      const docMod2 = await withBlock(
        docMod1!,
        "UNIT_PAGE",
        async (template: Element) => {
          const promises = combinedCurriculumData.units.map((unit, index) => {
            const el = structuredClone(template);
            return mapOverElements(el, (el, parent) => {
              return pipeElementThrough(el, parent, [
                unitTitlePatch(unit),
                unitNumberPatch(unit, index),
                unitLessonsPatch(unit),
                unitYearPatch(unit),
                unitThreadsPatch(unit),
                unitPreviousPatch(unit),
                unitNextPatch(unit),
              ]);
            });
          });
          const elements = await Promise.all(promises);

          return {
            type: "element",
            name: "$FRAGMENT$",
            elements: elements.filter(notUndefined),
          };
        },
      );

      const docMod3 = await withBlock(
        docMod2!,
        "THREAD_PAGE",
        async (el: Element, parent?: Element) => {
          return pipeElementThrough(el, parent, [
            mainThreadsPatch(combinedCurriculumData),
          ]);
        },
      );

      if (!docMod3) {
        throw new Error("Invalid document!");
      }

      return docMod3;
    },
  );

  return moddedFile;
}
