import {
  OakSecondaryLink,
  OakTypography,
  OakTagFunctional,
  OakFlex,
  OakGrid,
  parseColor,
} from "@oaknational/oak-components";
import styled from "styled-components";

import CardListing, { CardListingProps } from "./CardListing";

export const CardListingStyledLink = styled(OakSecondaryLink)`
  width: 100%;
  height: 100%;
  &:visited {
    color: ${parseColor("text-link-visited")};
  }
  &:hover {
    text-decoration: none;
    &:not([data-disabled="true"]) {
      .card-listing-header {
        text-decoration: underline;
      }
    }
  }
`;

export const CardListingTitle = ({ title }: CardListingProps) => {
  return (
    <OakTypography $font={"heading-7"} className="card-listing-header">
      {title}
    </OakTypography>
  );
};

export const CardListingIndex = ({ index }: CardListingProps) => {
  return index ? (
    <OakTypography $font={"heading-7"}>{index}</OakTypography>
  ) : null;
};

export const CardListingCardTags = ({
  tags,
  disabled,
  childCards,
}: CardListingProps) => {
  const ChildCardTag = childCards?.length ? (
    <OakTagFunctional
      key="options"
      label={`${childCards?.length} options`}
      $background={"bg-primary"}
      $ba={"border-solid-s"}
      $borderRadius={"border-radius-s"}
      $borderColor={"border-neutral"}
      $width={"max-content"}
    />
  ) : null;
  return tags ? (
    <OakFlex
      $flexWrap={"wrap"}
      $width={"100%"}
      $gap={"spacing-8"}
      $pb={"spacing-8"}
    >
      {ChildCardTag}
      {tags.map((tag) => (
        <OakTagFunctional
          key={tag.label}
          label={tag.label}
          $background={"bg-neutral"}
          isTrailingIcon
          iconName={tag.icon}
          $color={disabled ? "text-disabled" : "text-primary"}
          useSpan
        />
      ))}
    </OakFlex>
  ) : (
    ChildCardTag
  );
};

export const CardListingSubCopy = ({
  subcopy,
  isHighlighted,
}: CardListingProps) => {
  return subcopy ? (
    <OakTypography
      $font={"body-2"}
      $color={isHighlighted ? "text-inverted" : "text-subdued"}
    >
      {subcopy}
    </OakTypography>
  ) : null;
};

export const CardListingLessonCount = ({
  lessonCount,
  isHighlighted,
}: CardListingProps) => {
  return lessonCount === undefined ? null : (
    <OakTypography
      $font={"heading-light-7"}
      $width={"max-content"}
      $textWrap={"nowrap"}
      $color={isHighlighted ? "text-inverted" : "text-subdued"}
    >
      {lessonCount + " lesson" + (lessonCount === 1 ? "" : "s")}
    </OakTypography>
  );
};

export const CardListingChildCardList = ({
  childCards,
  disabled,
  layoutVariant,
}: CardListingProps) => {
  const hasChildCards = (childCards?.length ?? 0) > 0;
  if (hasChildCards) {
    return (
      <OakGrid
        $cg={"spacing-20"}
        $rg={"spacing-20"}
        $gridTemplateColumns={
          layoutVariant === "horizontal" ? "repeat(3, 1fr)" : "1fr"
        }
      >
        {childCards?.map((child) => (
          <CardListing
            {...child}
            layoutVariant="vertical"
            key={child.title}
            showBorder
            disabled={disabled}
          />
        ))}
      </OakGrid>
    );
  } else {
    return null;
  }
};
