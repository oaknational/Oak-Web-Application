import {
  OakFlex,
  OakHeading,
  OakLink,
  OakP,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { resolveOakHref } from "@/common-lib/urls";

export type SearchSuggestionBannerProps = {
  metadata?: string;
  title: string;
  body: string;
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

export const SearchSuggestionBanner = (props: SearchSuggestionBannerProps) => {
  const { metadata, title, body, links } = props;
  return (
    <OakFlex
      $pa="inner-padding-xl2"
      $ba="border-solid-s"
      $borderRadius="border-radius-s"
      $borderColor="border-neutral-lighter"
      $flexDirection="column"
      $gap="space-between-xs"
      $display={["none", "flex"]}
    >
      {metadata && (
        <OakP $font="heading-light-7" $color="text-subdued">
          {metadata}
        </OakP>
      )}
      <OakHeading $font="heading-5" tag="h3">
        {title}
      </OakHeading>
      <OakP $font="body-2">{body}</OakP>
      {links.map((link) => (
        <StyledOakLink
          iconName="chevron-right"
          isTrailingIcon
          key={link.keystageSlug}
          href={resolveOakHref({
            page: "subject-index",
            keyStageSlug: link.keystageSlug,
          })}
        >
          {link.keystageTitle}
        </StyledOakLink>
      ))}
    </OakFlex>
  );
};
