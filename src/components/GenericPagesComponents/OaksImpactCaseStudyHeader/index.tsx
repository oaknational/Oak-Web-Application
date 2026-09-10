import {
  OakFlex,
  OakTagFunctional,
  OakHeading,
  OakLink,
} from "@oaknational/oak-components";

type OaksImpactCaseStudyHeaderProps = {
  title: string;
  tag?: string;
  publishedDate: string;
  onCopyLink: () => void;
};
export function OaksImpactCaseStudyHeader({
  title,
  tag,
  publishedDate,
  onCopyLink,
}: Readonly<OaksImpactCaseStudyHeaderProps>) {
  return (
    <OakFlex
      $pt="spacing-32"
      $gap="spacing-16"
      $flexDirection="column"
      $alignItems="flex-start"
    >
      {tag && (
        <OakTagFunctional label={tag} $background="bg-decorative2-main" />
      )}
      <OakHeading tag="h1" $font={["heading-4", "heading-3", "heading-3"]}>
        {title}
      </OakHeading>
      <OakFlex $flexDirection="row" $flexGrow={1} $alignSelf="stretch">
        <OakFlex $flexGrow={1} $font={["body-2", "body-1", "body-1"]}>
          {publishedDate}
        </OakFlex>
        <OakLink
          element="button"
          variant="secondary"
          onClick={onCopyLink}
          iconName="copy"
        >
          Copy link
        </OakLink>
      </OakFlex>
    </OakFlex>
  );
}
