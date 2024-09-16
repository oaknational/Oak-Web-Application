import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import {
  OakBox,
  OakBoxProps,
  OakFlex,
  OakLabel,
  OakLabelProps,
} from "@oaknational/oak-components";
import {
  SpecialistUnitListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";
import { LearningThemeSelectedTrackingProps } from "@/components/SharedComponents/CategoryFilterList";
import useAnalytics from "@/context/Analytics/useAnalytics";


export type LearningTheme = {
  themeSlug: string;
  themeTitle: string;
};

export type UnitsLearningThemeFiltersProps = {
  labelledBy: string;
  selectedThemeSlug: string;
  learningThemes: LearningTheme[] | null;
  linkProps: UnitListingLinkProps | SpecialistUnitListingLinkProps;
  trackingProps?: LearningThemeSelectedTrackingProps;
};

const RadioButtonLabel = styled(OakLabel)<OakLabelProps>`
  cursor: pointer;
  display: flex;
  gap: 8px; // TODO: replace with spacing token
`;

const HiddenRadioButtonInput = styled.input.attrs({
  type: "radio",
})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const RadioButtonFocus = styled(OakBox)<OakBoxProps>`
  box-shadow: ${`inset 0 0 0 0.13rem #ffe555`}; // TODO: replace with colour token
`;

const UnitsLearningThemeFilters = ({
  learningThemes = [],
  selectedThemeSlug,
  linkProps,
  trackingProps,
}: UnitsLearningThemeFiltersProps) => {
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

  const router = useRouter();
  const { track } = useAnalytics();

  // Manual setting the active theme slug on select to avoid a delay in visual state updating while the page reloads
  const [activeThemeSlug, setActiveThemeSlug] = useState(selectedThemeSlug);

  const [focussedThemeSlug, setFocussedThemeSlug] = useState<
    string | undefined
  >(undefined);

  const onChange = (themeSlug: string) => {
    setActiveThemeSlug(themeSlug);
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
        filterValue: themeSlug,
        activeFilters: { keyStage: [keyStageSlug], subject: [subjectSlug] },
      });
    }

    const query = themeSlug === "all" ? {} : { "learning-theme": themeSlug };
    router.push({
      pathname: `/teachers/programmes/${linkProps.programmeSlug}/units`,
      query,
    });
  };

  return (
    <OakFlex $flexDirection="column" $gap="space-between-ssx">
      {[
        { slug: "all", label: "All in suggested order" },
        ...learningThemesMapped,
      ].map((theme) => {
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
            <RadioButtonLabel htmlFor={theme.slug}>
              <HiddenRadioButtonInput
                value={theme.slug}
                id={theme.slug}
                checked={isChecked}
                onChange={() => onChange(theme.slug)}
                tabIndex={0}
                onFocus={() => setFocussedThemeSlug(theme.slug)}
                onBlur={() => setFocussedThemeSlug(undefined)}
              />
              <OakFlex
                $height={"all-spacing-6"}
                $width="all-spacing-6"
                $borderColor={"black"}
                $flexGrow={0}
                $flexShrink={0}
                $alignItems={"center"}
                $justifyContent={"center"}
                $background="bg-primary"
                $ba="border-solid-m"
                $borderRadius="border-radius-circle"
              >
                {isChecked && (
                  <OakBox
                    $height={"all-spacing-4"}
                    $width="all-spacing-4"
                    $background="black"
                    $position="absolute"
                    $borderRadius="border-radius-circle"
                  />
                )}
                {isFocussed && (
                  <RadioButtonFocus
                    $height={"all-spacing-7"}
                    $width="all-spacing-7"
                    $background="transparent"
                    $position="absolute"
                    $ba="border-solid-m"
                    $borderColor="grey60"
                    $borderRadius="border-radius-circle"
                  />
                )}
              </OakFlex>
              {theme.label}
            </RadioButtonLabel>
          </OakBox>
        );
      })}
    </OakFlex>
  );
};

export default UnitsLearningThemeFilters;
