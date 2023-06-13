import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import { BETA_SEO_PROPS } from "browser-lib/seo/Seo";
import AppLayout from "components/AppLayout";
import Box from "components/Box";
import Flex from "components/Flex";
import MaxWidth from "components/MaxWidth/MaxWidth";
import { Heading, UL, LI } from "components/Typography";
import curriculumApi, { CurriculumHomePageData } from "node-lib/curriculum-api";
import { decorateWithIsr } from "node-lib/isr";
import Icon from "components/Icon";

type CurriculumHomePageProps = {
  curriculumData: CurriculumHomePageData;
};

const Curriculum: NextPage<CurriculumHomePageProps> = (props) => {
  const { curriculumData } = props;
  console.log(curriculumData);

  return (
    <AppLayout seoProps={BETA_SEO_PROPS} $background={"grey1"}>
      <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
        <MaxWidth>
          <Box $ph={[16, 0]} $pb={[18, 48, 48]}>
            <Heading
              $font={["heading-5", "heading-4"]}
              tag={"h1"}
              $mt={120}
              $color={"black"}
            >
              Curriculum Resources
            </Heading>
            <Heading $font={"heading-light-6"} tag={"h2"} $mv={8}>
              A collection of resources to support, whether you’re looking
              to.....
            </Heading>
          </Box>
        </MaxWidth>
      </Flex>
      <Flex $background={"teachersPastelYellow"} $justifyContent={"center"}>
        <MaxWidth>
          <Box $ph={[16, 0]} $pv={[24, 48]}>
            <Heading $font={"heading-light-6"} tag={"h2"} $mt={8}>
              Oak's Curricula
            </Heading>
            <UL $reset={true}>
              <LI>
                <Icon name="tick" />
                Free
              </LI>
              <LI>
                <Icon name="tick" />
                Full sequenced
              </LI>
              <LI>
                <Icon name="tick" />
                Aligned to the National Curriculum
              </LI>
              <LI>
                <Icon name="tick" />
                Downloadable & adaptable resources
              </LI>
              <LI>
                <Icon name="tick" />
                Created by teachers, for teachers
              </LI>
            </UL>
            <p>
              Brief intro to say our curriculum is free, fully sequenced,
              aligned to the National curriculum, approved by Ofsted and
              downloadable & adaptable...
            </p>
          </Box>
        </MaxWidth>
      </Flex>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const curriculumData = await curriculumApi.curriculumHomePage();
  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      curriculumData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default Curriculum;
