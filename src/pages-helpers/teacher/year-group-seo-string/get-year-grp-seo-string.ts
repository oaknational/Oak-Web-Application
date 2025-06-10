import { YearGroups } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

const getYearGroupSEOString = (yearGroups: YearGroups): string => {
  if (yearGroups.length === 0) {
    return "";
  }
  if (yearGroups.length === 1) {
    const yearGroup = yearGroups[0]!;
    return `Y${yearGroup.year}`;
  }
  if (yearGroups.length === 2) {
    const yearGroup1 = yearGroups[0]!;
    const yearGroup2 = yearGroups[1]!;
    return `Y${yearGroup1.year} & ${yearGroup2.year}`;
  }
  const yearGroupStrings = yearGroups.map((yearGroup) => yearGroup.year);
  const lastYearGroup = yearGroupStrings.pop();
  return `Y${yearGroupStrings.join(", ")}, & ${lastYearGroup}`;
};

export default getYearGroupSEOString;
