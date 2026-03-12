import { OakLink, OakP } from "@oaknational/oak-components";

import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

export default function RuleOfLawDescription({
  unitListingData,
}: Readonly<{
  unitListingData: UnitListingData;
}>) {
  const isKs1 = unitListingData.keyStageSlug === "ks1";
  const isKs2 = unitListingData.keyStageSlug === "ks2";
  const unitCount = unitListingData.units.flat().length;
  const isPlural = unitCount !== 1;

  if (!isKs1 && !isKs2) {
    return null;
  }

  return (
    <OakP $textWrap="balance">
      Explore our{" "}
      <OakLink
        href={resolveOakHref({
          page: "subject-index",
          keyStageSlug: unitListingData.keyStageSlug,
        })}
      >
        key stage {isKs1 ? "1" : "2"}
      </OakLink>{" "}
      rule of law {isPlural ? "lessons" : "lesson"} which can be used in{" "}
      {isKs1 ? "year 1 or 2" : "year 3, 4, 5 or 6"}. Find teaching resources: a
      slide deck, worksheet, {isPlural ? "quizzes" : "quiz"} and lesson overview
      which you can download for free.
    </OakP>
  );
}
