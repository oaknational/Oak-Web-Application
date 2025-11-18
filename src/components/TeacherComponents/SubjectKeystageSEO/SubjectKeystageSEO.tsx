import { OakP } from "@oaknational/oak-components";

import { KeyStageSlug } from "@/utils/curriculum/types";

export const defaultText =
  "Free sequenced lesson planning and teaching resources for every national curriculum subject.";
export const ks4Text =
  "Our free GCSE and KS4 lesson planning and teaching resources include subjects tailored to specific exam boards, ensuring full alignment with the national curriculum.";

export const SubjectKeystageSEO = ({
  keystageSlug,
}: {
  keystageSlug: KeyStageSlug;
}) => {
  const content = keystageSlug === "ks4" ? ks4Text : defaultText;
  return <OakP data-testid="subject-keystage-seo">{content}</OakP>;
};
