import {
  OakFlex,
  OakTagFunctional,
  OakHeading,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

type OaksImpactCaseStudyHeaderProps = {
  title: string;
  tag?: string;
  publishedDate: string;
  summary?: string;
  onCopyLink: () => void;
};
export function OaksImpactCaseStudyHeader({
  title,
  tag,
  publishedDate,
  summary,
  onCopyLink,
}: Readonly<OaksImpactCaseStudyHeaderProps>) {
  return (
    <OakFlex $flexDirection="column" $gap="spacing-48">
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
      {summary && (
        <OakFlex
          $flexDirection={"column"}
          $background={"bg-decorative2-very-subdued"}
          $pa={"spacing-20"}
          $borderRadius={"border-radius-s"}
          $gap={"spacing-16"}
          $ba="border-solid-s"
          $borderColor="border-decorative2"
        >
          <OakHeading tag={"h1"} $color={"text-primary"} $font={"heading-6"}>
            Summary
          </OakHeading>
          <OakP $color={"text-primary"} $font={"body-1"}>
            {summary}
          </OakP>
        </OakFlex>
      )}
    </OakFlex>
  );
}
