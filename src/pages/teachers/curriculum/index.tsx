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
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { decorateWithIsr } from "@/node-lib/isr";
import curriculumApi2023, {
  CurriculumPhaseOptions,
} from "@/node-lib/curriculum-api-2023";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import Cover from "@/components/SharedComponents/Cover/Cover";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import HomepageCurriculumLandingHero from "@/components/GenericPagesComponents/HomepageCurriculumLandingHero";
import CurricInfoCard from "@/components/CurriculumComponents/CurricInfoCard";
import CurricQuote from "@/components/CurriculumComponents/CurricQuote";

export type CurriculumHomePageProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
};

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: ${({ theme }) => theme.colors.mint30};
  margin: 80px 0;
  border-radius: 20px;

  /* Mobile */
  flex-direction: column;
  gap: 72px;
  padding: 24px;

  /* Tablet */
  @media (min-width: 750px) {
    gap: 80px;
    padding: 64px;
  }

  /* Large Tablet / Small Desktop */
  @media (min-width: 1000px) {
    flex-direction: row;
  }

  /* Desktop */
  @media (min-width: 1280px) {
    gap: 120px;
    padding: 80px;
  }
`;

const CurriculumHomePage: NextPage<CurriculumHomePageProps> = (props) => {
  const { curriculumPhaseOptions } = props;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title:
            "Free curriculum plans aligned with National Curriculum  | Oak National Academy",
          description:
            "Discover our free curriculum plans across subjects from KS1 to KS4, all high-quality, fully-sequenced and aligned with the national curriculum.",
        }),
      }}
      $background={"mint"}
    >
      <OakMaxWidth $ph={"inner-padding-m"}>
        <OakBox $mt={"space-between-m"}>
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
            hrColor={"white"}
            $mt={"space-between-m"}
            $height={"all-spacing-1"}
          />
        </OakBox>
      </OakMaxWidth>
      <OakMaxWidth $ph={"inner-padding-l"}>
        <OakFlex
          $flexDirection={"column"}
          $pt={"inner-padding-xl2"}
          $pb={"inner-padding-xl4"}
        >
          <OakHeading
            tag="h1"
            $font={["heading-3", "heading-2"]}
            $mb={["space-between-l", "space-between-l", "space-between-l"]}
            $background={"mint"}
            $textAlign={["left", "center"]}
            $color={"black"}
          >
            Oak's curricula
          </OakHeading>

          <OakFlex
            $flexDirection={["column", "row"]}
            $flexWrap="wrap"
            $gap="all-spacing-4"
            $alignItems="stretch"
          >
            <CurricInfoCard
              iconName="clipboard"
              background="mint30"
              iconHeight={"all-spacing-14"}
              iconWidth={"all-spacing-9"}
            >
              National curriculum and exam board aligned
            </CurricInfoCard>
            <CurricInfoCard
              iconName="free-tag"
              background="mint30"
              iconHeight="all-spacing-14"
              iconWidth="all-spacing-13"
            >
              Free and always will be
            </CurricInfoCard>
            <CurricInfoCard
              iconName="book-steps"
              background="mint30"
              iconHeight="all-spacing-14"
              iconWidth="all-spacing-12"
            >
              Covers key stages 1-4 across 20 subjects
            </CurricInfoCard>
            <CurricInfoCard
              iconName="threads"
              background="mint30"
              iconHeight="all-spacing-14"
              iconWidth="all-spacing-11"
            >
              Fully sequenced and ready to adapt
            </CurricInfoCard>
          </OakFlex>
        </OakFlex>
      </OakMaxWidth>
      <OakFlex $background={"white"} $justifyContent={"center"}>
        <OakMaxWidth
          $ph={"inner-padding-l"}
          $maxWidth={["100%", "all-spacing-24"]}
        >
          <StyledContainer>
            <OakFlex
              $flexDirection="column"
              $alignItems={["center", "center", "flex-start"]}
              $gap={["all-spacing-11"]}
              $flexGrow={[null, 1]}
              $flexBasis={[null, 0]}
            >
              <OakFlex $flexDirection="column">
                <OakHeading
                  tag="h2"
                  $font={["heading-4", "heading-3"]}
                  $mt="space-between-xs"
                >
                  Our guiding principles
                </OakHeading>

                <OakP
                  $mv={["space-between-s", "space-between-m"]}
                  $font={"body-1"}
                >
                  We have crafted a set of overarching principles that describe
                  the features important to our curricula in all subjects.
                </OakP>
              </OakFlex>

              <Cover
                $width={[300, 320, 450]}
                $height={[270, 300, 420]}
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
              $gap={"space-between-l"}
              $flexGrow={[null, 1]}
              $flexBasis={[null, 0]}
              $pb={["inner-padding-m", "inner-padding-none"]}
            >
              <CurricQuote title="Evidence-informed" barColor="mint110">
                Our approach enables the rigorous application of research
                outcomes, science of learning and impactful best practice.
              </CurricQuote>
              <CurricQuote
                title="Knowledge and vocabulary rich"
                barColor="mint110"
              >
                Our curriculum is knowledge and vocabulary rich so that pupils
                build on what they already know to develop deep knowledge and
                apply this through skills.
              </CurricQuote>
              <CurricQuote title="Sequenced and coherent" barColor="mint110">
                We carefully and purposefully sequence our curriculum to ensure
                that pupils can build on and make links with existing knowledge.
                We pay attention to vertical coherence via threads, which map
                the developments of concepts over time.
              </CurricQuote>
              <CurricQuote title="Flexible" barColor="mint110">
                Our curriculum is flexible by design so that schools can use
                them in a way to fit their setting and meet the varying needs of
                teachers and their pupils - all aligned to the national
                curriculum.
              </CurricQuote>
              <CurricQuote title="Accessible" barColor="mint110">
                Our curriculum is designed to support all pupils to learn and
                follows accessibility guidelines. It uses insights from the
                science of learning to inform how content is designed and
                presented.
              </CurricQuote>
              <CurricQuote title="Diverse" barColor="mint110">
                Our commitment to breadth and diversity in content, language,
                texts and media can be seen throughout our curriculum, to help
                pupils feel positively represented.
              </CurricQuote>
            </OakFlex>
          </StyledContainer>
        </OakMaxWidth>
      </OakFlex>
      <OakFlex $justifyContent={"flex-start"} $background={"mint"}>
        <OakMaxWidth
          $ph={["inner-padding-l"]}
          $maxWidth={["100%", "all-spacing-24"]}
        >
          <OakFlex $mv="space-between-xl">
            <HomepageCurriculumLandingHero
              curriculumPhaseOptions={curriculumPhaseOptions}
            />
          </OakFlex>
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
    };
  };

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const data = await fetchSubjectPhasePickerData();

  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      curriculumPhaseOptions: data,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default CurriculumHomePage;
