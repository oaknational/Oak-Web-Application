import React from "react";
import {
  OakFlex,
  OakFlexProps,
  OakHeading,
  OakPromoTag,
  OakTertiaryButton,
  OakTypography,
} from "@oaknational/oak-components";

export type UnitsHeaderProps = {
  isLegacy: boolean;
  subject: string;
  phase: string;
  curriculumHref: string | null;
  isCustomUnit?: boolean;
  customHeadingText?: string;
  banner?: React.ReactNode;
} & OakFlexProps;

const CurriculumDownloadButton = (props: Omit<UnitsHeaderProps, "subject">) => {
  return props.curriculumHref ? (
    <OakTertiaryButton
      element="a"
      iconName="chevron-right"
      href={props.curriculumHref}
      isTrailingIcon={true}
      $pt={["spacing-8", "spacing-0"]}
    >
      {props.isLegacy
        ? "Curriculum download"
        : `Full ${props.phase.toLowerCase()} curriculum`}
    </OakTertiaryButton>
  ) : null;
};

export const UnitsHeader = (props: UnitsHeaderProps) => {
  const {
    subject,
    isLegacy,
    phase,
    curriculumHref: href,
    banner,
    isCustomUnit,
    customHeadingText,
    ...rest
  } = props;

  const subheading = isLegacy
    ? "Resources made during the pandemic to support lockdown learning."
    : "Brand-new teaching resources, thoughtfully crafted by teachers for classroom needs.";

  const standardHeadingText = isLegacy
    ? "Units released in 2020-22"
    : `${subject} units`;

  return (
    <>
      <OakFlex
        $gap="spacing-4"
        $alignItems={["flex-start", "center"]}
        $justifyContent="space-between"
        $flexDirection={["column", "row"]}
        {...rest}
      >
        <OakFlex $gap="spacing-8" $flexDirection="column">
          <OakFlex $gap="spacing-8">
            <OakHeading $font="heading-5" tag="h3" $color={"text-primary"}>
              {isCustomUnit && customHeadingText
                ? customHeadingText
                : standardHeadingText}
            </OakHeading>
            {!isLegacy && !isCustomUnit && <OakPromoTag />}
          </OakFlex>
          {!isCustomUnit && (
            <OakTypography $font="body-2" $color={"text-primary"}>
              {subheading}
            </OakTypography>
          )}
        </OakFlex>
        {href && !isCustomUnit && (
          <CurriculumDownloadButton
            isLegacy={isLegacy}
            phase={phase}
            curriculumHref={href}
          />
        )}
      </OakFlex>
      {banner && <OakFlex $width={"100%"}>{banner}</OakFlex>}
    </>
  );
};
