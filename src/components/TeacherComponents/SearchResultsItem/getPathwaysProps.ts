import { PathwaySchemaCamel } from "@/context/Search/search.types";

export const getPathwayCardProps = (
  pathways: PathwaySchemaCamel[],
  type: string,
  title: string,
) => {
  const getSlug = (item: string | null | undefined) => item || "";

  const examDropdownContent = pathways
    .filter(({ examBoardSlug }) => !!examBoardSlug)
    .sort((a, b) => {
      return (
        getSlug(a.examBoardSlug).localeCompare(getSlug(b.examBoardSlug)) ||
        getSlug(b.tierSlug).localeCompare(getSlug(a.tierSlug))
      );
    });

  const tierDropdownContent = pathways
    .filter(({ examBoardSlug, tierSlug }) => !examBoardSlug && tierSlug)
    .sort((a, b) => {
      return getSlug(b.tierSlug).localeCompare(getSlug(a.tierSlug));
    });

  const isExamBoardDropdown = examDropdownContent.length > 0;
  const isTierDropdown = tierDropdownContent.length > 0;

  const dropdownContent = isExamBoardDropdown
    ? examDropdownContent
    : isTierDropdown
      ? tierDropdownContent
      : pathways;

  const pathwaysDropdownLabel = `Select ${
    isExamBoardDropdown ? "exam board" : isTierDropdown ? "tier" : "unit"
  }`;
  const pathwaysButtonAriaLabel = `${pathwaysDropdownLabel} for ${type}: ${title}`;

  return {
    pathwaysDropdownLabel,
    pathwaysButtonAriaLabel,
    dropdownContent,
  };
};
