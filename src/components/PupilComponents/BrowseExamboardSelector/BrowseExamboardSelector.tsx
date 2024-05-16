import { OakPupilJourneyYearButton } from "@oaknational/oak-components";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

export type ExamboardData = Pick<
  ProgrammeFields,
  "examboard" | "examboardSlug" | "examboardDisplayOrder"
>;

export const BrowseExamboardSelector = ({
  examboards,
  baseSlug,
  onClick,
  isLegacy,
  phaseSlug,
}: {
  examboards: ExamboardData[];
  baseSlug?: string;
  onClick?: (examboard: ExamboardData) => void;
  isLegacy: boolean;
  phaseSlug: PupilProgrammeListingData["programmeFields"]["phaseSlug"];
}) => {
  if (phaseSlug === "foundation" || !phaseSlug) {
    throw new Error("Foundation phase is not supported");
  }

  const orderedExamboards = examboards.sort((a, b) => {
    return (a.examboardDisplayOrder ?? 0) - (b.examboardDisplayOrder ?? 0);
  });

  return (
    <>
      {" "}
      {(() => {
        switch (true) {
          case !!onClick:
            return orderedExamboards.map((examboard) => (
              <OakPupilJourneyYearButton
                phase={phaseSlug}
                key={examboard.examboardSlug}
                onClick={() => onClick && onClick(examboard)}
                role="button"
              >
                {examboard.examboard}
              </OakPupilJourneyYearButton>
            ));
          case !!baseSlug:
            return examboards.map((examboard) => (
              <OakPupilJourneyYearButton
                role="link"
                phase={phaseSlug}
                key={examboard.examboardSlug}
                element="a"
                href={resolveOakHref({
                  page: "pupil-unit-index",
                  programmeSlug: `${baseSlug}-${examboard.examboardSlug}${
                    isLegacy ? "-l" : ""
                  }`,
                })}
              >
                {examboard.examboard}
              </OakPupilJourneyYearButton>
            ));
        }
      })()}
    </>
  );
};
