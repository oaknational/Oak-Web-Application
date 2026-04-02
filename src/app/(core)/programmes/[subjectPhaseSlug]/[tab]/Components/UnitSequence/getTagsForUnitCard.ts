import { Unit } from "@/utils/curriculum/types";

export const getTagsForUnitCard = (unit: Unit) => {
  const unitOptionsCount = unit.unit_options.length;
  const tags = [];
  if (unitOptionsCount) {
    tags.push({ label: `${unitOptionsCount} unit options` });
  }
  unit.subjectcategories?.forEach((category) => {
    tags.push({
      label: category.title,
    });
  });

  return tags;
};
