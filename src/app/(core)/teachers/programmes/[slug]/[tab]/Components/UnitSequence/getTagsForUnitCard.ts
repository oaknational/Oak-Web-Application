import { CardListingTags } from "@/components/TeacherComponents/CardListing/CardListing";
import { Unit } from "@/utils/curriculum/types";

export const getTagsForUnitCard = (unit: Unit) => {
  const tags: CardListingTags = [];

  unit.subjectcategories?.forEach((category) => {
    tags.push({
      label: category.title,
    });
  });

  return tags;
};
