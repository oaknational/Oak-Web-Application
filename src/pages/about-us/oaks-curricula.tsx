import { GetServerSideProps, NextPage } from "next";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakImage,
  OakMaxWidth,
  OakP,
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

type PartnerContainerProps = {
  title: string;
  text: string;
  items: {
    imageUrl: string;
    alt: string;
  }[];
};
function PartnerContainer({ title, text, items }: PartnerContainerProps) {
  return (
    <>
      <OakFlex $gap={"spacing-24"} $flexDirection={"column"}>
        <OakFlex $gap={"spacing-8"} $flexDirection={"column"}>
          <OakHeading tag="h4" $font={["heading-5", "heading-4", "heading-4"]}>
            {title}
          </OakHeading>
          <OakP $font={["body-1", "body-1", "body-2"]}>{text}</OakP>
        </OakFlex>
      </OakFlex>
      <OakBox>
        <OakGrid
          $gridTemplateColumns={[
            "repeat(3, 1fr)",
            "repeat(5, 1fr)",
            "repeat(6, 1fr)",
          ]}
          $cg={"spacing-16"}
          $rg={"spacing-16"}
        >
          {items.map((item) => {
            return (
              <OakBox
                key={item.imageUrl}
                $aspectRatio={"1/1"}
                $borderRadius={"border-radius-m"}
                $borderColor={"border-neutral-lighter"}
                $borderStyle={"solid"}
              >
                <OakImage src={item.imageUrl} alt={item.alt} />
              </OakBox>
            );
          })}
        </OakGrid>
      </OakBox>
    </>
  );
}

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
        <OakMaxWidth $pv={"spacing-80"}>
          <OakFlex
            $gap={"spacing-56"}
            $pt={"spacing-80"}
            $flexDirection={"column"}
          >
            <OakHeading
              tag="h3"
              $font={["heading-4", "heading-3", "heading-3"]}
            >
              Curriculum partners
            </OakHeading>
            <PartnerContainer
              title="Current"
              text="Partners involved in the creation of our new curricula (published after September 2022)."
              items={pageData.partners.current}
            />
            <PartnerContainer
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
      current: new Array(16).fill(true).map(() => {
        return { imageUrl: "", alt: "" };
      }),
      legacy: new Array(16).fill(true).map(() => {
        return { imageUrl: "", alt: "" };
      }),
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
