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

  return (
    <>
      {" "}
      {(() => {
        switch (true) {
          case !!onClick:
            return examboards.map((examboard) => (
              <OakPupilJourneyYearButton
                phase={phaseSlug}
                key={examboard.examboardSlug}
                onClick={() => onClick && onClick(examboard)}
              >
                {examboard.examboard}
              </OakPupilJourneyYearButton>
            ));
          case !!baseSlug:
            return examboards.map((examboard) => (
              <OakPupilJourneyYearButton
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
