import { YearGroups } from "../../../node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

const getYearGroupSEOString = (yearGroups: YearGroups): string => {
  if (yearGroups.length === 0) {
    return "";
  }
  // if there is only one year group, return it formatted
  if (yearGroups.length === 1) {
    const yearTitle = yearGroups[0]!.yearTitle;
    return getYearfromYearTitle(yearTitle, true);
  }

  //   split the elements into two parts: the last element and the rest
  const lastElement = yearGroups[yearGroups.length - 1]!;
  const restOfElements = yearGroups.slice(0, -1);

  //   For the main elements, we want them with commas between
  const mainString = restOfElements
    .map((group) => getYearfromYearTitle(group.yearTitle))
    .join(", ");
  const lastYear = getYearfromYearTitle(lastElement.yearTitle);
  //   put a comma before the last element
  const string = `${mainString} & ${lastYear}`;

  //   find the first number and put a Y before it
  return string.replace(/(\d+)/, "Y$1");
};

const getYearfromYearTitle = (
  yearTitle: YearGroups[number]["yearTitle"],
  isOnlyElement: boolean = false,
): string => {
  const yearMatch = yearTitle.match(/Year (\d+)/);
  if (yearMatch && yearMatch[1]) {
    // put a Y before the number if it is a year
    return isOnlyElement ? `Y${yearMatch[1]}` : yearMatch[1];
  } else if (yearTitle === "Reception" || yearTitle === "All years") {
    return yearTitle;
  }
  return "";
};

export default getYearGroupSEOString;
