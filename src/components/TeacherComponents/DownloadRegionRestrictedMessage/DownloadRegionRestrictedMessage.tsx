import {
  OakFlex,
  OakHeading,
  OakBox,
  OakP,
  OakLink,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export function DownloadRegionRestrictedMessage({ href }: { href: string }) {
  return (
    <OakFlex
      $flexDirection={"column"}
      $color={"text-primary"}
      $mt={"space-between-m"}
      $gap={"space-between-m"}
    >
      <OakHeading $font={"heading-4"} tag="h1">
        Sorry, downloads for this lesson are only available in the UK
      </OakHeading>
      <OakBox $font={"body-1"}>
        <OakP>
          Some of our content is restricted to the UK due to copyright.
        </OakP>
        <OakP>
          If you believe this is an error and you're based in the UK, please{" "}
          <OakLink href="/contact-us">contact us.</OakLink>
        </OakP>
      </OakBox>
      <OakBox $pv={"inner-padding-xl3"}>
        <OakPrimaryButton href={href} element="a" iconName="arrow-left">
          Back to lesson{" "}
        </OakPrimaryButton>
      </OakBox>
    </OakFlex>
  );
}
