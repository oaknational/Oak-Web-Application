import { OakFlex } from "@oaknational/oak-components";
import { useState } from "react";
import { useRouter } from "next/router";

import { RadioTheme, RadioTile, isRadioTheme } from "./RadioTile";
import { generateUrl } from "./generateUrl";

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
  onChangeCallback: (theme: string | undefined) => void;
  categorySlug?: string;
  yearGroupSlug?: string;
  programmeSlug: string;
  setMobileFilter?: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeMobileFilter?: string;
  browseRefined: TrackFns["browseRefined"];
};

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  trackingProps,
  idSuffix,
  onChangeCallback,
  programmeSlug,
  setMobileFilter,
  activeMobileFilter,
  browseRefined,
}: UnitsLearningThemeFiltersProps) => {
  const learningThemesMapped: Array<RadioTheme> = learningThemes
    ? learningThemes
        .map((learningTheme) => {
          return {
            label: learningTheme?.themeTitle,
            slug: learningTheme?.themeSlug,
          };
        })
        .filter(isRadioTheme)
        .sort((a, b) => {
          if (a.slug === "no-theme") {
            return 0;
          } else if (b.slug === "no-theme") {
            return -1;
          } else {
            return 0;
          }
        })
    : [];
  const router = useRouter();
  const isMobile = idSuffix === "mobile";

  const categorySlug = router.query["category"]?.toString();
  const yearGroupSlug = router.query["year"]?.toString();

  const [activeThemeSlug, setActiveThemeSlug] = useState(selectedThemeSlug);
  const [focussedThemeSlug, setFocussedThemeSlug] = useState<
    string | undefined
  >(undefined);

  const onChange = (theme: { label: string; slug: string }) => {
    const callbackValue = theme.slug === "all" ? undefined : theme.slug;
    if (!isMobile) {
      setActiveThemeSlug(theme.slug);

      onChangeCallback(callbackValue);

      if (trackingProps) {
        const { keyStageSlug, subjectSlug } = trackingProps;

        browseRefined({
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

      const newUrl = generateUrl(
        theme,
        programmeSlug,
        yearGroupSlug,
        categorySlug,
      );

      window.history.replaceState(window.history.state, "", newUrl);
    } else {
      setMobileFilter?.(callbackValue);
      setActiveThemeSlug(theme.slug);
    }
  };

  return (
    <OakFlex $flexDirection={"column"}>
      <OakFlex
        $flexDirection="column"
        $gap="space-between-ssx"
        role="radiogroup"
        $pb="inner-padding-xl2"
      >
        {[{ slug: "all", label: "All" }, ...learningThemesMapped].map(
          (theme) => {
            const activeMobTheme =
              activeMobileFilter === undefined || activeMobileFilter === ""
                ? "all"
                : activeMobileFilter;
            const isChecked = !isMobile
              ? activeThemeSlug === theme.slug
              : activeMobTheme === theme.slug;
            const isFocussed = focussedThemeSlug === theme.slug;
            return (
              <RadioTile
                theme={theme}
                key={theme.slug}
                isChecked={isChecked}
                isFocussed={isFocussed}
                onChange={onChange}
                onFocus={setFocussedThemeSlug}
                id={`${theme.slug}-${idSuffix}`}
              />
            );
          },
        )}
      </OakFlex>
    </OakFlex>
  );
};

export default UnitsLearningThemeFilters;
