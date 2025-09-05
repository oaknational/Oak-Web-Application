import { GetStaticProps } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilSubjectListingData } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { PupilViewsSubjectListing } from "@/components/PupilViews/PupilSubjectListing/PupilSubjectListing.view";

type SubjectListingPageProps = {
  curriculumData: PupilSubjectListingData[];
};

const PupilSubjectListing = (props: SubjectListingPageProps) => {
  const { curriculumData } = props;

  if (!curriculumData[0]) {
    throw new Error("No curriculum data");
  }

  const { yearDescription } = curriculumData[0].programmeFields;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `${yearDescription} - Subject listing`,
            description: `Subject listing for ${yearDescription}`,
          }),
          noIndex: false,
          noFollow: false,
        }}
      >
        <PupilViewsSubjectListing subjects={curriculumData} />
      </AppLayout>
    </OakThemeProvider>
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

      const { curriculumData } =
        await curriculumApi2023.pupilSubjectListingQuery({
          yearSlug: year,
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
