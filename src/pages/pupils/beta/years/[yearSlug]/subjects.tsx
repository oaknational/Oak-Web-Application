import { GetStaticPathsResult, GetStaticProps } from "next";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilSubjectListingData } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";

type SubjectListingPageProps = { curriculumData: PupilSubjectListingData[] };

const SubjectListing = (props: SubjectListingPageProps) => {
  const { curriculumData } = props;
  const subjectObject: Record<string, PupilSubjectListingData[]> =
    curriculumData.reduce(
      (acc: Record<string, PupilSubjectListingData[]>, curriculumData) => {
        const subjectSlug = curriculumData.programmeFields.subjectSlug;
        if (!acc[subjectSlug]) {
          acc[subjectSlug] = [];
        }
        acc[subjectSlug]?.push(curriculumData);
        return acc;
      },
      {},
    );

  const subjects = Object.keys(subjectObject);

  return (
    <div>
      <ol>
        {subjects.map((subject) => {
          const subjectData = subjectObject[subject];
          const length = subjectData?.length;
          if (subjectData?.[0]) {
            if (length === 1 && subjectData?.[0]) {
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
            return (
              <li key={subject}>
                <Link
                  href={resolveOakHref({
                    page: "pupil-programme-index",
                    yearSlug: subjectData[0].programmeFields.yearSlug,
                    subjectSlug: subjectData[0].programmeFields.subjectSlug,
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

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

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

export default SubjectListing;
