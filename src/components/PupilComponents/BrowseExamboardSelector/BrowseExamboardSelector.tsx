import {
  OakFlex,
  OakHeading,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import { ProgrammeFields } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

export type ExamboardData = Pick<
  ProgrammeFields,
  "examboard" | "examboardSlug" | "examboardDisplayOrder"
>;

export const BrowseExamboardSelector = ({
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
