import { FC, useState } from "react";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import MiniDropDown from "@/components/SharedComponents/Button/MiniDropDownButton/MiniDropDown";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import OakLink from "@/components/SharedComponents/OakLink";
import { LI } from "@/components/SharedComponents/Typography";
import { FlexList } from "@/components/SharedComponents/Typography/UL";

const SearchDropdown: FC<SearchResultsItemProps> = (props) => {
  const { pathways, onClick, onToggleClick } = props;
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

  const label = `Select ${isExamBoardDropdown ? "exam board" : "tier"}`;

  const dropDownContent = isExamBoardDropdown
    ? examDropdownContent
    : tierDropdownContent;

  return (
    <Flex $ml={-8} $flexDirection={"column"} $justifyContent={"center"}>
      <MiniDropDown
        label={label}
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
          <FlexList
            $mt={16}
            $reset
            data-testid="search-dropdown-content"
            $flexDirection={"column"}
            $width={"fit-content"}
            $gap={16}
          >
            {dropDownContent.map((item, index) => {
              const buttonTitle = `${item.examBoardTitle ?? ""} ${
                item.tierTitle ?? ""
              }`;

              return (
                <LI $pl={8} key={`${index}-${item.programmeSlug}`} $mb={16}>
                  <OakLink
                    $color={"navy"}
                    data-testid="search-dropdown-link"
                    $font={"heading-7"}
                    $width={"fit-content"}
                    $focusStyles={["new-underline"]}
                    {...props.buttonLinkProps}
                    programmeSlug={item.programmeSlug}
                    onClick={() => {
                      onClick?.({ ...props, isToggleOpen });
                    }}
                  >
                    {buttonTitle}
                  </OakLink>
                </LI>
              );
            })}
          </FlexList>
        )}
      </Box>
    </Flex>
  );
};

export default SearchDropdown;
