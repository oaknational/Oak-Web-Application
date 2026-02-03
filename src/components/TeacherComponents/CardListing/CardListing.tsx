import {
  OakFlex,
  OakIconName,
  OakSecondaryLink,
  OakTagFunctional,
  OakTypography,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { SaveUnitButton } from "../SaveUnitButton/SaveUnitButton";

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
  };
};

const CardListing = (props: CardListingProps) => {
  const { layoutVariant, isHighlighted, lessonCount, saveProps, href } = props;

  const showSave = saveProps !== undefined;
  const showFooter = lessonCount !== undefined || showSave;

  return (
    <OakFlex
      $borderRadius={"border-radius-m2"}
      $background={isHighlighted ? "bg-inverted" : "bg-primary"}
      $color={isHighlighted ? "text-inverted" : "text-primary"}
      $pa={"spacing-20"}
      $gap={"spacing-20"}
      $flexDirection={layoutVariant === "horizontal" ? "row" : "column"}
      $width={"100%"}
    >
      {layoutVariant === "horizontal" ? (
        <OakFlex $flexDirection={"row"} $gap={"spacing-20"} $width={"100%"}>
          <StyledLink href={href}>
            <OakFlex $flexDirection={"row"} $gap={"spacing-20"} $width={"100%"}>
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
              <LessonCount {...props} />{" "}
              {showSave && (
                <SaveUnitButton
                  buttonVariant={isHighlighted ? "inverted" : "default"}
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
          <StyledLink href={href}>
            <OakFlex $gap={"spacing-20"} $flexDirection={"column"}>
              <Index {...props} />
              <Title {...props} />
              <SubCopy {...props} />
              <CardTags {...props} />
            </OakFlex>
          </StyledLink>
          {showFooter && (
            <OakFlex $justifyContent={"space-between"} $alignItems={"center"}>
              <LessonCount {...props} />{" "}
              {showSave && (
                <SaveUnitButton
                  buttonVariant={isHighlighted ? "inverted" : "default"}
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

const Title = ({ title, isHighlighted }: CardListingProps) => {
  return (
    <OakTypography
      $color={isHighlighted ? "text-inverted" : "text-primary"}
      $font={"heading-7"}
      className="card-listing-header"
    >
      {title}
    </OakTypography>
  );
};

const StyledLink = styled(OakSecondaryLink)`
  width: 100%;
  height: 100%;
  &:hover {
    text-decoration: none;
    .card-listing-header {
      text-decoration: underline;
    }
  }
`;

const Index = ({ index, isHighlighted }: CardListingProps) => {
  return (
    <OakTypography
      $color={isHighlighted ? "text-inverted" : "text-primary"}
      $font={"heading-7"}
    >
      {index}
    </OakTypography>
  );
};

const CardTags = ({ tags }: CardListingProps) => {
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
          $color={"text-primary"}
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
