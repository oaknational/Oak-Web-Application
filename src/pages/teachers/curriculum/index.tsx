import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import {
  OakHeading,
  OakHandDrawnHR,
  OakMaxWidth,
  OakFlex,
  OakBox,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { decorateWithIsr } from "@/node-lib/isr";
import curriculumApi2023, {
  CurriculumPhaseOptions,
} from "@/node-lib/curriculum-api-2023";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import CurricInfoCard from "@/components/CurriculumComponents/CurricInfoCard";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { GuidingPrinciples } from "@/components/GenericPagesComponents/GuidingPrinciples";

export type CurriculumHomePageProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
  topNav: TopNavProps;
};

const CurriculumHomePage: NextPage<CurriculumHomePageProps> = (props) => {
  const { curriculumPhaseOptions, topNav } = props;

  return (
    <AppLayout
      topNavProps={topNav}
      seoProps={{
        ...getSeoProps({
          title:
            "Free curriculum plans aligned with National Curriculum  | Oak National Academy",
          description:
            "Discover our free curriculum plans across subjects from KS1 to KS4, all high-quality, fully-sequenced and aligned with the national curriculum.",
        }),
      }}
      $background={"bg-decorative1-main"}
    >
      <OakMaxWidth $ph={"spacing-16"}>
        <OakBox $mt={"spacing-24"}>
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: { page: "home" },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "curriculum-landing-page",
                },
                label: "Oak's curricula",
              },
            ]}
          />
          <OakHandDrawnHR
            hrColor={"bg-primary"}
            $mt={"spacing-24"}
            $height={"spacing-4"}
          />
        </OakBox>
      </OakMaxWidth>
      <OakMaxWidth $ph={"spacing-20"}>
        <OakFlex
          $flexDirection={"column"}
          $pt={"spacing-32"}
          $pb={"spacing-48"}
        >
          <OakHeading
            tag="h1"
            $font={["heading-3", "heading-2"]}
            $background={"bg-decorative1-main"}
            $textAlign={["left", "center"]}
            $color={"text-primary"}
          >
            Oak's curricula
          </OakHeading>

          <OakFlex
            $justifyContent={"center"}
            $mt={"spacing-16"}
            $mb={"spacing-48"}
          >
            <OakBox $width={"spacing-640"}>
              <SubjectPhasePicker {...curriculumPhaseOptions} />
            </OakBox>
          </OakFlex>

          <OakFlex
            $flexDirection={["column", "row"]}
            $flexWrap="wrap"
            $gap="spacing-16"
            $alignItems="stretch"
          >
            <CurricInfoCard
              iconName="clipboard"
              background="bg-decorative1-very-subdued"
              iconHeight={"spacing-92"}
              iconWidth={"spacing-48"}
            >
              National curriculum and exam board aligned
            </CurricInfoCard>
            <CurricInfoCard
              iconName="free-tag"
              background="bg-decorative1-very-subdued"
              iconHeight="spacing-92"
              iconWidth="spacing-80"
            >
              Free and always will be
            </CurricInfoCard>
            <CurricInfoCard
              iconName="book-steps"
              background="bg-decorative1-very-subdued"
              iconHeight="spacing-92"
              iconWidth="spacing-72"
            >
              Covers key stages 1-4 across 20 subjects
            </CurricInfoCard>
            <CurricInfoCard
              iconName="threads"
              background="bg-decorative1-very-subdued"
              iconHeight="spacing-92"
              iconWidth="spacing-64"
            >
              Fully sequenced and ready to adapt
            </CurricInfoCard>
          </OakFlex>
        </OakFlex>
      </OakMaxWidth>
      <OakFlex $background={"bg-primary"} $justifyContent={"center"}>
        <OakMaxWidth
          $ph={"spacing-20"}
          $pv="spacing-80"
          $maxWidth={["100%", "spacing-1280"]}
        >
          <GuidingPrinciples
            accentColor="border-decorative1-stronger"
            $background="bg-decorative1-very-subdued"
          />
        </OakMaxWidth>
      </OakFlex>
    </AppLayout>
  );
};

const filterValidCurriculumPhaseOptions = (
  subjects: CurriculumPhaseOptions,
) => {
  subjects.forEach(({ ks4_options }) => {
    if (
      ks4_options &&
      ks4_options.some(({ slug }: { slug: string }) => isExamboardSlug(slug))
    ) {
      const gcseIndex = ks4_options.findIndex(
        ({ slug }: { slug: string }) => slug === "gcse",
      );
      if (gcseIndex > 0) {
        ks4_options.splice(gcseIndex, 1);
      }
    }
  });
  return subjects;
};

const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const subjects = await curriculumApi2023.curriculumPhaseOptions();
    return {
      subjects: filterValidCurriculumPhaseOptions(subjects),
      tab: "units",
    };
  };

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const data = await fetchSubjectPhasePickerData();
  const topNav = await curriculumApi2023.topNav();

  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      curriculumPhaseOptions: data,
      topNav,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default CurriculumHomePage;
