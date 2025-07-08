import {
  OakFlex,
  OakHeading,
  OakSearchFilterCheckBox,
  OakFieldset,
} from "@oaknational/oak-components";
import React, { FC } from "react";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { YearGroup } from "@/node-lib/curriculum-api-2023/queries/unitListing/helpers/getAllYearGroups";

type YearGroupFiltersProps = {
  yearGroups: YearGroup[];
  browseRefined: TrackFns["browseRefined"];
  idSuffix: "desktop" | "mobile";
  programmeSlug: string;
  setYear: (year: string | null) => void;
  yearGroupSlug: string;
};

const YearGroupFilters: FC<YearGroupFiltersProps> = ({
  yearGroups,
  browseRefined,
  idSuffix,
  programmeSlug,
  setYear,
  yearGroupSlug,
}) => {
  return (
    <OakFlex
      $mv="space-between-m2"
      $flexDirection={"column"}
      $pb={[undefined, "inner-padding-xl2"]}
      $bb={["border-solid-none", "border-solid-s"]}
      $borderColor={["transparent", "border-neutral-lighter"]}
      $flexGrow={1}
    >
      <OakFieldset>
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
            checked={!yearGroupSlug}
            onChange={() => {
              // browseRefined({
              //   platform: "owa",
              //   product: "teacher lesson resources",
              //   engagementIntent: "refine",
              //   componentType: "filter_link",
              //   eventVersion: "2.0.0",
              //   analyticsUseCase: "Teacher",
              //   filterValue: "all",
              //   filterType: "Subject filter",
              //   activeFilters: {
              //     content_types: "units",
              //     learning_themes: router.query.learningTheme,
              //     categories: router.query.category,
              //   },
              // });

              setYear?.(null);
            }}
          />
          {yearGroups
            .filter((yearGroup) => yearGroup.yearSlug !== "all-years")
            .map((yearGroup) => (
              <OakSearchFilterCheckBox
                id={`${yearGroup.yearTitle}-${idSuffix}`}
                value={`${idSuffix}-${yearGroup.yearSlug}`}
                displayValue={yearGroup.yearTitle}
                key={yearGroup.yearSlug}
                checked={yearGroup.yearSlug === yearGroupSlug}
                onChange={() => {
                  //TODO: tracking
                  // browseRefined({
                  //   platform: "owa",
                  //   product: "teacher lesson resources",
                  //   engagementIntent: "refine",
                  //   componentType: "filter_link",
                  //   eventVersion: "2.0.0",
                  //   analyticsUseCase: "Teacher",
                  //   filterValue: yearGroup.yearTitle,
                  //   filterType: "Subject filter",
                  //   activeFilters: {
                  //     content_types: "units",
                  //     learning_themes: router.query.learningTheme,
                  //     categories: router.query.category,
                  //   },
                  // });
                  setYear && setYear(yearGroup.yearSlug);
                }}
              />
            ))}
        </OakFlex>
      </OakFieldset>
    </OakFlex>
  );
};

export default YearGroupFilters;
