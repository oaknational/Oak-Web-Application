import React from "react";
import { useRouter } from "next/router";
import {
  OakFlex,
  OakHeading,
  OakIconProps,
  OakSearchFilterCheckBox,
  OakFieldset,
} from "@oaknational/oak-components";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { SubjectCategory } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

type SubjectCategoryFiltersProps = {
  subjectCategories: SubjectCategory[];
  categorySlug: string | undefined;
  browseRefined: TrackFns["browseRefined"];
  idSuffix: "desktop" | "mobile";
  selectedThemeSlug?: string;
  programmeSlug: string;
  activeMobileFilter?: string;
  setCategory?: (category: string | null) => void;
};

const SubjectCategoryFilters: React.FC<SubjectCategoryFiltersProps> = ({
  subjectCategories,
  categorySlug,
  browseRefined,
  idSuffix,
  selectedThemeSlug,
  programmeSlug,
  activeMobileFilter,
  setCategory,
}) => {
  const router = useRouter();
  const isMobile = idSuffix === "mobile";

  return (
    <OakFlex
      $mv="space-between-m"
      $flexDirection={"column"}
      $pb={isMobile ? undefined : "inner-padding-xl2"}
      $bb={isMobile ? undefined : "border-solid-s"}
      $borderColor={isMobile ? undefined : "border-neutral-lighter"}
      $flexGrow={1}
    >
      <OakFieldset>
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
            value={`${idSuffix}-all-categories`}
            displayValue="All"
            id={`all-categories-${idSuffix}`}
            checked={!categorySlug}
            onChange={() => {
              if (!isMobile) {
                router.replace(
                  {
                    pathname: router.pathname,
                    query: {
                      ...(selectedThemeSlug && {
                        "learning-theme": selectedThemeSlug,
                      }),
                      programmeSlug,
                      ...(router.query.year && {
                        year: router.query.year,
                      }),
                    },
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
              } else {
                setCategory?.(null);
              }
            }}
          />
          {subjectCategories.map((category) => (
            <OakSearchFilterCheckBox
              icon={category.iconName as OakIconProps["iconName"]}
              key={category.label}
              value={`${idSuffix}-${category.slug}`}
              displayValue={category.label}
              id={`${category.label}-${idSuffix}`}
              checked={
                !isMobile
                  ? categorySlug === category.slug
                  : activeMobileFilter === category.slug
              }
              onChange={() => {
                if (!isMobile) {
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
                  router.replace(
                    {
                      pathname: router.pathname,
                      query: {
                        ...(selectedThemeSlug && {
                          "learning-theme": selectedThemeSlug,
                        }),
                        programmeSlug,
                        category: category.slug,
                        ...(router.query.year && {
                          year: router.query.year,
                        }),
                      },
                    },
                    undefined,
                    { shallow: true },
                  );
                } else {
                  setCategory && category.slug && setCategory(category.slug);
                }
              }}
            />
          ))}
        </OakFlex>
      </OakFieldset>
    </OakFlex>
  );
};

export default SubjectCategoryFilters;
