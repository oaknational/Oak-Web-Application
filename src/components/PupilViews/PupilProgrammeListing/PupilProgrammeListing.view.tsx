import { useState } from "react";
import {
  OakBackLink,
  OakFlex,
  OakHeading,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { getAvailableProgrammeFactor } from "./getAvailableProgrammeFactor";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import {
  BrowseExamboardSelector,
  ExamboardData,
} from "@/components/PupilComponents/BrowseExamboardSelector";
import {
  BrowseTierSelector,
  TierData,
} from "@/components/PupilComponents/BrowseTierSelector";

type PupilViewsProgrammeListingProps = {
  programmes: PupilProgrammeListingData[];
  baseSlug: string;
  isLegacy: boolean;
  yearSlug: string;
};

export const PupilViewsProgrammeListing = ({
  programmes,
  baseSlug,
  isLegacy,
  yearSlug,
}: PupilViewsProgrammeListingProps) => {
  const tiers = getAvailableProgrammeFactor({
    programmes,
    factorPrefix: "tier",
  });

  const examboards = getAvailableProgrammeFactor({
    programmes,
    factorPrefix: "examboard",
  });

  const [chosenExamboard, setChosenExamboard] = useState<ExamboardData | null>(
    null,
  );

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex
        $flexDirection={"column"}
        $gap={"space-between-m"}
        $pa={"inner-padding-m"}
      >
        <OakHeading tag="h1">Programmes Listing Page</OakHeading>

        {(() => {
          switch (true) {
            case chosenExamboard !== null && tiers.length > 1:
              return (
                <>
                  <OakBackLink
                    as={"button"}
                    onClick={() => setChosenExamboard(null)}
                  >
                    Back
                  </OakBackLink>
                  <BrowseTierSelector
                    tiers={tiers as TierData[]}
                    baseSlug={baseSlug}
                    examboardSlug={chosenExamboard?.examboardSlug} // TS complains chosenExamboard could be null ?!
                    isLegacy={isLegacy}
                  />
                </>
              );
            case examboards.length > 1 && chosenExamboard === null:
              return (
                <>
                  <OakBackLink href={`/pupils/beta/years/${yearSlug}/subjects`}>
                    Back
                  </OakBackLink>
                  <BrowseExamboardSelector
                    examboards={examboards as ExamboardData[]}
                    baseSlug={baseSlug}
                    onClick={(examboard) => setChosenExamboard(examboard)}
                    isLegacy={isLegacy}
                  />
                </>
              );
            case examboards.length <= 1 && tiers.length >= 1:
              return (
                <>
                  <OakBackLink href={`/pupils/beta/years/${yearSlug}/subjects`}>
                    Back
                  </OakBackLink>
                  <BrowseTierSelector
                    tiers={tiers as TierData[]}
                    baseSlug={baseSlug}
                    isLegacy={isLegacy}
                  />
                </>
              );
            default:
              return <div>No programme factors to be selected</div>;
          }
        })()}
      </OakFlex>
    </OakThemeProvider>
  );
};
