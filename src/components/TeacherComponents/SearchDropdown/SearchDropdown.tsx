import { FC } from "react";
import {
  OakLI,
  OakFlex,
  OakP,
  OakIcon,
  OakBox,
} from "@oaknational/oak-components";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { PathwaySchemaCamel } from "@/context/Search/search.types";

const SearchDropdown: FC<
  SearchResultsItemProps & {
    isToggleOpen: boolean;
    isHovered: boolean;
  }
> = (props) => {
  const { pathways, onClick, type, isToggleOpen, isHovered } = props;

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
    <OakFlex $flexDirection={"column"} $justifyContent={"center"}>
      <OakFlex $alignItems="center">
        <OakP
          $font="heading-7"
          $color={isToggleOpen ? "navy120" : "navy"}
          $textDecoration={isHovered && !isToggleOpen ? "underline" : "none"}
          aria-label={ariaLabel}
        >
          {label}
        </OakP>
        <OakIcon
          iconName={isToggleOpen ? "chevron-up" : "chevron-down"}
          $colorFilter={isToggleOpen ? "navy120" : "navy"}
          $width="all-spacing-6"
        />
      </OakFlex>
      <OakBox
        $display={isToggleOpen ? "block" : "none"}
        $transition="standard-ease"
      >
        {dropDownContent.length > 0 && (
          <OakFlex
            as="ul"
            $mt="space-between-xs"
            data-testid="search-dropdown-content"
            $flexDirection="column"
            $width="fit-content"
            $gap="all-spacing-4"
            $pa="inner-padding-none"
            style={{ listStyleType: "none" }}
          >
            {dropDownContent.map((item, index) => {
              const buttonTitle = getDropdownButtonTitle(item);
              return (
                <OakLI
                  key={`${index}-${item.programmeSlug}`}
                  $mb="space-between-none"
                  $textAlign="left"
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
                    onClick={(e) => {
                      onClick?.({ ...props, isToggleOpen });
                      e.stopPropagation();
                    }}
                  >
                    {buttonTitle}
                  </OwaLink>
                </OakLI>
              );
            })}
          </OakFlex>
        )}
      </OakBox>
    </OakFlex>
  );
};

export default SearchDropdown;
