import { OakLink, OakP } from "@oaknational/oak-components";
import { keystageSlugs } from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

type KeyStageSlug = z.infer<typeof keystageSlugs>;

type LinkConfig = {
  title?: string;
  programmeSlug?: string;
  display?: boolean;
};

type KeyStageLinks = {
  maths: LinkConfig;
  citizenship?: LinkConfig;
  rshe: LinkConfig;
};

const generateUnitIndexLink = (programmeSlug: string, title: string) => (
  <OakLink
    href={resolveOakHref({
      page: "unit-index",
      programmeSlug,
    })}
  >
    {title}
  </OakLink>
);

const linkData: Partial<Record<KeyStageSlug, KeyStageLinks>> = {
  ks4: {
    maths: { title: "KS4 maths", programmeSlug: "maths-secondary-ks4-higher" },
    citizenship: {
      title: "citizenship",
      programmeSlug: "citizenship-secondary-ks4-core",
      display: true,
    },
    rshe: { title: "RSHE (PSHE)", programmeSlug: "rshe-pshe-secondary-ks4" },
  },
  ks3: {
    maths: { title: "KS3 maths", programmeSlug: "maths-secondary-ks3" },
    citizenship: {
      title: "citizenship",
      programmeSlug: "citizenship-secondary-ks3",
      display: true,
    },
    rshe: { title: "RSHE (PSHE)", programmeSlug: "rshe-pshe-secondary-ks3" },
  },
  ks2: {
    maths: { title: "KS2 maths", programmeSlug: "maths-primary-ks2" },
    citizenship: { display: false },
    rshe: { title: "RSHE (PSHE)", programmeSlug: "rshe-pshe-primary-ks2" },
  },
};

export default function FinancialEducationDescription({
  unitListingData,
}: {
  unitListingData: UnitListingData;
}) {
  // Extract the links for the current key stage, explicitly typed as KeyStageLinks.
  const keyStageLinks = linkData[unitListingData.keyStageSlug] || linkData.ks4!;

  return (
    <OakP data-testid="teacher-financial-education-description">
      Explore our series of{" "}
      <OakLink
        href={resolveOakHref({
          page: "subject-index",
          keyStageSlug: unitListingData.keyStageSlug,
        })}
      >
        {unitListingData.keyStageTitle.toLowerCase()}
      </OakLink>{" "}
      financial education lessons, covering years 10 and 11. Find teaching
      resources: a slide deck, worksheet, quizzes and lesson overview which you
      can download for free. These resources can be used to plan{" "}
      {generateUnitIndexLink(
        keyStageLinks.maths.programmeSlug!,
        keyStageLinks.maths.title!,
      )}
      {keyStageLinks.citizenship?.display &&
        keyStageLinks.citizenship.title &&
        keyStageLinks.citizenship.programmeSlug && (
          <>
            ,{" "}
            {generateUnitIndexLink(
              keyStageLinks.citizenship.programmeSlug,
              keyStageLinks.citizenship.title,
            )}
          </>
        )}{" "}
      and{" "}
      {generateUnitIndexLink(
        keyStageLinks.rshe.programmeSlug!,
        keyStageLinks.rshe.title!,
      )}{" "}
      lessons to develop financial literacy.
    </OakP>
  );
}
