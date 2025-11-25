import {
  OakFlex,
  OakHeading,
  OakHeadingProps,
  OakP,
  OakSecondaryButton,
} from "@oaknational/oak-components";

type GetInvolvedLinkCardProps = {
  headingTag: OakHeadingProps["tag"];
  headingTitle: string;
  buttonLink: string;
  buttonText: string;
  content: string;
};
export function GetInvolvedLinkCard({
  headingTag,
  headingTitle,
  buttonLink,
  buttonText,
  content,
}: Readonly<GetInvolvedLinkCardProps>) {
  return (
    <OakFlex
      $pa={"spacing-24"}
      $gap={["spacing-32", "spacing-32", "spacing-32"]}
      $flexDirection={"column"}
    >
      <OakFlex
        $gap={["spacing-16", "spacing-24", "spacing-24"]}
        $flexDirection={"column"}
      >
        <OakHeading
          tag={headingTag}
          $font={["heading-6", "heading-4", "heading-4"]}
        >
          {headingTitle}
        </OakHeading>
        <OakP $font={["body-2", "body-1", "body-1"]}>{content}</OakP>
      </OakFlex>
      <OakFlex>
        <OakSecondaryButton
          element="a"
          href={buttonLink}
          iconName="external"
          isTrailingIcon={true}
        >
          {buttonText}
        </OakSecondaryButton>
      </OakFlex>
    </OakFlex>
  );
}
