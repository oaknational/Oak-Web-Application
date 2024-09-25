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
  idSuffix: "desktop" | "mobile";
  selectedThemeSlug?: string;
  programmeSlug: string;
};

const StyledFieldset = styled.fieldset`
  border: 0px;
  margin: 0;
  padding: 0;
`;

const SubjectCategoryFilters: React.FC<SubjectCategoryFiltersProps> = ({
  subjectCategories,
  categorySlug,
  browseRefined,
  idSuffix,
  selectedThemeSlug,
  programmeSlug,
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
      <StyledFieldset>
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
            }}
          />
          {subjectCategories.map((category) => (
            <OakSearchFilterCheckBox
              icon={category.iconName as OakIconProps["iconName"]}
              key={category.label}
              value={`${idSuffix}-${category.slug}`}
              displayValue={category.label}
              id={`${category.label}-${idSuffix}`}
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
              }}
            />
          ))}
        </OakFlex>
      </StyledFieldset>
    </OakFlex>
  );
};

export default SubjectCategoryFilters;