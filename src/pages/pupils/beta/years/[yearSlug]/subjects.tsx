import { GetStaticProps } from "next";
import Link from "next/link";
import _ from "lodash";

import { resolveOakHref } from "@/common-lib/urls";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilSubjectListingData } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";

type SubjectListingPageProps = { curriculumData: PupilSubjectListingData[] };

const PupilSubjectListing = (props: SubjectListingPageProps) => {
  const { curriculumData } = props;
  const groupedBySubject: Record<string, PupilSubjectListingData[]> = _.groupBy(
    curriculumData,
    (curriculumData) => curriculumData.programmeFields.subjectSlug,
  );

  const subjects = Object.keys(groupedBySubject).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <div>
      <Link
        href={resolveOakHref({
          page: "pupil-year-index",
        })}
      >
        View years
      </Link>
      <ol>
        {subjects.map((subject) => {
          const subjectData = groupedBySubject[subject];
          const length = subjectData?.length;
          if (subjectData?.[0]) {
            if (length === 1) {
              const programmeSlug = subjectData[0].programmeSlug;
              return (
                <li key={subject}>
                  <Link
                    href={resolveOakHref({
                      page: "pupil-unit-index",
                      programmeSlug: programmeSlug,
                    })}
                  >
                    {subject}
                  </Link>
                </li>
              );
            }
            const baseSlug = subjectData[0].baseSlug;
            const isLegacy = subjectData[0].isLegacy;
            return (
              <li key={subject}>
                <Link
                  href={resolveOakHref({
                    page: "pupil-programme-index",
                    programmeSlug: baseSlug,
                    optionSlug: isLegacy ? "options-l" : "options",
                  })}
                >
                  {subject}
                </Link>
              </li>
            );
          }
        })}
      </ol>
    </div>
  );
};

type URLParams = {
  yearSlug: string;
};

export const getStaticPaths = getStaticPathsTemplate<URLParams>;

export const getStaticProps: GetStaticProps<
  SubjectListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-subject-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params?.yearSlug) {
        throw new Error("No yearSlug");
      }
      const year = context.params?.yearSlug;

      const curriculumData = await curriculumApi2023.pupilSubjectListingQuery({
        yearSlug: year,
        isLegacy: false,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default PupilSubjectListing;
