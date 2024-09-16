import React from "react";
import { useRouter } from "next/router";
import {
  OakFlex,
  OakHeading,
  OakIconProps,
  OakSearchFilterCheckBox,
} from "@oaknational/oak-components";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

type SubjectCategoryFiltersProps = {
  subjectCategories: { label: string; slug: string; iconName: string }[];
  categorySlug: string | undefined;
  setSelectedCategory: (category: string | null) => void;
  browseRefined: TrackFns["browseRefined"];
};

const SubjectCategoryFilters: React.FC<SubjectCategoryFiltersProps> = ({
  subjectCategories,
  categorySlug,
  browseRefined,
  setSelectedCategory,
}) => {
  const router = useRouter();

  return (
    <OakFlex
      $mv="space-between-m"
      $flexDirection={"column"}
      $pb={"inner-padding-xl2"}
      $bb={"border-solid-s"}
      $borderColor={"border-neutral-lighter"}
      $flexGrow={1}
    >
      <OakHeading
        tag="h3"
        as={"legend"}
        $font="heading-7"
        $mb="space-between-m"
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
          value="all-categories"
          displayValue="All"
          id="all-categories"
          checked={!categorySlug}
          onChange={() => {
            const { category, ...restQuery } = router.query;
            router.push(
              {
                pathname: router.pathname,
                query: restQuery,
              },
              undefined,
              { shallow: true },
            );
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
                year_group: router.query.year,
              },
            });
            setSelectedCategory(null);
          }}
        />
        {subjectCategories.map((category) => (
          <OakSearchFilterCheckBox
            icon={category.iconName as OakIconProps["iconName"]}
            key={category.label}
            value={category.slug}
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
                  learning_themes: router.query.learningTheme,
                  year_group: router.query.year,
                },
              });
              router.push(
                {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    category: category.slug,
                  },
                },
                undefined,
                { shallow: true },
              );
              setSelectedCategory(category.label);
            }}
          />
        ))}
      </OakFlex>
    </OakFlex>
  );
};

export default SubjectCategoryFilters;
