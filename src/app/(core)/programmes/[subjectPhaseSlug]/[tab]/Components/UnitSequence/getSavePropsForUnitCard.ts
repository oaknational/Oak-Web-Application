import { getKeyStageTitle } from "@/utils/curriculum/formatting";

export const getSavePropsForUnitCard = ({
  slug,
  title,
  programmeSlug,
  keystageSlug,
  subject,
  subjectSlug,
  isOptionalityUnit,
}: {
  slug: string;
  title: string;
  programmeSlug: string;
  keystageSlug: string;
  subject: string;
  subjectSlug: string;
  isOptionalityUnit: boolean;
}) => {
  if (isOptionalityUnit) {
    return;
  }
  return {
    unitSlug: slug,
    unitTitle: title,
    programmeSlug,
    trackingProps: {
      savedFrom: "unit_listing_save_button" as const,
      keyStageSlug: keystageSlug,
      keyStageTitle: getKeyStageTitle(keystageSlug),
      subjectTitle: subject,
      subjectSlug: subjectSlug,
    },
  };
};
