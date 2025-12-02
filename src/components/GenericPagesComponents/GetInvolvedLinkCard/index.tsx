import {
  OakFlex,
  OakHeading,
  OakHeadingProps,
  OakP,
  OakSecondaryButton,
  OakIcon,
} from "@oaknational/oak-components";

type GetInvolvedLinkCardProps = {
  headingTag: OakHeadingProps["tag"];
  headingTitle: string;
  buttons: Array<{
    text: string;
    link: string;
    external?: boolean;
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
    <OakFlex $pa={"spacing-24"} $gap={"spacing-32"} $flexDirection={"column"}>
      <OakFlex
        $gap={["spacing-16", "spacing-24", "spacing-24"]}
        $flexDirection={"column"}
      >
        <OakHeading
          tag={headingTag}
          $font={["heading-6", "heading-4", "heading-4"]}
          $color="text-primary"
        >
          {headingTitle}
        </OakHeading>
        <OakP $font={["body-2", "body-1", "body-1"]} $color="text-primary">
          {content}
        </OakP>
      </OakFlex>
      {buttons && buttons.length > 0 && (
        <OakFlex $flexWrap="wrap" $gap="spacing-12">
          {buttons.map((button) => (
            <OakSecondaryButton
              key={button.text}
              element="a"
              href={button.link}
              target={button.external ? "_blank" : undefined}
              rel={button.external ? "noopener noreferrer" : undefined}
              iconOverride={
                button.external ? (
                  <OakIcon
                    iconName="external"
                    alt="external"
                    $width="spacing-24"
                    $height="spacing-24"
                  />
                ) : undefined
              }
              isTrailingIcon={button.external}
            >
              {button.text}
            </OakSecondaryButton>
          ))}
        </OakFlex>
      )}
    </OakFlex>
  );
}
