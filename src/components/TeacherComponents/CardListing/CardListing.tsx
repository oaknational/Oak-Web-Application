import {
  OakFlex,
  OakIconName,
  OakSecondaryLink,
  OakSmallPrimaryButton,
  OakSmallTertiaryInvertedButton,
  OakTagFunctional,
  OakTypography,
} from "@oaknational/oak-components";
import styled from "styled-components";

type CardListingProps = {
  layoutVariant: "horizontal" | "vertical";
  isHighlighted: boolean;
  index: number;
  title: string;
  subcopy?: string;
  tags?: Array<{ label: string; icon?: OakIconName }>;
  lessonCount?: number;
  showSave?: boolean;
};

const CardListing = (props: CardListingProps) => {
  const { layoutVariant, isHighlighted, lessonCount, showSave } = props;
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
          <StyledLink href="">
            <OakFlex $flexDirection={"row"} $gap={"spacing-20"} $width={"100%"}>
              <Index {...props} />
              <OakFlex
                $flexDirection={"column"}
                $gap={"spacing-20"}
                $width={"100%"}
              >
                <Title {...props} />
                <SubCopy {...props} />
                <OakFlex
                  $justifyContent={"space-between"}
                  $alignItems={"flex-end"}
                >
                  <CardTags {...props} />
                  <LessonCount {...props} />
                </OakFlex>
              </OakFlex>
            </OakFlex>
          </StyledLink>
          <SaveButton {...props} />
        </OakFlex>
      ) : (
        // Vertical Layout
        <OakFlex $flexDirection={"column"} $gap={"spacing-20"}>
          <StyledLink href="">
            <OakFlex $gap={"spacing-20"} $flexDirection={"column"}>
              <Index {...props} />
              <Title {...props} />
              <SubCopy {...props} />
              <CardTags {...props} />
            </OakFlex>
          </StyledLink>
          {(lessonCount !== undefined || showSave) && (
            <OakFlex $justifyContent={"space-between"} $alignItems={"center"}>
              <LessonCount {...props} /> <SaveButton {...props} />
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

const SaveButton = ({ showSave, isHighlighted }: CardListingProps) => {
  // TODO: saving
  const isSaved = false;
  const onSave = () => console.log("save");
  const unavailable = false;
  const title = "unit 1";
  const isLoading = false;

  const StyledSmallPrimaryButton = styled(OakSmallPrimaryButton)`
    span {
      font-weight: unset;
      font-size: unset;
    }
    button {
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
    }
  `;

  const buttonProps = {
    iconName: isSaved
      ? "bookmark-filled"
      : ("bookmark-outlined" as OakIconName),
    isTrailingIcon: true,
    "aria-disabled": isLoading,
    disabled: unavailable,
    onClick: onSave,
    $justifyContent: "end",
    "aria-label": `${isSaved ? "Unsave" : "Save"} this unit: ${title} `,
  };

  return showSave ? (
    <OakFlex
      $alignSelf={"flex-end"}
      $flexDirection={"column"}
      $height={"spacing-32"}
      $justifyContent={"center"}
      $font={"heading-light-7"}
    >
      {isHighlighted ? (
        <StyledSmallPrimaryButton {...buttonProps}>
          {isSaved ? "Saved" : "Save"}
        </StyledSmallPrimaryButton>
      ) : (
        <OakSmallTertiaryInvertedButton {...buttonProps}>
          {isSaved ? "Saved" : "Save"}
        </OakSmallTertiaryInvertedButton>
      )}
    </OakFlex>
  ) : null;
};

const CardTags = ({ tags }: CardListingProps) => {
  return tags ? (
    <OakFlex $flexWrap={"wrap"} $width={"100%"} $gap={"spacing-8"}>
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
  return lessonCount !== undefined ? (
    <OakTypography
      $font={"heading-light-7"}
      $width={"max-content"}
      $textWrap={"nowrap"}
      $color={isHighlighted ? "text-inverted" : "text-subdued"}
    >
      {lessonCount + " lesson" + (lessonCount === 1 ? "" : "s")}
    </OakTypography>
  ) : null;
};
