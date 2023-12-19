import { FC, useState } from "react";

import { SearchResultsItemProps } from "../SearchResultsItem/SearchResultsItem";

import MiniDropDown from "@/components/Button/MiniDropDownButton/MiniDropDown";
import Flex from "@/components/Flex";
import Box from "@/components/Box";
import OakLink from "@/components/OakLink";
import { LI } from "@/components/Typography";
import { FlexList } from "@/components/Typography/UL";

const SearchDropdown: FC<SearchResultsItemProps & { label: string }> = (
  props,
) => {
  const { pathways, label, onClick } = props;
  const [isToggleOpen, setToggleOpen] = useState<boolean>(false);
  const examDropdownContent = pathways
    .filter(({ examBoardSlug }) => examBoardSlug)
    .sort((a, b) => {
      const getSlug = (item: string | null | undefined) => item || "";
      return (
        getSlug(a.examBoardSlug).localeCompare(getSlug(b.examBoardSlug)) ||
        getSlug(a.tierSlug).localeCompare(getSlug(b.tierSlug))
      );
    });

  return (
    <Flex $flexDirection={"column"} $justifyContent={"center"}>
      <MiniDropDown
        label={label}
        title="Select exam board"
        icon={isToggleOpen ? "chevron-up" : "chevron-down"}
        onClick={() => setToggleOpen(!isToggleOpen)}
        isExpanded={isToggleOpen}
      />
      <Box
        $display={isToggleOpen ? "block" : "none"}
        $transition={"all 0.3s ease"}
      >
        {examDropdownContent.length > 0 && (
          <FlexList
            $reset
            data-testid="search-dropdown-content"
            $flexDirection={"column"}
            $width={"fit-content"}
            $gap={16}
          >
            {examDropdownContent.map((item, index) => {
              const buttonTitle = `${item.examBoardTitle} ${
                item.tierTitle ?? ""
              }`;

              return (
                <LI key={`${index}-${item.programmeSlug}`} $mb={16}>
                  <OakLink
                    $color={"navy"}
                    data-testid="search-dropdown-link"
                    $font={"heading-7"}
                    $width={"fit-content"}
                    $focusStyles={["new-underline"]}
                    {...props.buttonLinkProps}
                    programmeSlug={item.programmeSlug}
                    onClick={() => {
                      onClick?.(props);
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
