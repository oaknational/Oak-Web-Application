import styled from "styled-components";
import Link from "next/link";

import { OakTertiaryButton, OakFormInput, OakBox } from "@/styles/oakThemeApp";
import { resolveOakHref } from "@/common-lib/urls/urls";

// TODO Decide if we want to add extra tokens in oak-components to support
// percentages on positions
const StyledSearchButtonWrapper = styled(OakBox)`
  top: 50%;
`;

const SearchBar = () => {
  return (
    <>
      {/* Desktop we show a form to search */}
      <OakBox
        as="form"
        action={resolveOakHref({ page: "search" })}
        method="get"
        role="search"
        $display={["none", "flex"]}
        $position="relative"
        $maxWidth="spacing-180"
      >
        <OakBox $display={["none", "block"]}>
          <OakFormInput
            placeholder="Search"
            type="search"
            name="term"
            aria-label="Lesson and unit search"
            $pr="spacing-32"
          />
        </OakBox>
        <StyledSearchButtonWrapper
          $position={[null, "absolute"]}
          $right="spacing-8"
          $transform={[null, "translateY(-50%)"]}
        >
          <OakTertiaryButton
            aria-label="Submit search"
            type="submit"
            iconName="search"
          />
        </StyledSearchButtonWrapper>
      </OakBox>
      {/* Mobile we show a link to the search page */}
      <OakBox $display={["block", "none"]}>
        <OakTertiaryButton
          element={Link}
          href={resolveOakHref({ page: "search" })}
          iconName="search"
        />
      </OakBox>
    </>
  );
};

export default SearchBar;
