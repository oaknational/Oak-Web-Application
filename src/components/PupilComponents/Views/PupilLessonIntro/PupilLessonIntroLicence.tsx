import { OakBox, OakFlex, OakIcon, OakSpan } from "@oaknational/oak-components";

import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";

export type PupilLessonIntroLicenceProps = {
  isLegacyLicense?: boolean;
  heading?: string;
};

export const PupilLessonIntroLicence = ({
  isLegacyLicense = false,
  heading = "Licence",
}: PupilLessonIntroLicenceProps) => {
  return (
    <>
      <OakFlex $alignItems="center" $mb="spacing-8">
        <OakBox $pa="spacing-4">
          <OakIcon
            iconName="copyright"
            $height="spacing-16"
            $width="spacing-16"
          />
        </OakBox>
        <OakSpan $font="body-3-bold">{heading}</OakSpan>
      </OakFlex>

      <CopyrightNotice isLegacyLicense={isLegacyLicense} />
    </>
  );
};
