import {
  OakBox,
  oakDefaultTheme,
  OakFlex,
  OakSecondaryButton,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { useState } from "react";

import {
  SpecialistUnitListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";
import CategoryFilterList, {
  LearningThemeSelectedTrackingProps,
} from "@/components/SharedComponents/CategoryFilterList";
import useCategoryFilterList from "@/components/SharedComponents/CategoryFilterList/useCategoryFilterList";

export type LearningTheme = {
  themeSlug?: string | null;
  themeTitle?: string | null;
};

export type UnitsLearningThemeFiltersProps = {
  labelledBy: string;
  selectedThemeSlug: string;
  learningThemes: LearningTheme[] | null;
  linkProps: UnitListingLinkProps | SpecialistUnitListingLinkProps;
  trackingProps?: LearningThemeSelectedTrackingProps;
};
const UnitsLearningThemeFilters = ({
  labelledBy,
  learningThemes = [],
  selectedThemeSlug,
  linkProps,
  trackingProps,
}: UnitsLearningThemeFiltersProps) => {
  const [skipFiltersButton, setSkipFiltersButton] = useState(false);
  const listStateProps = useCategoryFilterList({
    selectedKey: selectedThemeSlug,
    getKey: (
      linkProps: UnitListingLinkProps | SpecialistUnitListingLinkProps,
    ) => {
      if (linkProps.search?.["learning-theme"]) {
        return linkProps.search?.["learning-theme"];
      } else return "all";
    },
  });

  const learningThemesMapped = learningThemes
    ? learningThemes
        .map((learningTheme) => {
          return {
            label: learningTheme?.themeTitle,
            slug: learningTheme?.themeSlug,
          };
        })
        .sort(
          (
            a: {
              label: string | undefined | null;
              slug: string | undefined | null;
            },
            b: {
              label: string | undefined | null;
              slug: string | undefined | null;
            },
          ) => {
            if (a?.slug === "no-theme") {
              return 0;
            } else if (b?.slug === "no-theme") {
              return -1;
            } else {
              return 0;
            }
          },
        )
    : [];

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex
        $mb={"space-between-xl"}
        $position={"relative"}
        $flexDirection={"column"}
      >
        <OakBox $mb={skipFiltersButton ? "space-between-xs" : "auto"}>
          <OakSecondaryButton
            element="a"
            href="#unit-list"
            onFocus={() => setSkipFiltersButton(true)}
            onBlur={() => setSkipFiltersButton(false)}
            style={
              skipFiltersButton ? {} : { position: "absolute", top: "-600px" }
            }
          >
            Skip to units
          </OakSecondaryButton>
        </OakBox>
        <CategoryFilterList
          {...listStateProps}
          labelledBy={labelledBy}
          categories={[
            {
              label: "All in suggested order",
              linkProps: {
                ...linkProps,
                search: { ...linkProps.search, ["learning-theme"]: undefined },
              },
            },
            ...learningThemesMapped.map(({ label, slug }) => ({
              label: label ? label : "",
              linkProps: {
                ...linkProps,
                search: { ...linkProps.search, ["learning-theme"]: slug },
              },
            })),
          ]}
          themeTrackingProps={trackingProps}
        />
      </OakFlex>
    </OakThemeProvider>
  );
};

export default UnitsLearningThemeFilters;
