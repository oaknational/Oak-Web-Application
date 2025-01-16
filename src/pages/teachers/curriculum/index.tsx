import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import {
  OakHeading,
  OakTypography,
  OakUL,
  OakLI,
  OakP,
  OakIcon,
  OakHandDrawnHR,
  OakBox,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { decorateWithIsr } from "@/node-lib/isr";
import curriculumApi2023, {
  SubjectPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import Cover from "@/components/SharedComponents/Cover/Cover";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import OwaLink from "@/components/SharedComponents/OwaLink/OwaLink";
import CMSClient from "@/node-lib/cms";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import { blogToPostListItem } from "@/components/GenericPagesViews/BlogIndex.view";
import { serializeDate } from "@/utils/serializeDate";
import PostListItem from "@/components/SharedComponents/PostListItem";
import { SerializedBlogPostPreview } from "@/common-lib/cms-types";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import HomepageCurriculumLandingHero from "@/components/GenericPagesComponents/HomepageCurriculumLandingHero";

export type CurriculumHomePageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
  posts: SerializedBlogPostPreview[];
};

const CurriculumHomePage: NextPage<CurriculumHomePageProps> = (props) => {
  const { subjectPhaseOptions, posts } = props;
  const curriculumBlogs = posts.map(blogToPostListItem);

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
      $background={"grey20"}
    >
      <Flex $justifyContent={"center"} $background={"mint"}>
        <OakMaxWidth $ph={"inner-padding-m"}>
          <Box $mt={20}>
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
                  label: "Curriculum resources",
                },
              ]}
            />
            <OakHandDrawnHR
              hrColor={"white"}
              $mt={"space-between-m"}
              $height={"all-spacing-1"}
            />
          </Box>
          <Flex $mt={[24, 80]} $mb={[80]}>
            <HomepageCurriculumLandingHero
              subjectPhaseOptions={subjectPhaseOptions}
            />
          </Flex>
        </OakMaxWidth>
      </Flex>

      <Flex $background={"white"} $justifyContent={"center"}>
        <OakMaxWidth>
          <Flex
            $flexDirection={["column", "row"]}
            $justifyContent={"space-between"}
            $alignItems={"center"}
            $gap={[24, 80, 120]}
            $mb={80}
            $pl={[16, 0]}
            $pr={[16, 0]}
            $mt={80}
          >
            <Box>
              <Cover
                $width={[320, 340, 480]}
                $height={[300, 320, 450]}
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
                  alt="Our guiding curriculum principles summarise the important features of great curricula. They are: flexible, accessible, diverse, evidence informed, knowledge and vocabulary rich, sequenced and coherent"
                />
              </Cover>
            </Box>

            <OakBox $height={"100%"}>
              <OakHeading
                tag="h2"
                $font={["heading-5", "heading-4"]}
                $mt="space-between-xs"
              >
                Our approach to curriculum
              </OakHeading>
              <OakP
                $mv={["space-between-s", "space-between-m"]}
                $font={"body-1"}
              >
                Every school’s approach to curriculum design is different.
                Whether you are starting from scratch or refreshing your
                existing curricula, it can be helpful to see examples to inspire
                your own. Explore our curriculum sequences and learn about the
                six curriculum principles that guide our lesson and curriculum
                design. See how we have:
              </OakP>
              <OakUL $mb="space-between-m" $font={"list-item-1"}>
                <OakLI>
                  Sequenced subject units across year groups, including
                  alternative sequences
                </OakLI>
                <OakLI>
                  Built coherence through the curricula, using threads
                </OakLI>
                <OakLI>
                  Summarised the core content pupils will learn, in our
                  curriculum statements
                </OakLI>
              </OakUL>
              <OakTypography $font={"heading-7"} $mb="space-between-xs">
                <OwaLink
                  page={"blog-single"}
                  blogSlug="our-approach-to-curriculum"
                  $display={"flex"}
                  $alignItems={"center"}
                >
                  Read more about our approach
                  <OakIcon
                    iconName={"chevron-right"}
                    $width={"all-spacing-6"}
                    $height={"all-spacing-6"}
                  />
                </OwaLink>
              </OakTypography>
            </OakBox>
          </Flex>
          <Flex
            $background={"grey20"}
            $minHeight={812}
            $ml={[0, 12, 0]}
            $mr={[0, 12, 0]}
            $mb={[36, 48]}
          >
            <Box
              $pl={[24, 48]}
              $pr={[24, 48]}
              $pt={48}
              $mb={[48, 0]}
              $position={"relative"}
            >
              <OakHeading tag="h2" $font={"heading-4"} $mb="space-between-m">
                Our blogs on curriculum
              </OakHeading>
              {curriculumBlogs.length ? (
                <>
                  <OakUL $reset data-testid="blog-list">
                    {curriculumBlogs.map((item, i) => (
                      <OakLI
                        key={`PostList-PostListItem-${i}`}
                        data-testid="blog-list-item"
                      >
                        {i !== 0 && (
                          <OakHandDrawnHR
                            $height={"all-spacing-1"}
                            $mv={"space-between-m2"}
                          />
                        )}
                        <PostListItem
                          {...item}
                          showImageOnTablet={true}
                          withImage={true}
                          firstItemRef={null}
                        />
                      </OakLI>
                    ))}
                  </OakUL>
                  {
                    <OakHandDrawnHR
                      $height={"all-spacing-1"}
                      $mt={"space-between-m2"}
                    />
                  }
                </>
              ) : null}
              <BrushBorders color="grey20" hideOnMobileH />
            </Box>
          </Flex>
        </OakMaxWidth>
      </Flex>
    </AppLayout>
  );
};

const filterValidSubjectPhaseOptions = (subjects: SubjectPhaseOption[]) => {
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
    const subjects = await curriculumApi2023.subjectPhaseOptions({
      cycle: "2",
    });
    return {
      subjects: filterValidSubjectPhaseOptions(subjects),
    };
  };

export type Client = typeof CMSClient;

export async function fetchCurriculumPageBlogs(
  CMSClient: Client,
): Promise<SerializedBlogPostPreview[]> {
  const newCurriculumBlog = await CMSClient.blogPostBySlug(
    "our-new-curriculum-plans-are-here",
  );

  const subjectCurriculumBlog = await CMSClient.blogPostBySlug(
    "how-to-design-a-subject-curriculum",
  );

  const refreshCurriculumBlog = await CMSClient.blogPostBySlug(
    "how-to-refresh-your-curriculum-using-oak-units",
  );

  const designUnitBlog = await CMSClient.blogPostBySlug(
    "how-to-design-a-unit-of-study",
  );

  const blogs = [];

  if (
    newCurriculumBlog !== null &&
    subjectCurriculumBlog !== null &&
    refreshCurriculumBlog !== null &&
    designUnitBlog !== null
  ) {
    blogs.push(
      [
        newCurriculumBlog,
        subjectCurriculumBlog,
        refreshCurriculumBlog,
        designUnitBlog,
      ].map(serializeDate),
    );
  } else {
    throw new Error("Missing blog post");
  }

  return blogs.flat();
}

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const data = await fetchSubjectPhasePickerData();

  const posts = await fetchCurriculumPageBlogs(CMSClient);

  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      subjectPhaseOptions: data,
      posts,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default CurriculumHomePage;
