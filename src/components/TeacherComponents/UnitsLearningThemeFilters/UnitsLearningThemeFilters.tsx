import {
  OakBox,
  OakFlex,
  OakSecondaryButton,
} from "@oaknational/oak-components";
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
};

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  linkProps,
  trackingProps,
  idSuffix,
}: UnitsLearningThemeFiltersProps) => {
  const [skipFiltersButton, setSkipFiltersButton] = useState(false);
  const learningThemesMapped: Array<RadioTheme> = learningThemes
    ? learningThemes
        .map((learningTheme) => {
          return {
            label: learningTheme?.themeTitle,
            slug: learningTheme?.themeSlug,
          };
        })
        .filter((theme) => isRadioTheme(theme))
        .map((theme) => theme as RadioTheme)
        .sort((a: RadioTheme, b: RadioTheme) => {
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
  const { track } = useAnalytics();

  // Manual setting the active theme slug on select to avoid a delay in visual state updating while the page reloads
  const [activeThemeSlug, setActiveThemeSlug] = useState(selectedThemeSlug);

  const [focussedThemeSlug, setFocussedThemeSlug] = useState<
    string | undefined
  >(undefined);

  const onChange = (theme: { label: string; slug: string }) => {
    setActiveThemeSlug(theme.slug);
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

    const query = theme.slug === "all" ? {} : { "learning-theme": theme.slug };
    router.replace(
      {
        pathname: `/teachers/programmes/${linkProps.programmeSlug}/units`,
        query,
      },
      undefined,
      { shallow: true },
    );
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
