import {
  OakFlex,
  OakHeading,
  OakSearchFilterCheckBox,
} from "@oaknational/oak-components";
import React, { FC } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

type YearGroupFiltersProps = {
  yearGroups: { yearTitle: string; year: string }[];
  browseRefined: TrackFns["browseRefined"];
  idSuffix: "desktop" | "mobile";
  selectedThemeSlug?: string;
  programmeSlug: string;
};

const StyledFieldset = styled.fieldset`
  border: 0px;
  margin: 0;
  padding: 0;
`;

const YearGroupFilters: FC<YearGroupFiltersProps> = ({
  yearGroups,
  browseRefined,
  idSuffix,
  selectedThemeSlug,
  programmeSlug,
}) => {
  const router = useRouter();

  return (
    <OakFlex
      $mv="space-between-m2"
      $flexDirection={"column"}
      $pb={"inner-padding-xl2"}
      $bb={"border-solid-s"}
      $borderColor={"border-neutral-lighter"}
      $flexGrow={1}
    >
      <StyledFieldset>
        <OakHeading
          as={"legend"}
          tag="h3"
          $font={"heading-7"}
          $mb={"space-between-m"}
        >
          Year
        </OakHeading>
        <OakFlex
          $alignItems="flex-start"
          $flexWrap={"wrap"}
          $gap={"space-between-ssx"}
          $flexGrow={1}
        >
          <OakSearchFilterCheckBox
            value={`${idSuffix}-all-year-groups`}
            displayValue="All"
            id={`all-year-groups-${idSuffix}`}
            checked={!router.query.year}
            onChange={() => {
              browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "filter_link",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterValue: "all",
                filterType: "Subject filter",
                activeFilters: {
                  content_types: "units",
                  learning_themes: router.query.learningTheme,
                  categories: router.query.category,
                },
              });

              router.replace(
                {
                  pathname: router.pathname,
                  query: {
                    ...(selectedThemeSlug && {
                      "learning-theme": selectedThemeSlug,
                    }),
                    programmeSlug,
                    ...(router.query.category && {
                      category: router.query.category,
                    }),
                  },
                },
                undefined,
                { shallow: true },
              );
            }}
          />
          {yearGroups.map((yearGroup) => (
            <OakSearchFilterCheckBox
              id={`${yearGroup.yearTitle}-${idSuffix}`}
              value={`${idSuffix}-${yearGroup.year}`}
              displayValue={yearGroup.yearTitle}
              key={yearGroup.year}
              checked={yearGroup.year === router.query.year}
              onChange={() => {
                browseRefined({
                  platform: "owa",
                  product: "teacher lesson resources",
                  engagementIntent: "refine",
                  componentType: "filter_link",
                  eventVersion: "2.0.0",
                  analyticsUseCase: "Teacher",
                  filterValue: yearGroup.yearTitle,
                  filterType: "Subject filter",
                  activeFilters: {
                    content_types: "units",
                    learning_themes: router.query.learningTheme,
                    categories: router.query.category,
                  },
                });

                router.replace(
                  {
                    pathname: router.pathname,
                    query: {
                      ...(selectedThemeSlug && {
                        "learning-theme": selectedThemeSlug,
                      }),
                      programmeSlug,
                      year: yearGroup.year,
                      ...(router.query.category && {
                        category: router.query.category,
                      }),
                    },
                  },
                  undefined,
                  { shallow: true },
                );
              }}
            />
          ))}
        </OakFlex>
      </StyledFieldset>
    </OakFlex>
  );
};

export default YearGroupFilters;