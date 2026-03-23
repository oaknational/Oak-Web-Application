import { OakFlex, OakIconName } from "@oaknational/oak-components";

import { SaveUnitButton } from "../SaveUnitButton/SaveUnitButton";

import {
  getCardListingDefaultTextColour,
  getCardListingLinkProps,
} from "./helpers";
import {
  CardListingStyledLink,
  CardListingTitle,
  CardListingSubCopy,
  CardListingCardTags,
  CardListingLessonCount,
  CardListingChildCardList,
  CardListingIndex,
  CardListingStyledFlex,
} from "./Components";

import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";

export type CardProps = {
  isHighlighted: boolean;
  title: string;
  lessonCount?: number;
  href: string;
  saveProps?: {
    unitSlug: string;
    unitTitle: string;
    programmeSlug: string;
    trackingProps: TrackingProgrammeData;
  };
  disabled?: boolean;
  onClickLink?: () => void;
  showBorder?: boolean;
};

export type CardListingTags = Array<{ label: string; icon?: OakIconName }>;
export type CardListingProps = CardProps & {
  layoutVariant: "horizontal" | "vertical";
  index?: number;
  subcopy?: string;
  tags?: CardListingTags;
  childCards?: Array<CardProps>;
};

const CardListing = (props: CardListingProps) => {
  const {
    layoutVariant,
    isHighlighted,
    lessonCount,
    saveProps,
    href,
    disabled,
    onClickLink,
    childCards,
    showBorder,
  } = props;

  const hasChildCards = (childCards?.length ?? 0) > 0;
  const showSave = saveProps !== undefined;
  const showFooter = (lessonCount !== undefined || showSave) && !hasChildCards;
  const defaultTextColour = getCardListingDefaultTextColour({
    disabled,
    isHighlighted,
    hasChildCards,
  });

  const cardLinkProps = getCardListingLinkProps({
    disabled,
    hasChildCards,
    href,
    onClickLink,
  });

  return (
    <CardListingStyledFlex
      $borderRadius={"border-radius-m2"}
      $background={
        isHighlighted && !hasChildCards ? "bg-inverted" : "bg-primary"
      }
      $pa={"spacing-20"}
      $gap={"spacing-20"}
      $flexDirection={layoutVariant === "horizontal" ? "row" : "column"}
      $flexGrow={1}
      data-testid="card-listing-container"
      $borderColor={"border-neutral-lighter"}
      $ba={showBorder ? "border-solid-s" : undefined}
      className="card-listing-container"
    >
      {layoutVariant === "horizontal" ? (
        <OakFlex $flexDirection={"row"} $gap={"spacing-20"} $width={"100%"}>
          <CardListingStyledLink {...cardLinkProps} className="styled-link">
            <OakFlex
              $flexDirection={"row"}
              $gap={"spacing-20"}
              $width={"100%"}
              $color={defaultTextColour}
            >
              <CardListingIndex {...props} />
              <OakFlex
                $flexDirection={"column"}
                $gap={"spacing-20"}
                $width={"100%"}
              >
                <CardListingTitle {...props} />
                <CardListingSubCopy {...props} />
                <CardListingCardTags {...props} />
                <CardListingChildCardList {...props} />
              </OakFlex>
            </OakFlex>
          </CardListingStyledLink>
          {showFooter && (
            <OakFlex
              $alignItems={"center"}
              $alignSelf={"flex-end"}
              $font={"heading-light-7"}
              $gap={"spacing-20"}
            >
              <CardListingLessonCount {...props} />
              {showSave && (
                <SaveUnitButton
                  buttonVariant={isHighlighted ? "inverted" : "default"}
                  disabled={disabled}
                  {...saveProps}
                />
              )}
            </OakFlex>
          )}
        </OakFlex>
      ) : (
        // Vertical Layout
        <OakFlex
          $flexDirection={"column"}
          $gap={"spacing-20"}
          $height={"100%"}
          $justifyContent={"space-between"}
        >
          <CardListingStyledLink {...cardLinkProps}>
            <OakFlex
              $flexDirection={"column"}
              $justifyContent={"space-between"}
              $height="100%"
              $gap={"spacing-20"}
            >
              <OakFlex
                $gap={"spacing-20"}
                $flexDirection={"column"}
                $color={defaultTextColour}
              >
                <CardListingIndex {...props} />
                <CardListingTitle {...props} />
                <CardListingSubCopy {...props} />
              </OakFlex>
              <CardListingCardTags {...props} />
              <CardListingChildCardList {...props} />
            </OakFlex>
          </CardListingStyledLink>
          {showFooter && (
            <OakFlex $justifyContent={"space-between"} $alignItems={"center"}>
              <CardListingLessonCount {...props} />
              {showSave && (
                <SaveUnitButton
                  buttonVariant={isHighlighted ? "inverted" : "default"}
                  disabled={disabled}
                  {...saveProps}
                />
              )}
            </OakFlex>
          )}
        </OakFlex>
      )}
    </CardListingStyledFlex>
  );
};

export default CardListing;
