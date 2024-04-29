import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

export type URLParams = {
  programmeSlug: string;
};

export type ProgrammesPageProps = {
  baseSlug: string;
  programmes: PupilProgrammeListingData[];
  yearSlug: string;
};

export const getYearSlug = ({
  programmes,
}: {
  programmes: PupilProgrammeListingData[];
}) => {
  const yearSlug = programmes[0]?.yearSlug;

  if (
    programmes.filter((programme) => programme.yearSlug !== yearSlug).length > 0
  ) {
    throw new Error("programmes have non-matching yearSlugs");
  }

  if (!yearSlug) {
    throw new Error("no yearSlug found");
  }

  return yearSlug;
};
