import {
  ProgrammeFields,
  examboardSlugs,
} from "@oaknational/oak-curriculum-schema";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import OakError from "@/errors/OakError";

export type URLParams = {
  programmeSlug: string;
};

export type ProgrammesPageProps = {
  baseSlug: string;
  programmes: PupilProgrammeListingData[];
  yearSlug: PupilProgrammeListingData["yearSlug"];
};

export const getYearSlug = ({
  programmes,
}: {
  programmes: PupilProgrammeListingData[];
}) => {
  const yearSlug = programmes[0]?.yearSlug;

  if (
    programmes.filter((programme) => programme.yearSlug !== yearSlug).length >
      0 ||
    !yearSlug
  ) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }
  return yearSlug;
};

export const isExamboardSlug = (
  examboardSlug: ProgrammeFields["examboard_slug"] | string | null,
): examboardSlug is ProgrammeFields["examboard_slug"] =>
  Object.keys(examboardSlugs.Values).includes(examboardSlug ?? "");
