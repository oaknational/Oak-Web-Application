import { FC, useState } from "react";
import { OakLI, OakFlex } from "@oaknational/oak-components";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import MiniDropDown from "@/components/SharedComponents/Button/MiniDropDownButton/MiniDropDown";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { PathwaySchemaCamel } from "@/context/Search/search.types";

const SearchDropdown: FC<SearchResultsItemProps> = (props) => {
  const { pathways, onClick, onToggleClick, type } = props;
  const [isToggleOpen, setToggleOpen] = useState<boolean>(false);

  const getSlug = (item: string | null | undefined) => item || "";

  const examDropdownContent = pathways
    .filter(({ examBoardSlug }) => examBoardSlug !== null)
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

  const label = `Select ${
    isExamBoardDropdown ? "exam board" : isTierDropdown ? "tier" : "unit"
  }`;
  const ariaLabel = `${label} for ${type}: ${props.title}`;

  const dropDownContent = isExamBoardDropdown
    ? examDropdownContent
    : isTierDropdown
      ? tierDropdownContent
      : pathways;

  const getDropdownButtonTitle = (item: PathwaySchemaCamel) => {
    const examboardTitle = !!item.examBoardTitle;
    const tierTitle = !!item.tierTitle;

    if (examboardTitle && !tierTitle) {
      return item.examBoardTitle;
    } else if (tierTitle && !examboardTitle) {
      return item.tierTitle;
    } else if (tierTitle && examboardTitle) {
      return `${item.examBoardTitle} ${item.tierTitle}`;
    } else {
      return item.unitTitle;
    }
  };

  return (
    <Flex $ml={-8} $flexDirection={"column"} $justifyContent={"center"}>
      <MiniDropDown
        label={label}
        ariaLabel={ariaLabel}
        title={label}
        icon={isToggleOpen ? "chevron-up" : "chevron-down"}
        onClick={() => {
          setToggleOpen(!isToggleOpen);
          onToggleClick?.({ ...props, isToggleOpen: !isToggleOpen });
        }}
        isExpanded={isToggleOpen}
      />
      <Box
        $display={isToggleOpen ? "block" : "none"}
        $transition={"all 0.3s ease"}
      >
        {dropDownContent.length > 0 && (
          <OakFlex
            as="ul"
            $mt="space-between-xs"
            data-testid="search-dropdown-content"
            $flexDirection="column"
            $width="fit-content"
            $gap="all-spacing-4"
          >
            {dropDownContent.map((item, index) => {
              const buttonTitle = getDropdownButtonTitle(item);
              return (
                <OakLI
                  $pl="inner-padding-xs"
                  key={`${index}-${item.programmeSlug}`}
                  $mb="space-between-s"
                >
                  <OwaLink
                    $color={"navy"}
                    data-testid="search-dropdown-link"
                    $font={"heading-7"}
                    $width={"fit-content"}
                    $focusStyles={["new-underline"]}
                    {...props.buttonLinkProps}
                    programmeSlug={item.programmeSlug}
                    unitSlug={item.unitSlug}
                    onClick={() => {
                      onClick?.({ ...props, isToggleOpen });
                    }}
                  >
                    {buttonTitle}
                  </OwaLink>
                </OakLI>
              );
            })}
          </OakFlex>
        )}
      </Box>
    </Flex>
  );
};

export default SearchDropdown;
