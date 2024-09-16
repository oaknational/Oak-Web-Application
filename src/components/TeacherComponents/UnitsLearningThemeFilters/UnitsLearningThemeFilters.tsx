import {
  OakBox,
  OakFlex,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { useState } from "react";
import { useRouter } from "next/router";

import { RadioTheme, ThemeRadioButton, isRadioTheme } from "./ThemeRadioButton";

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
};

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  linkProps,
  trackingProps,
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
        .map((theme) => theme as RadioTheme) // why is this necessary?
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
    router.push({
      pathname: `/teachers/programmes/${linkProps.programmeSlug}/units`,
      query,
    });
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
      <OakFlex $flexDirection="column" $gap="space-between-ssx">
        {[
          { slug: "all", label: "All in suggested order" },
          ...learningThemesMapped,
        ].map((theme, i) => {
          const isChecked = activeThemeSlug === theme.slug;
          const isFocussed = focussedThemeSlug === theme.slug;
          return (
            <OakBox
              $borderColor="border-neutral-lighter"
              $borderStyle="solid"
              $borderRadius="border-radius-s"
              $pa="inner-padding-s"
              key={theme.slug}
            >
              <ThemeRadioButton
                theme={theme}
                isChecked={isChecked}
                isFocussed={isFocussed}
                onChange={onChange}
                onFocus={setFocussedThemeSlug}
                id={`${theme.slug}-${i}`}
              />
            </OakBox>
          );
        })}
      </OakFlex>
    </OakFlex>
  );
};

export default UnitsLearningThemeFilters;
