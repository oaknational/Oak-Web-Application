import { GetServerSideProps, NextPage } from "next";
import { OakBox, OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import Layout from "@/components/AppComponents/Layout";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { AboutSharedHeader } from "@/components/GenericPagesComponents/AboutSharedHeader";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type OaksCurriculaPage = {
  pageData: {
    header: {
      textRaw: PortableTextJSON;
    };
    curriculumPhaseOptions: SubjectPhasePickerData;
  };
  topNav: TopNavProps;
};

export const OaksCurricula: NextPage<OaksCurriculaPage> = ({
  pageData,
  topNav,
}) => {
  return (
    <Layout
      seoProps={getSeoProps(null)}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"Oak’s curricula"}
          content={pageData.header.textRaw}
          titleHighlight="bg-decorative4-main"
        />
        <OakBox $background={"bg-decorative4-very-subdued"}>
          <OakMaxWidth $pv={"spacing-80"}>
            <OakFlex $flexDirection={"column"} $gap={"spacing-56"}>
              <OakBox $pa={"spacing-16"} $background={"text-inverted"}>
                TODO: Guiding principals
              </OakBox>
              <OakBox $maxWidth={"spacing-640"}>
                <SubjectPhasePicker {...pageData.curriculumPhaseOptions} />
              </OakBox>
            </OakFlex>
          </OakMaxWidth>
        </OakBox>
        <OakBox $pa={"spacing-16"}>TODO: Subject phase picker</OakBox>
        <OakBox $pa={"spacing-16"}>TODO: Curriculum partners</OakBox>
        <OakBox $pa={"spacing-16"}>TODO: Can oak support you</OakBox>
      </AboutUsLayout>
    </Layout>
  );
};

const mockData: Omit<OaksCurriculaPage["pageData"], "curriculumPhaseOptions"> =
  {
    header: {
      textRaw: [
        {
          style: "normal",
          _type: "block",
          children: [
            {
              _type: "span",
              marks: [],
              text: "Oak offers complete curriculum support for clarity and coherence in every national curriculum subject - designed by experts, for every classroom.",
            },
          ],
        },
      ],
    },
  };

const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const subjects = await curriculumApi2023.curriculumPhaseOptions();
    return {
      subjects: filterValidCurriculumPhaseOptions(subjects),
      tab: "units",
    };
  };

export const getServerSideProps = (async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );

  const pageData = {
    ...mockData,
    curriculumPhaseOptions: await fetchSubjectPhasePickerData(),
  };

  let enableV2: boolean = false;
  if (posthogUserId) {
    // get the variant key for the user
    enableV2 =
      (await getFeatureFlag({
        featureFlagKey: "about-us--who-we-are--v2",
        posthogUserId,
      })) === true;
  }
  const topNav = await curriculumApi2023.topNav();

  if (!enableV2 || !pageData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData,
      topNav,
    },
  };
}) satisfies GetServerSideProps<OaksCurriculaPage>;

export default OaksCurricula;
