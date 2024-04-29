import { useState } from "react";
import { isEqual, uniqWith } from "lodash";
import {
  OakFlex,
  OakHeading,
  OakSecondaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import {
  PupilProgrammeListingData,
  ProgrammeFields,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

type TierData = Pick<ProgrammeFields, "tier" | "tierSlug" | "tierDisplayOrder">;
type ExamboardData = Pick<
  ProgrammeFields,
  "examboard" | "examboardSlug" | "examboardDisplayOrder"
>;

const getAvailableProgrammeFactor = ({
  programmes,
  factorPrefix,
}: {
  programmes: PupilProgrammeListingData[];
  factorPrefix: "tier" | "examboard";
}): TierData[] | ExamboardData[] => {
  const factors = programmes
    .map((programme) => {
      switch (true) {
        case factorPrefix === "tier" && !!programme.programmeFields.tier:
          return {
            tier: programme.programmeFields.tier,
            tierSlug: programme.programmeFields.tierSlug,
            tierDisplayOrder: programme.programmeFields.tierDisplayOrder,
          };
        case factorPrefix === "examboard" &&
          !!programme.programmeFields.examboard:
          return {
            examboard: programme.programmeFields.examboard,
            examboardSlug: programme.programmeFields.examboardSlug,
            examboardDisplayOrder:
              programme.programmeFields.examboardDisplayOrder,
          };
        default:
          return;
      }
    })
    .filter((factor) => !!factor) as TierData[] | ExamboardData[];

  return uniqWith(factors, isEqual);
};

const ExamboardSelector = ({
  examboards,
  baseSlug,
  onClick,
  isLegacy,
}: {
  examboards: ExamboardData[];
  baseSlug?: string;
  onClick?: (examboard: ExamboardData) => void;
  isLegacy: boolean;
}) => (
  <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
    <OakHeading tag="h2">Choose an Examboard</OakHeading>
    {(() => {
      switch (true) {
        case !!onClick:
          return examboards.map((examboard) => (
            <OakSecondaryButton
              key={examboard.examboardSlug}
              onClick={() => onClick && onClick(examboard)}
            >
              {examboard.examboard}
            </OakSecondaryButton>
          ));
        case !!baseSlug:
          return examboards.map((examboard) => (
            <OakSecondaryButton
              key={examboard.examboardSlug}
              element="a"
              href={`/pupils/beta/programmes/${baseSlug}-${
                examboard.examboardSlug
              }${isLegacy ? "-l" : ""}/units`}
            >
              {examboard.examboard}
            </OakSecondaryButton>
          ));
      }
    })()}
  </OakFlex>
);

const TierSelector = ({
  tiers,
  baseSlug,
  examboardSlug,
  isLegacy,
}: {
  tiers: TierData[];
  baseSlug: string;
  examboardSlug?: string | null;
  isLegacy: boolean;
}) => {
  const programmeSlugs = tiers.map(
    (tier) =>
      `${baseSlug}-${tier.tierSlug}${examboardSlug ? `-${examboardSlug}` : ""}${
        isLegacy ? "-l" : ""
      }`,
  );

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakHeading tag="h2">Choose a tier</OakHeading>
      {tiers.map((tier, i) => (
        <OakSecondaryButton
          key={tier.tierSlug}
          element="a"
          href={`/pupils/beta/programmes/${programmeSlugs[i]}/units`}
        >
          {tier.tier}
        </OakSecondaryButton>
      ))}
    </OakFlex>
  );
};

type PupilViewsProgrammeListingProps = {
  programmes: PupilProgrammeListingData[];
  baseSlug: string;
  isLegacy: boolean;
};

export const PupilViewsProgrammeListing = ({
  programmes,
  baseSlug,
  isLegacy,
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
                <TierSelector
                  tiers={tiers as TierData[]}
                  baseSlug={baseSlug}
                  examboardSlug={chosenExamboard?.examboardSlug} // TS complains chosenExamboard could be null ?!
                  isLegacy={isLegacy}
                />
              );
            case examboards.length > 1 && chosenExamboard === null:
              return (
                <ExamboardSelector
                  examboards={examboards as ExamboardData[]}
                  baseSlug={baseSlug}
                  onClick={(examboard) => setChosenExamboard(examboard)}
                  isLegacy={isLegacy}
                />
              );
            case examboards.length <= 1 && tiers.length >= 1:
              return (
                <TierSelector
                  tiers={tiers as TierData[]}
                  baseSlug={baseSlug}
                  isLegacy={isLegacy}
                />
              );
            default:
              return <div>No programme factors to be selected</div>;
          }
        })()}
      </OakFlex>
    </OakThemeProvider>
  );
};
