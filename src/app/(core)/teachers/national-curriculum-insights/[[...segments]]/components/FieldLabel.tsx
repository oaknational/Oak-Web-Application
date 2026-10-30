import { OakBox, OakJauntyAngleLabel } from "@oaknational/oak-components";

export const NationalCurriculumInsightsFieldLabel = ({
  htmlFor,
  id,
  label,
  invalid = false,
}: {
  htmlFor: string;
  id?: string;
  label: string;
  invalid?: boolean;
}) => (
  <OakBox
    as="label"
    htmlFor={htmlFor}
    id={id}
    $position="absolute"
    $top="spacing-0"
    $left="spacing-8"
    $transform="translateY(-50%)"
    $zIndex="in-front"
  >
    <OakJauntyAngleLabel
      as="span"
      label={label}
      $background={invalid ? "bg-error" : "bg-decorative5-main"}
      $color={invalid ? "text-inverted" : "text-primary"}
      $font="body-3-bold"
      $borderRadius="border-radius-square"
    />
  </OakBox>
);
