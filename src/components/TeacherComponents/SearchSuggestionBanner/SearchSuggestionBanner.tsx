import {
  OakFlex,
  OakHeading,
  OakLink,
  OakP,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { getSearchSuggestionBannerProps } from "./getSearchSuggestionBannerProps";

import { resolveOakHref } from "@/common-lib/urls";
import { SearchIntent } from "@/common-lib/schemas/search-intent";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

export type SearchSuggestionBannerProps = {
  metadata?: string;
  title: string;
  subjectSlug: string;
  body?: string;
  links: Array<{
    keystageSlug: string;
    keystageTitle: string;
    examboardSlug?: string;
  }>;
};

const StyledOakLink = styled(OakLink)`
  text-decoration: none;
  font-weight: 600;
`;

export const SearchSuggestionBanner = (props: {
  intent: SearchIntent | null | undefined;
  searchTrackingData: {
    searchFilterOptionSelected: string[];
    searchResultCount: number;
  };
}) => {
  const { track } = useAnalytics();
  const convertedProps =
    props.intent && getSearchSuggestionBannerProps(props.intent);

  if (!convertedProps) {
    return null;
  }

  const { metadata, title, body, links, subjectSlug } = convertedProps;

  return (
    <OakFlex
      $pa="inner-padding-xl2"
      $ba="border-solid-s"
      $borderRadius="border-radius-s"
      $borderColor="border-neutral-lighter"
      $flexDirection="column"
      $gap="space-between-xs"
      $mt={["space-between-none", "space-between-none", "space-between-m2"]}
    >
      {metadata && (
        <OakP $font="heading-light-7" $color="text-subdued">
          {metadata}
        </OakP>
      )}
      <OakHeading $font="heading-5" tag="h3">
        {title}
      </OakHeading>
      {body && <OakP $font="body-2">{body}</OakP>}
      <OakFlex
        $gap="space-between-m"
        $flexWrap="wrap"
        $flexDirection={["column", "row", "row"]}
      >
        {links.map((link) => (
          <StyledOakLink
            iconName="chevron-right"
            isTrailingIcon
            key={link.keystageSlug}
            href={resolveOakHref({
              page: "programme-index",
              subjectSlug,
              keyStageSlug: link.keystageSlug,
            })}
            onClick={() =>
              track.searchResultOpened({
                keyStageTitle: link.keystageTitle as KeyStageTitleValueType,
                keyStageSlug: link.keystageSlug,
                subjectTitle: title,
                subjectSlug,
                unitName: null,
                unitSlug: null,
                lessonName: null,
                lessonSlug: null,
                lessonReleaseCohort: "2023-2026",
                lessonReleaseDate: "",
                analyticsUseCase: "Teacher",
                searchResultType: "suggestion",
                context: "search",
                searchRank: 1,
                ...props.searchTrackingData,
              })
            }
          >
            {link.keystageTitle}
          </StyledOakLink>
        ))}
      </OakFlex>
    </OakFlex>
  );
};
