import { GetStaticProps } from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilSubjectListingData } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { PupilViewsSubjectListing } from "@/components/PupilViews/PupilSubjectListing/PupilSubjectListing.view";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

type SubjectListingPageProps = {
  curriculumData: PupilSubjectListingData[];
  topNav: TopNavProps;
};

const PupilSubjectListing = (props: SubjectListingPageProps) => {
  const { curriculumData, topNav } = props;

  if (!curriculumData[0]) {
    throw new Error("No curriculum data");
  }

  const { yearDescription } = curriculumData[0].programmeFields;

  return (
    <AppLayout
      topNavProps={topNav}
      seoProps={{
        ...getSeoProps({
          title: `${yearDescription} - Subject listing`,
          description: `Subject listing for ${yearDescription}`,
        }),
      }}
    >
      <PupilViewsSubjectListing subjects={curriculumData} />
    </AppLayout>
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

      const topNav = await curriculumApi2023.topNav();

      const results = {
        props: {
          curriculumData,
          topNav,
        },
      };

      return results;
    },
  });
};

export default PupilSubjectListing;
