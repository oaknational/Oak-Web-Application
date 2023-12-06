import { FC, useState } from "react";

import MiniDropDown from "@/components/Button/MiniDropDownButton/MiniDropDown";
import Flex from "@/components/Flex";
import Box from "@/components/Box";
import OakLink from "@/components/OakLink";

type SearchDropdownProps = {
  dropdownTitle: string;
  dropdownContent: DropdownContentItem[];
};

export type UnitContentItem = {
  type: "unit";
  unitTitle: string;
  unitSlug: string;
  programmeSlug: string;
  examboardTitle?: string;
  tierTitle?: string | null;
};

export type LessonContentItem = {
  type: "lesson";
  lessonTitle: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  examboardTitle?: string;
  tierTitle?: string;
};

type DropdownContentItem = UnitContentItem | LessonContentItem;

const SearchDropdown: FC<SearchDropdownProps> = ({
  dropdownTitle,
  dropdownContent,
}) => {
  const [isToggleOpen, setToggleOpen] = useState<boolean>(false);

  return (
    <Flex $flexDirection={"column"} $justifyContent={"center"}>
      <MiniDropDown
        label={dropdownTitle}
        title="Select exam board"
        icon={isToggleOpen ? "chevron-up" : "chevron-down"}
        onClick={() => setToggleOpen(!isToggleOpen)}
        isExpanded={isToggleOpen}
      />
      <Box
        $display={isToggleOpen ? "block" : "none"}
        $transition={"all 0.3s ease"}
      >
        {dropdownContent.length > 0 && (
          <Flex
            data-testid="search-dropdown-content"
            $flexDirection={"column"}
            $gap={16}
            $mt={8}
            $pl={8}
            $width={"fit-content"}
          >
            {dropdownContent.map((item) => {
              const buttonTitle = `${item.examboardTitle} ${
                item.tierTitle ?? ""
              }`;
              if (item.type === "unit") {
                return (
                  <OakLink
                    $color={"navy"}
                    data-testid="search-dropdown-link"
                    page={"lesson-index"}
                    programmeSlug={item.programmeSlug}
                    unitSlug={item.unitSlug}
                    $font={"heading-7"}
                    $width={"fit-content"}
                    $focusStyles={["new-underline"]}
                  >
                    {buttonTitle}
                  </OakLink>
                );
              } else if (item.type === "lesson") {
                return (
                  <OakLink
                    $font={"heading-7"}
                    page={"lesson-overview"}
                    programmeSlug={item.programmeSlug}
                    unitSlug={item.unitSlug}
                    lessonSlug={item.lessonSlug}
                    $color={"navy"}
                  >
                    {buttonTitle}
                  </OakLink>
                );
              }
            })}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default SearchDropdown;
