import { FC } from "react";
import {
  OakLI,
  OakFlex,
  OakP,
  OakIcon,
  OakBox,
  OakLink,
  OakSpan,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import { PathwaySchemaCamel } from "@/context/Search/search.types";
import { LessonOverviewLinkProps, resolveOakHref } from "@/common-lib/urls";

const StyledOakLink = styled(OakLink)`
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

const SearchDropdown: FC<
  SearchResultsItemProps & {
    isToggleOpen: boolean;
    isHovered: boolean;
    label: string;
    isExamBoardDropdown?: boolean;
    isTierDropdown?: boolean;
    dropdownContent: PathwaySchemaCamel[];
  }
> = (props) => {
  const { onClick, isToggleOpen, isHovered, label, dropdownContent } = props;

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
        {dropdownContent.length > 0 && (
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
            {dropdownContent.map((item, index) => {
              const buttonTitle = getDropdownButtonTitle(item);
              return (
                <OakLI
                  key={`${index}-${item.programmeSlug}`}
                  $mb="space-between-none"
                  $textAlign="left"
                >
                  <StyledOakLink
                    {...props.buttonLinkProps}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      onClick?.({ ...props, isToggleOpen });
                      e.stopPropagation();
                    }}
                    data-testid="search-dropdown-link"
                    href={resolveOakHref({
                      programmeSlug: item.programmeSlug,
                      unitSlug: item.unitSlug,
                      lessonSlug: (
                        props.buttonLinkProps as LessonOverviewLinkProps
                      )?.lessonSlug,
                      page: props.buttonLinkProps.page,
                    })}
                  >
                    <OakSpan $font="heading-7">{buttonTitle}</OakSpan>
                  </StyledOakLink>
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
