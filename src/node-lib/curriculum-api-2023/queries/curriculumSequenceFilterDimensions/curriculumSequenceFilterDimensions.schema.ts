import { z } from "zod";

const filterDimensionUnitSchema = z.object({
  examboard_slug: z.string().nullable(),
  tier_slug: z.string().nullable(),
  pathway_slug: z.string().nullable().optional(),
  subject_slug: z.string(),
  subject_parent_slug: z.string().nullable(),
});

const curriculumSequenceFilterDimensionsSchema = z.object({
  units: z.array(filterDimensionUnitSchema),
});

export type FilterDimensionUnit = z.infer<typeof filterDimensionUnitSchema>;

export type ExamboardFilterDimension = {
  tierSlugs: string[];
  pathwaySlugs: string[];
  childSubjectSlugs: string[];
};

type MutableExamboardFilterDimension = {
  tierSlugs: Set<string>;
  pathwaySlugs: Set<string>;
  childSubjectSlugs: Set<string>;
};

const toSortedArray = (values: Set<string>) => [...values].toSorted();

const applyUnitToBoard = (
  unit: FilterDimensionUnit,
  boardDimensions: MutableExamboardFilterDimension,
) => {
  if (unit.tier_slug) {
    boardDimensions.tierSlugs.add(unit.tier_slug);
  }
  if (unit.pathway_slug) {
    boardDimensions.pathwaySlugs.add(unit.pathway_slug);
  }
  if (unit.subject_parent_slug) {
    boardDimensions.childSubjectSlugs.add(unit.subject_slug);
  }
};

export function buildExamboardFilterDimensions(
  units: FilterDimensionUnit[],
  examBoardSlugs: string[],
): Record<string, ExamboardFilterDimension> {
  const dimensions = new Map<string, MutableExamboardFilterDimension>(
    examBoardSlugs.map((slug) => [
      slug,
      {
        tierSlugs: new Set(),
        pathwaySlugs: new Set(),
        childSubjectSlugs: new Set(),
      },
    ]),
  );

  for (const unit of units) {
    if (unit.examboard_slug === null) {
      for (const slug of examBoardSlugs) {
        applyUnitToBoard(unit, dimensions.get(slug)!);
      }
      continue;
    }

    const boardDimensions = dimensions.get(unit.examboard_slug);
    if (boardDimensions) {
      applyUnitToBoard(unit, boardDimensions);
    }
  }

  const result: Record<string, ExamboardFilterDimension> = {};

  for (const slug of examBoardSlugs) {
    const boardDimensions = dimensions.get(slug)!;

    result[slug] = {
      tierSlugs: toSortedArray(boardDimensions.tierSlugs),
      pathwaySlugs: toSortedArray(boardDimensions.pathwaySlugs),
      childSubjectSlugs: toSortedArray(boardDimensions.childSubjectSlugs),
    };
  }

  return result;
}

export default curriculumSequenceFilterDimensionsSchema;
