import { OakFlex } from "@oaknational/oak-components";
import { useState } from "react";
import { useRouter } from "next/router";

import { RadioTheme, RadioTile, isRadioTheme } from "./RadioTile";

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
  categorySlug?: string;
  yearGroupSlug?: string;
  programmeSlug: string;
};

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  trackingProps,
  idSuffix,
  onChangeCallback,
  programmeSlug,
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

  const categorySlug = router.query["category"]?.toString();
  const yearGroupSlug = router.query["year"]?.toString();

  const { track } = useAnalytics();

  const [activeThemeSlug, setActiveThemeSlug] = useState(selectedThemeSlug);
  const [focussedThemeSlug, setFocussedThemeSlug] = useState<
    string | undefined
  >(undefined);

  const onChange = (theme: { label: string; slug: string }) => {
    setActiveThemeSlug(theme.slug);

    const callbackValue = theme.slug === "all" ? undefined : theme.slug;
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

    const url = new URL(window.history.state.url, window.location.origin);
    const params = new URLSearchParams(url.search);

    const currentUrl = window.history.state.url;
    let newUrl = currentUrl;

    if ((yearGroupSlug || categorySlug) && theme.slug !== "all") {
      const newBaseUrl = `${window.location.origin}/teachers/programmes/${programmeSlug}/units`;
      params.delete("programmeSlug");
      params.delete("learning-theme");
      newUrl = `${newBaseUrl}?${params.toString()}&learning-theme=${
        theme.slug
      }`;
    } else if ((yearGroupSlug || categorySlug) && theme.slug === "all") {
      const newBaseUrl = `${window.location.origin}/teachers/programmes/${programmeSlug}/units`;
      params.delete("programmeSlug");
      params.delete("learning-theme");
      newUrl = `${newBaseUrl}?${params.toString()}`;
    } else if (!yearGroupSlug && !categorySlug && theme.slug !== "all") {
      const newBaseUrl = `${window.location.origin}/teachers/programmes/${programmeSlug}/units`;
      newUrl = `${newBaseUrl}?learning-theme=${theme.slug}`;
    } else if (!yearGroupSlug && !categorySlug && theme.slug === "all") {
      newUrl = `teachers/programmes/${programmeSlug}/units`;
    }

    window.history.replaceState(window.history.state, "", newUrl);
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
            const isChecked = activeThemeSlug === theme.slug;
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
