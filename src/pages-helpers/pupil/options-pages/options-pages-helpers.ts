import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import {
  ProgrammeFields,
  examboardSlugs,
} from "@oaknational/oak-curriculum-schema";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { resolveOakHref } from "@/common-lib/urls";

export type OptionsURLParams = {
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

export const getPupilOptionData = async (
  context: GetStaticPropsContext<OptionsURLParams>,
  isLegacy: boolean = false,
): Promise<GetStaticPropsResult<ProgrammesPageProps>> => {
  if (!context.params) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }
  const { programmeSlug } = context.params;

  if (!programmeSlug) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug: programmeSlug,
    isLegacy,
  });

  if (!programmes || programmes.length === 0) {
    return {
      notFound: true,
    };
  }

  if (programmes.length === 1) {
    return {
      redirect: {
        destination: resolveOakHref({
          page: "pupil-unit-index",
          programmeSlug,
        }),
        permanent: false,
      },
    };
  }

  const yearSlug = getYearSlug({ programmes });

  return {
    props: { programmes, baseSlug: programmeSlug, yearSlug },
  };
};
