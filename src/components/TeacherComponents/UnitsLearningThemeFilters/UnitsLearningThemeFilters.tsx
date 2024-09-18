import { useState } from "react";
import {
  OakBox,
  OakFlex,
  OakSecondaryButton,
  TileItem,
  isTileItem,
  OakRadioTile,
} from "@oaknational/oak-components";

import {
  SpecialistUnitListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";
import { LearningThemeSelectedTrackingProps } from "@/components/SharedComponents/CategoryFilterList";
import useAnalytics from "@/context/Analytics/useAnalytics";

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
  idSuffix: string;
  onChangeCallback: (theme: string | undefined) => void;
};

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  linkProps,
  trackingProps,
  idSuffix,
  onChangeCallback,
}: UnitsLearningThemeFiltersProps) => {
  const [skipFiltersButton, setSkipFiltersButton] = useState(false);
  const themeTileItems: Array<TileItem> = learningThemes
    ? learningThemes
        .map((learningTheme) => {
          return {
            label: learningTheme?.themeTitle,
            id: learningTheme?.themeSlug,
          };
        })
        .filter(isTileItem)
        .sort((a, b) => {
          if (a.id === "no-theme") {
            return 0;
          } else if (b.id === "no-theme") {
            return -1;
          } else {
            return 0;
          }
        })
    : [];

  const { track } = useAnalytics();

  const [activeThemeSlug, setActiveThemeSlug] = useState(selectedThemeSlug);

  const onChange = (theme: TileItem) => {
    setActiveThemeSlug(theme.id);

    const callbackValue = theme.id === "all" ? undefined : theme.id;
    onChangeCallback(callbackValue);

    if (trackingProps) {
      const { keyStageSlug, subjectSlug } = trackingProps;

      track.browseRefined({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "refine",
        componentType: "filter_link",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        filterType: "Learning theme filter",
        filterValue: theme.label,
        activeFilters: { keyStage: [keyStageSlug], subject: [subjectSlug] },
      });
    }

    const query = theme.id === "all" ? "" : `?learning-theme=${theme.id}`;
    const newUrl = `/teachers/programmes/${linkProps.programmeSlug}/units${query}`;
    window.history.replaceState(window.history.state, "", newUrl);
  };

  return (
    <OakFlex $flexDirection={"column"}>
      <OakBox $mb={skipFiltersButton ? "space-between-xs" : "auto"}>
        <OakSecondaryButton
          element="a"
          aria-label="Skip to units"
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
      <OakFlex
        $flexDirection="column"
        $gap="space-between-ssx"
        role="radiogroup"
        $pb="inner-padding-xl2"
      >
        {[{ id: "all", label: "All" }, ...themeTileItems].map((theme) => {
          const isChecked = activeThemeSlug === theme.id;
          return (
            <OakRadioTile
              tileItem={theme}
              key={theme.id}
              isChecked={isChecked}
              onChange={onChange}
              id={`${theme.id}-${idSuffix}`}
            />
          );
        })}
      </OakFlex>
    </OakFlex>
  );
};

export default UnitsLearningThemeFilters;
