import { Element } from "xml-js";

import {
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
import { unitsTablePatch } from "./patches/unitsTable";

import {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { formatCurriculumUnitsData } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabData;

function generateGroupedUnits(combinedCurriculumData: CombinedCurriculumData) {
  const data = formatCurriculumUnitsData(combinedCurriculumData);
  const unitOptions = Object.entries(data.yearData).flatMap(
    ([year, { childSubjects, tiers, units }]) => {
      const options: {
        year: string;
        tier?: string;
        childSubject?: string;
      }[] = [];

      if (childSubjects.length > 0) {
        for (const childSubject of childSubjects) {
          if (tiers.length > 0) {
            for (const tier of tiers) {
              options.push({
                year,
                childSubject: childSubject.subject_slug,
                tier: tier.tier_slug,
              });
            }
          } else {
            options.push({
              year,
              childSubject: childSubject.subject_slug,
            });
          }
        }
      } else if (tiers.length > 0) {
        for (const tier of tiers) {
          if (childSubjects.length > 0) {
            for (const childSubject of childSubjects) {
              options.push({
                year,
                childSubject: childSubject.subject_slug,
                tier: tier.tier_slug,
              });
            }
          } else {
            options.push({ year, tier: tier.tier_slug });
          }
        }
      } else {
        options.push({ year });
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

  return unitOptions;
}

const sortByOrder = (units: Unit[]) => {
  return [...units].sort((a, b) => {
    return a.order - b.order;
  });
};

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
          const groupedUnits = generateGroupedUnits(combinedCurriculumData);

          const promises = groupedUnits.map(
            async ({ units, year, childSubject, tier }, index) => {
              const el = structuredClone(template);
              const sortedUnits = sortByOrder(units);

              const table = await unitsTablePatch(
                year,
                { childSubject, tier },
                sortedUnits,
                {
                  isCycle2Review: isCycle2Review,
                  noPrePageBreak: index === 0,
                },
              );

              const unitsEls = await Promise.all(
                sortedUnits.flatMap((unit, index) => {
                  if (unit.unit_options.length > 1) {
                    return unit.unit_options.map(
                      (unitOption, unitOptionIndex) => {
                        // Map in unit varients
                        return mapOverElements(el, (el, parent) => {
                          return pipeElementThrough(el, parent, [
                            unitTitlePatch(
                              unit,
                              unit.unit_options,
                              unitOptionIndex,
                            ),
                            unitNumberPatch(unit, index),
                            unitLessonsPatch(unitOption),
                            unitYearPatch(unit),
                            unitThreadsPatch(unit),
                            unitPreviousPatch(unitOption),
                            unitNextPatch(unitOption),
                          ]);
                        });
                      },
                    );
                  } else {
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
                  }
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
