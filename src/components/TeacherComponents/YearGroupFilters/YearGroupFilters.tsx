import {
  OakFlex,
  OakHeading,
  OakSearchFilterCheckBox,
} from "@oaknational/oak-components";
import React, { FC } from "react";
import { useRouter } from "next/router";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

type YearGroupFiltersProps = {
  yearGroups: { yearTitle: string; year: string }[];
  browseRefined: TrackFns["browseRefined"];
};

const YearGroupFilters: FC<YearGroupFiltersProps> = ({
  yearGroups,
  browseRefined,
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
      <OakHeading tag="h3" $font={"heading-7"} $mb={"space-between-m"}>
        Year
      </OakHeading>
      <OakFlex
        $alignItems="flex-start"
        $flexWrap={"wrap"}
        $gap={"space-between-ssx"}
        aria-describedby={"year-group"}
        $flexGrow={1}
      >
        <OakSearchFilterCheckBox
          value="all"
          displayValue="All"
          id="all"
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
            const { year, ...restQuery } = router.query;
            router.push(
              {
                pathname: router.pathname,
                query: restQuery,
              },
              undefined,
              { shallow: true },
            );
          }}
        />
        {yearGroups.map((yearGroup) => (
          <OakSearchFilterCheckBox
            id={yearGroup.yearTitle}
            value={yearGroup.yearTitle}
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
              router.push(
                {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    year: yearGroup.year,
                  },
                },
                undefined,
                { shallow: true },
              );
            }}
          />
        ))}
      </OakFlex>
    </OakFlex>
  );
};

export default YearGroupFilters;