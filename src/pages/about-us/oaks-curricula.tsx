import { GetServerSideProps, NextPage } from "next";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
} from "@oaknational/oak-components";

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
import { CurriculumPartners } from "@/components/GenericPagesComponents/CurriculumPartners";
import { GuidingPrinciples } from "@/components/GenericPagesComponents/GuidingPrinciples";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type OaksCurriculaPage = {
  pageData: {
    header: {
      textRaw: PortableTextJSON;
    };
    partners: {
      current: { imageUrl: string; alt: string }[];
      legacy: { imageUrl: string; alt: string }[];
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
          <OakMaxWidth $pv={"spacing-80"} $ph={["spacing-16"]}>
            <OakFlex $flexDirection={"column"} $gap={"spacing-56"}>
              <GuidingPrinciples
                $background="bg-primary"
                accentColor="border-decorative4"
              />
              <OakFlex
                $flexDirection="column"
                $maxWidth={"spacing-640"}
                $gap={["spacing-8", "spacing-12", "spacing-12"]}
              >
                <OakHeading
                  tag="h2"
                  $font={["heading-5", "heading-4", "heading-4"]}
                >
                  See Oak’s curriculum in practice
                </OakHeading>
                <SubjectPhasePicker {...pageData.curriculumPhaseOptions} />
              </OakFlex>
            </OakFlex>
          </OakMaxWidth>
        </OakBox>
        <OakMaxWidth>
          <OakFlex
            $gap={"spacing-56"}
            $pt={"spacing-80"}
            $flexDirection={"column"}
          >
            <OakHeading
              tag="h2"
              $font={["heading-4", "heading-3", "heading-3"]}
            >
              Curriculum partners
            </OakHeading>
            <CurriculumPartners
              title="Current"
              text="Partners involved in the creation of our new curricula (published after September 2022)."
              items={pageData.partners.current}
            />
            <CurriculumPartners
              title="Legacy"
              text="Partners involved in the creation of our previous curricula (published before September 2022)."
              items={pageData.partners.legacy}
            />
          </OakFlex>
        </OakMaxWidth>
        <OakBox $pa={"spacing-16"} $borderStyle={"solid"}>
          TODO: Can oak support you
        </OakBox>
      </AboutUsLayout>
    </Layout>
  );
};

const mockPartnerImages = new Array(16).fill(true).map((_, index) => {
  return {
    imageUrl: `/images/oak-national-academy-logo-512.png#${index}`,
    alt: "",
  };
});

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
    partners: {
      current: mockPartnerImages,
      legacy: mockPartnerImages,
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
