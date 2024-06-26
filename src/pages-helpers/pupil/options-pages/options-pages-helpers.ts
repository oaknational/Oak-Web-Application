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
  examboardSlug?: ProgrammeFields["examboard_slug"] | null;
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
): Promise<GetStaticPropsResult<ProgrammesPageProps>> => {
  if (!context.params) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  // For the options path rename programmeSlug to baseSlug as this is the accurate usage of the options page.
  // I would have created a new folder [baseSlug] but multiple dynamic params on the same segment is not allowed.
  const { programmeSlug: baseSlug } = context.params;

  if (!baseSlug) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug,
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
          programmeSlug: baseSlug,
        }),
        permanent: false,
      },
    };
  }

  const yearSlug = getYearSlug({ programmes });

  return {
    props: { programmes, baseSlug, yearSlug },
  };
};
