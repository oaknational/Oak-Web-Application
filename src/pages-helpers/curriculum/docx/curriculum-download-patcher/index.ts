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
import { backPatch } from "./patches/back";

import {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { formatCurriculumUnitsData } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabData;

export default async function CurriculumDownlodsPatch(
  uint8Array: Uint8Array,
  combinedCurriculumData: CombinedCurriculumData,
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
          const data = formatCurriculumUnitsData(combinedCurriculumData);

          const unitOptions = Object.entries(data.yearData).flatMap(
            ([, { childSubjects, tiers, units }]) => {
              const options: { tier?: string; childSubject?: string }[] = [];

              if (childSubjects.length > 0) {
                for (const childSubject of childSubjects) {
                  if (tiers.length > 0) {
                    for (const tier of tiers) {
                      options.push({
                        childSubject: childSubject.subject_slug,
                        tier: tier.tier_slug,
                      });
                    }
                  } else {
                    options.push({ childSubject: childSubject.subject_slug });
                  }
                }
              } else if (tiers.length > 0) {
                for (const tier of tiers) {
                  if (childSubjects.length > 0) {
                    for (const childSubject of childSubjects) {
                      options.push({
                        childSubject: childSubject.subject_slug,
                        tier: tier.tier_slug,
                      });
                    }
                  } else {
                    options.push({ tier: tier.tier_slug });
                  }
                }
              } else {
                options.push({});
              }
              return options.map((option) => {
                return {
                  ...option,
                  units: units.filter((unit) => {
                    if (
                      option.tier &&
                      unit.tier_slug !== null &&
                      unit.tier_slug !== option.tier
                    ) {
                      return false;
                    }
                    if (
                      option.childSubject &&
                      unit.subject_slug !== option.childSubject
                    ) {
                      return false;
                    }
                    return true;
                  }),
                };
              });
            },
          );

          const promises = unitOptions.map(
            async ({ units, childSubject, tier }) => {
              const el = structuredClone(template);

              const table = await unitsTablePatch(
                { childSubject, tier },
                units,
              )();

              const unitsEls = await Promise.all(
                units.map((unit, index) => {
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
                }),
              );

              return {
                type: "element",
                name: "$FRAGMENT$",
                elements: [table, ...unitsEls.filter(notUndefined)],
              } as Element;
            },
          );

          return {
            type: "element",
            name: "$FRAGMENT$",
            elements: await Promise.all(promises),
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
