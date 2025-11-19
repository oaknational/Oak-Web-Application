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

type KsLinkProps = {
  keystageSlug: string;
  keystageTitle: string;
  pathwayTitle?: string;
};
export type SearchSuggestionBannerProps = {
  metadata?: string;
  title: string;
  subjectSlug: string;
  body?: string;
  links: Array<KsLinkProps>;
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

  // Hacky approach to handle citizenship pathways which don't have any examboards/tiers
  // so linking to the programme page doesn't automatically redirect as it doesn't know whether
  // to direct to core or gcse.
  const getLinkHref = (link: KsLinkProps) => {
    return link.pathwayTitle
      ? resolveOakHref({
          page: "unit-index",
          programmeSlug:
            link.pathwayTitle == "Core"
              ? "citizenship-secondary-ks4-core"
              : "citizenship-secondary-ks4-gcse",
        })
      : resolveOakHref({
          page: "programme-index",
          subjectSlug,
          keyStageSlug: link.keystageSlug,
        });
  };

  const getLinkTitle = (link: KsLinkProps) => {
    let title = link.keystageTitle;
    if (link.pathwayTitle) {
      title += ` (${link.pathwayTitle})`;
    }
    return title;
  };

  return (
    <OakFlex
      $pa="spacing-32"
      $ba="border-solid-s"
      $borderRadius="border-radius-s"
      $borderColor="border-neutral-lighter"
      $flexDirection="column"
      $gap="spacing-12"
      $mt={"spacing-32"}
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
        $gap="spacing-24"
        $flexWrap="wrap"
        $flexDirection={["column", "row", "row"]}
      >
        {links.map((link) => (
          <StyledOakLink
            iconName="chevron-right"
            isTrailingIcon
            key={link.keystageSlug}
            href={getLinkHref(link)}
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
            {getLinkTitle(link)}
          </StyledOakLink>
        ))}
      </OakFlex>
    </OakFlex>
  );
};
