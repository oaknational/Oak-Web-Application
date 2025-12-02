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
  buttons: Array<{
    text: string;
    link: string;
  }>;
  content: string;
};

export function GetInvolvedLinkCard({
  headingTag,
  headingTitle,
  buttons,
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
      {buttons && buttons.length > 0 && (
        <OakFlex $flexWrap="wrap" $gap="spacing-12">
          {buttons.map((button, index) => (
            <OakSecondaryButton
              key={`button-${index}`}
              element="a"
              href={button.link}
              iconName="external"
              isTrailingIcon={true}
            >
              {button.text}
            </OakSecondaryButton>
          ))}
        </OakFlex>
      )}
    </OakFlex>
  );
}
