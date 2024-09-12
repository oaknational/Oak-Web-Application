import React from "react";
import { useRouter } from "next/router";
import {
  OakFlex,
  OakHeading,
  OakIconProps,
  OakSearchFilterCheckBox,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

type SubjectCategoryFiltersProps = {
  subjectCategories: { label: string; slug: string; iconName: string }[];
  categorySlug: string | undefined;
  browseRefined: TrackFns["browseRefined"];
};

const SubjectCategoryFilters: React.FC<SubjectCategoryFiltersProps> = ({
  subjectCategories,
  categorySlug,
  browseRefined,
}) => {
  const router = useRouter();

  const StyledFieldset = styled.fieldset`
    border: 0px;
    margin: 0;
    padding: 0;
  `;

  return (
    subjectCategories &&
    subjectCategories.length > 1 && (
      <OakFlex
        $mb="space-between-m"
        $flexDirection={"column"}
        $pb={"inner-padding-xl2"}
        $bb={"border-solid-s"}
        $borderColor={"border-neutral-lighter"}
        $flexGrow={1}
      >
        <StyledFieldset>
          <OakHeading
            tag="h3"
            as={"legend"}
            $font="heading-7"
            $mb="space-between-s"
          >
            Category
          </OakHeading>
          <OakFlex
            $flexDirection={"row"}
            $flexWrap={"wrap"}
            $gap={"space-between-ssx"}
            $flexGrow={1}
          >
            <OakSearchFilterCheckBox
              value="all"
              displayValue="All"
              id="all"
              checked={!categorySlug}
              onChange={() => {
                const { category, ...restQuery } = router.query;
                router.push({
                  pathname: router.pathname,
                  query: restQuery,
                });
                // double check browse refined
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
                  },
                });
              }}
            />
            {subjectCategories.map((category) =>
              category ? (
                <OakSearchFilterCheckBox
                  // get the icon types
                  icon={`subject-${category.slug}` as OakIconProps["iconName"]}
                  key={category.label}
                  value={category.label}
                  displayValue={category.label}
                  id={category.label}
                  checked={categorySlug === category.slug}
                  onChange={() => {
                    browseRefined({
                      platform: "owa",
                      product: "teacher lesson resources",
                      engagementIntent: "refine",
                      componentType: "filter_link",
                      eventVersion: "2.0.0",
                      analyticsUseCase: "Teacher",
                      filterValue: category.label,
                      filterType: "Subject filter",
                      activeFilters: {
                        content_types: "units",
                      },
                    });
                    router.push({
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        category: category.slug,
                      },
                    });
                  }}
                />
              ) : null,
            )}
          </OakFlex>
        </StyledFieldset>
      </OakFlex>
    )
  );
};

export default SubjectCategoryFilters;
