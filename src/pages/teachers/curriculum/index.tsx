import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import {
  OakHeading,
  OakP,
  OakHandDrawnHR,
  OakMaxWidth,
  OakFlex,
  OakBox,
} from "@oaknational/oak-components";
import styled from "styled-components";

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
import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import Cover from "@/components/SharedComponents/Cover/Cover";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import CurricInfoCard from "@/components/CurriculumComponents/CurricInfoCard";
import CurricQuote from "@/components/CurriculumComponents/CurricQuote";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type CurriculumHomePageProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
  topNav: TopNavProps;
};

const StyledResponsiveFlex = styled(OakFlex)`
  flex-direction: column;

  @media (min-width: 1000px) {
    flex-direction: row;
  }
`;

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
        <OakMaxWidth $ph={"spacing-20"} $maxWidth={["100%", "spacing-1280"]}>
          <StyledResponsiveFlex
            $justifyContent="space-between"
            $alignItems="flex-start"
            $background="bg-decorative1-very-subdued"
            $mv="spacing-80"
            $borderRadius="border-radius-l"
            $pa={["spacing-24", "spacing-64", "spacing-80"]}
            $gap={["spacing-56", "spacing-80", "spacing-72"]}
          >
            <OakFlex
              $alignItems={["center", "center", "flex-start"]}
              $flexDirection="column"
              $flexGrow={1}
              $flexBasis={0}
              $gap={["spacing-64"]}
            >
              <OakFlex $flexDirection="column">
                <OakHeading tag="h2" $font={["heading-4", "heading-3"]}>
                  Our guiding principles
                </OakHeading>

                <OakP $mt={"spacing-16"} $mb={"spacing-12"} $font={"body-1"}>
                  We have crafted a set of overarching principles that describe
                  the features important to our curricula in all subjects.
                </OakP>
              </OakFlex>

              <Cover
                $width={[300, 450, 450]}
                $height={[270, 420, 420]}
                $position={"relative"}
              >
                <Illustration
                  noCrop
                  sizes={getSizes([340, 480])}
                  slug="curriculum-approach"
                  $objectFit="contain"
                  $objectPosition={"center"}
                  fill
                  format={null}
                />
              </Cover>
            </OakFlex>

            <OakFlex
              $flexDirection="column"
              $gap={"spacing-48"}
              $flexGrow={[null, 1]}
              $flexBasis={[null, 0]}
              $pb={["spacing-16", "spacing-0"]}
            >
              <CurricQuote
                title="Evidence-informed"
                barColor="border-decorative1-stronger"
              >
                Our approach enables the rigorous application of research
                outcomes, science of learning and impactful best practice.
              </CurricQuote>
              <CurricQuote
                title="Knowledge and vocabulary rich"
                barColor="border-decorative1-stronger"
              >
                Our curriculum is knowledge and vocabulary rich so that pupils
                build on what they already know to develop deep knowledge and
                apply this through skills.
              </CurricQuote>
              <CurricQuote
                title="Sequenced and coherent"
                barColor="border-decorative1-stronger"
              >
                We carefully and purposefully sequence our curriculum to ensure
                that pupils can build on and make links with existing knowledge.
                We pay attention to vertical coherence via threads, which map
                the developments of concepts over time.
              </CurricQuote>
              <CurricQuote
                title="Flexible"
                barColor="border-decorative1-stronger"
              >
                Our curriculum is flexible by design so that schools can use
                them in a way to fit their setting and meet the varying needs of
                teachers and their pupils - all aligned to the national
                curriculum.
              </CurricQuote>
              <CurricQuote
                title="Accessible"
                barColor="border-decorative1-stronger"
              >
                Our curriculum is designed to support all pupils to learn and
                follows accessibility guidelines. It uses insights from the
                science of learning to inform how content is designed and
                presented.
              </CurricQuote>
              <CurricQuote
                title="Diverse"
                barColor="border-decorative1-stronger"
              >
                Our commitment to breadth and diversity in content, language,
                texts and media can be seen throughout our curriculum, to help
                pupils feel positively represented.
              </CurricQuote>
            </OakFlex>
          </StyledResponsiveFlex>
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
