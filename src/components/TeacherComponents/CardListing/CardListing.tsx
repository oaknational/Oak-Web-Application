import {
  OakFlex,
  OakIconName,
  OakSecondaryLink,
  OakTagFunctional,
  OakTypography,
  parseColor,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { SaveUnitButton } from "../SaveUnitButton/SaveUnitButton";

import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";

type CardListingProps = {
  layoutVariant: "horizontal" | "vertical";
  isHighlighted: boolean;
  index: number;
  title: string;
  subcopy?: string;
  tags?: Array<{ label: string; icon?: OakIconName }>;
  lessonCount?: number;
  href: string;
  saveProps?: {
    unitSlug: string;
    unitTitle: string;
    programmeSlug: string;
    trackingProps: TrackingProgrammeData;
  };
  disabled?: boolean;
};

export const getDefaultTextColour = ({
  disabled,
  isHighlighted,
}: {
  disabled?: boolean;
  isHighlighted?: boolean;
}) => {
  if (disabled) {
    return "text-disabled";
  } else if (isHighlighted) {
    return "text-inverted";
  }

  // use the default colour value for the component
  return undefined;
};

const CardListing = (props: CardListingProps) => {
  const {
    layoutVariant,
    isHighlighted,
    lessonCount,
    saveProps,
    href,
    disabled,
  } = props;

  const showSave = saveProps !== undefined;
  const showFooter = lessonCount !== undefined || showSave;
  const defaultTextColour = getDefaultTextColour({ disabled, isHighlighted });

  // If the card is disabled use a div for the container, otherwise use a link element
  const cardLinkProps = disabled
    ? { "data-disabled": true, as: "div" as const }
    : { href };

  return (
    <OakFlex
      $borderRadius={"border-radius-m2"}
      $background={isHighlighted ? "bg-inverted" : "bg-primary"}
      $pa={"spacing-20"}
      $gap={"spacing-20"}
      $flexDirection={layoutVariant === "horizontal" ? "row" : "column"}
      $width={"100%"}
      data-testid="card-listing-container"
    >
      {layoutVariant === "horizontal" ? (
        <OakFlex $flexDirection={"row"} $gap={"spacing-20"} $width={"100%"}>
          <StyledLink {...cardLinkProps}>
            <OakFlex
              $flexDirection={"row"}
              $gap={"spacing-20"}
              $width={"100%"}
              $color={defaultTextColour}
            >
              <Index {...props} />
              <OakFlex
                $flexDirection={"column"}
                $gap={"spacing-20"}
                $width={"100%"}
              >
                <Title {...props} />
                <SubCopy {...props} />
                <CardTags {...props} />
              </OakFlex>
            </OakFlex>
          </StyledLink>
          {showFooter && (
            <OakFlex
              $alignItems={"center"}
              $alignSelf={"flex-end"}
              $font={"heading-light-7"}
              $gap={"spacing-20"}
            >
              <LessonCount {...props} />
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
          <StyledLink {...cardLinkProps}>
            <OakFlex
              $gap={"spacing-20"}
              $flexDirection={"column"}
              $color={defaultTextColour}
            >
              <Index {...props} />
              <Title {...props} />
              <SubCopy {...props} />
              <CardTags {...props} />
            </OakFlex>
          </StyledLink>
          {showFooter && (
            <OakFlex $justifyContent={"space-between"} $alignItems={"center"}>
              <LessonCount {...props} />
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
    </OakFlex>
  );
};

export default CardListing;

const StyledLink = styled(OakSecondaryLink)`
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

const Title = ({ title }: CardListingProps) => {
  return (
    <OakTypography $font={"heading-7"} className="card-listing-header">
      {title}
    </OakTypography>
  );
};

const Index = ({ index }: CardListingProps) => {
  return <OakTypography $font={"heading-7"}>{index}</OakTypography>;
};

const CardTags = ({ tags, disabled }: CardListingProps) => {
  return tags ? (
    <OakFlex
      $flexWrap={"wrap"}
      $width={"100%"}
      $gap={"spacing-8"}
      $pb={"spacing-8"}
    >
      {tags.map((tag) => (
        <OakTagFunctional
          key={tag.label}
          label={tag.label}
          $background={"bg-neutral"}
          isTrailingIcon
          iconName={tag.icon}
          $color={disabled ? "text-disabled" : "text-primary"}
        />
      ))}
    </OakFlex>
  ) : null;
};

const SubCopy = ({ subcopy, isHighlighted }: CardListingProps) => {
  return subcopy ? (
    <OakTypography
      $font={"body-2"}
      $color={isHighlighted ? "text-inverted" : "text-subdued"}
    >
      {subcopy}
    </OakTypography>
  ) : null;
};

const LessonCount = ({ lessonCount, isHighlighted }: CardListingProps) => {
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
