import { FC, useState } from "react";

import Flex from "@/components/Flex";
import Box from "@/components/Box";
import Button from "@/components/Button";
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
    <Flex $flexDirection={"column"} $alignItems={"flex-start"}>
      <Button
        variant={"minimal"}
        $iconPosition="trailing"
        iconBackground="white"
        $font={"heading-7"}
        aria-expanded={isToggleOpen}
        aria-label={dropdownTitle}
        title={dropdownTitle}
        label={dropdownTitle}
        icon={isToggleOpen ? "chevron-up" : "chevron-down"}
        onClick={() => setToggleOpen(!isToggleOpen)}
        buttonColor={"navy"}
        isCurrent={true}
        currentStyles={["color"]}
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
            $mt={16}
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
