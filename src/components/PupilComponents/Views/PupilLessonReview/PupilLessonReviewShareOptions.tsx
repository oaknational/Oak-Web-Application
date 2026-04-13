import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakSecondaryButton,
} from "@oaknational/oak-components";

export type PupilLessonReviewShareOptionsProps = {
  showPrintable?: boolean;
  printableHref?: string;
  onCopyLink: () => void;
  shareState?: "failed" | "shared" | "initial";
};

export const PupilLessonReviewShareOptions = ({
  showPrintable = false,
  printableHref,
  onCopyLink,
  shareState = "initial",
}: PupilLessonReviewShareOptionsProps) => {
  return (
    <>
      <OakHeading tag="h2" $font="body-2-bold">
        Share options:
      </OakHeading>

      <OakFlex $gap="spacing-16" $flexDirection={["column", "row"]}>
        {showPrintable && printableHref && (
          <OakBox $display={["none", "flex"]}>
            <OakSecondaryButton
              element="a"
              href={printableHref}
              target="_blank"
              aria-label="Printable results, opens in a new tab"
              title="Printable results (opens in a new tab)"
              iconName="external"
              isTrailingIcon
              data-testid="printable-results-button"
            >
              Printable results
            </OakSecondaryButton>
          </OakBox>
        )}

        <OakSecondaryButton
          type="button"
          role="button"
          aria-label="Copy link to clipboard"
          title="Copy link to clipboard"
          onClick={onCopyLink}
          iconName="copy"
          isTrailingIcon
          data-testid="share-results-button"
        >
          Copy link
        </OakSecondaryButton>
      </OakFlex>

      {shareState === "shared" && (
        <OakFlex $gap="spacing-4" $alignItems="center">
          <OakIcon iconName="tick" $colorFilter="text-success" />
          <OakHeading tag="h2" $font="heading-light-7" $color="text-success">
            Link copied to clipboard! You can share this with your teacher.
          </OakHeading>
        </OakFlex>
      )}

      {shareState === "failed" && (
        <OakFlex $gap="spacing-4" $alignItems="center">
          <OakIcon iconName="cross" $colorFilter="text-error" />
          <OakHeading tag="h2" $font="heading-light-7" $color="text-error">
            Failed to share results. Please try again.
          </OakHeading>
        </OakFlex>
      )}
    </>
  );
};
