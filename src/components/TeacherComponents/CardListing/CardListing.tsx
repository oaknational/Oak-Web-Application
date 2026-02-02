import {
  OakFlex,
  OakIconName,
  OakSaveButton,
  OakTagFunctional,
  OakTypography,
} from "@oaknational/oak-components";

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

const CardListing = ({
  layoutVariant,
  isHighlighted,
  index,
  title,
  subcopy,
  tags,
  lessonCount,
  showSave,
}: CardListingProps) => {
  return (
    <OakFlex
      $borderRadius={"border-radius-m2"}
      $background={isHighlighted ? "bg-inverted" : "bg-primary"}
      $color={isHighlighted ? "text-inverted" : "text-primary"}
      $pa={"spacing-20"}
      $gap={"spacing-20"}
      $flexDirection={layoutVariant === "horizontal" ? "row" : "column"}
    >
      <OakTypography $font={"heading-7"}>{index}</OakTypography>
      <OakFlex $flexDirection={"column"} $gap={"spacing-12"} $width={"100%"}>
        <OakTypography $font={"heading-7"}>{title}</OakTypography>
        {subcopy && (
          <OakTypography
            $font={"body-2"}
            $color={isHighlighted ? "text-inverted" : "text-subdued"}
          >
            {subcopy}
          </OakTypography>
        )}
        <OakFlex
          $flexDirection={layoutVariant === "horizontal" ? "row" : "column"}
          $justifyContent={
            layoutVariant === "horizontal" ? "space-between" : "flex-start"
          }
          $width={"100%"}
          $gap={"spacing-20"}
        >
          {tags && (
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
          )}
          {(lessonCount || showSave) && (
            <OakFlex $alignItems={"center"} $justifyContent={"space-between"}>
              {lessonCount && (
                <OakTypography $font={"heading-light-7"} $width={"max-content"}>
                  {lessonCount + " lesson" + (lessonCount === 1 ? "" : "s")}
                </OakTypography>
              )}
              {showSave && (
                <OakSaveButton // TODO: move to OWA
                  isLoading={false} // TODO: saving
                  isSaved={false} // TODO: saving
                  onSave={() => console.log("save")} // TODO: saving
                  title="unit" // TODO: unit title
                />
              )}
            </OakFlex>
          )}
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};

export default CardListing;
