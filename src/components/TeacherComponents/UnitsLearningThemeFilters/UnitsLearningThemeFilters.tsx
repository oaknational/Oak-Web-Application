import { useState } from "react";
import {
  OakFlex,
  TileItem,
  isTileItem,
  OakRadioTile,
} from "@oaknational/oak-components";
import router from "next/router";

import {
  SpecialistUnitListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";
import { LearningThemeSelectedTrackingProps } from "@/components/SharedComponents/CategoryFilterList";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

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
  idSuffix: "desktop" | "mobile";
  programmeSlug: string;
  browseRefined: TrackFns["browseRefined"];
  setTheme: (theme: string | undefined) => void;
};

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  trackingProps,
  idSuffix,
  programmeSlug,
  browseRefined,
  setTheme,
}: UnitsLearningThemeFiltersProps) => {
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

  const onChange = (theme: TileItem) => {
    setTheme(theme.id);
    //   const callbackValue = theme.id;
    //   setActiveThemeSlug(theme.id);
    // if (!isMobile) {
    //  onChangeCallback?.(callbackValue);
    // if (trackingProps) {
    //   const { keyStageSlug, subjectSlug } = trackingProps;
    //   browseRefined({
    //     platform: "owa",
    //     product: "teacher lesson resources",
    //     engagementIntent: "refine",
    //     componentType: "filter_link",
    //     eventVersion: "2.0.0",
    //     analyticsUseCase: "Teacher",
    //     filterType: "Learning theme filter",
    //     filterValue: theme.label,
    //     activeFilters: { keyStage: [keyStageSlug], subject: [subjectSlug] },
    //   });
    // }

    //   const newUrl = generateUrl(
    //     { slug: theme.id },
    //     programmeSlug,
    //     yearGroupSlug,
    //     categorySlug,
    //   );

    //   router.push(newUrl, undefined, { shallow: true });
    // } else {
    //   setMobileFilter?.(callbackValue);
    //   setActiveThemeSlug(theme.id);
    // }
  };

  return (
    <OakFlex $flexDirection={"column"}>
      <OakFlex
        $flexDirection="column"
        $gap="space-between-ssx"
        role="radiogroup"
        $pb="inner-padding-xl2"
      >
        {[{ id: "all", label: "All" }, ...themeTileItems].map(
          (theme, index) => {
            const isChecked = theme.id === selectedThemeSlug;
            return (
              <OakRadioTile
                tileItem={theme}
                key={`${theme.id}-${index}`}
                isChecked={isChecked}
                onChange={onChange}
                id={`${theme.id}-${idSuffix}`}
              />
            );
          },
        )}
      </OakFlex>
    </OakFlex>
  );
};

export default UnitsLearningThemeFilters;
