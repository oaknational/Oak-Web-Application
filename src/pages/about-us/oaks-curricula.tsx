import { GetServerSideProps, NextPage } from "next";
import {
  OakAllSpacingToken,
  OakBox,
  OakFlex,
  OakHeading,
  OakIconName,
} from "@oaknational/oak-components";
import styled from "styled-components";

import Layout from "@/components/AppComponents/Layout";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumPartners } from "@/components/GenericPagesComponents/CurriculumPartners";
import { GuidingPrinciples } from "@/components/GenericPagesComponents/GuidingPrinciples";
import CurricInfoCard from "@/components/CurriculumComponents/CurricInfoCard";
import isNewAboutUsPagesEnabled from "@/utils/isNewAboutUsPagesEnabled";

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

const UnstyledLi = styled.li`
  display: flex;
  flex: 1 1 0;
  list-style: none;
`;


const curriculaCardsInfo: Array<{ iconName: OakIconName; iconWidth: OakAllSpacingToken; text: string }> = [{
  iconName: "clipboard",
  iconWidth: "spacing-48",
  text: "National curriculum and exam board aligned",
}, {
  iconName: "free-tag",
  iconWidth: "spacing-80",
  text: "Free and always will be",
}, {
  iconName: "book-steps",
  iconWidth: "spacing-72",
  text: "Covers key stages 1-4 across 20 subjects",
}, {
  iconName: "threads",
  iconWidth: "spacing-64",
  text: "Fully sequenced and ready to adapt",
}];

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
        >
          <AboutSharedHeaderImage
            imageAlt=""
            imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/planning-curriculum_xhs7ev.svg"
          />
        </AboutSharedHeader>
        <OakBox $background={"bg-decorative4-very-subdued"}>
          <NewGutterMaxWidth>
            <OakFlex $flexDirection={"column"} $gap={"spacing-56"} $pv={["spacing-56", "spacing-80"]}>
              <OakFlex
                as="ul"
                $flexDirection={["column", "row"]}
                $pa={"spacing-0"}
                $ma={"spacing-0"}
                $gap={"spacing-16"}
                $alignItems="stretch"
              >
                {curriculaCardsInfo.map((cardInfo) => (
                  <UnstyledLi key={cardInfo.iconName}>
                    <CurricInfoCard
                      iconName={cardInfo.iconName}
                      background="bg-primary"
                      iconHeight={"spacing-92"}
                      iconWidth={cardInfo.iconWidth}
                      borderColor="border-decorative4"
                    >
                      {cardInfo.text}
                    </CurricInfoCard>
                  </UnstyledLi>
                ))}
              </OakFlex>
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
                  See Oak’s curricula in practice
                </OakHeading>
                <SubjectPhasePicker {...pageData.curriculumPhaseOptions} />
              </OakFlex>
            </OakFlex>
          </NewGutterMaxWidth>
        </OakBox>
        <NewGutterMaxWidth>
          <OakFlex
            $flexDirection={"column"}
            $pv={"spacing-80"}
            $gap={"spacing-56"}
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
        </NewGutterMaxWidth>
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
  const pageData = {
    ...mockData,
    curriculumPhaseOptions: await fetchSubjectPhasePickerData(),
  };

  const enableV2 = await isNewAboutUsPagesEnabled(
    posthogApiKey,
    context.req.cookies,
  );
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
