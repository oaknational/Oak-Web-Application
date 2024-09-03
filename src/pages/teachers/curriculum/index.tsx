import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import {
  OakHeading,
  OakTypography,
  OakUL,
  OakLI,
  OakP,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { Hr } from "@/components/SharedComponents/Typography";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { decorateWithIsr } from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import HomepageCurriculumLandingHero from "@/components/GenericPagesComponents/HomepageCurriculumLandingHero";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import Cover from "@/components/SharedComponents/Cover/Cover";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import OwaLink from "@/components/SharedComponents/OwaLink/OwaLink";
import Icon from "@/components/SharedComponents/Icon";
import CMSClient from "@/node-lib/cms";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import { blogToPostListItem } from "@/components/GenericPagesViews/BlogIndex.view";
import { serializeDate } from "@/utils/serializeDate";
import PostListItem from "@/components/SharedComponents/PostListItem";
import { SerializedBlogPostPreview } from "@/common-lib/cms-types";

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
          title: "Curriculum resources",
          description:
            "Explore our interactive curriculum tool for free, adaptable sequences perfectly aligned with the National Curriculum. Start browsing now.",
        }),
      }}
      $background={"grey20"}
    >
      <Flex $justifyContent={"center"} $background={"mint"}>
        <MaxWidth $ph={16}>
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
            <Hr $color={"white"} $mb={0} />
          </Box>
          <Flex $mt={[24, 80]} $mb={[80]}>
            <HomepageCurriculumLandingHero
              subjectPhaseOptions={subjectPhaseOptions}
            />
          </Flex>
        </MaxWidth>
      </Flex>

      <Flex $background={"white"} $justifyContent={"center"}>
        <MaxWidth>
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

            <Box $height={"100%"}>
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
                  <Icon name={"chevron-right"} />
                </OwaLink>
              </OakTypography>
            </Box>
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
                Our blogs on curriculum design
              </OakHeading>
              {curriculumBlogs.length ? (
                <>
                  <OakUL $reset data-testid="blog-list">
                    {curriculumBlogs.map((item, i) => (
                      <OakLI
                        key={`PostList-PostListItem-${i}`}
                        data-testid="blog-list-item"
                      >
                        {i !== 0 && <Hr thickness={4} $mv={32} />}
                        <PostListItem
                          {...item}
                          showImageOnTablet={true}
                          withImage={true}
                          firstItemRef={null}
                        />
                      </OakLI>
                    ))}
                  </OakUL>
                  {<Hr thickness={4} $mt={32} $mb={0} />}
                </>
              ) : null}
              <BrushBorders color="grey20" hideOnMobileH />
            </Box>
          </Flex>
        </MaxWidth>
      </Flex>
    </AppLayout>
  );
};

export const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const subjects = await curriculumApi2023.subjectPhaseOptions();
    return {
      subjects: subjects,
    };
  };

export type Client = typeof CMSClient;

export async function fetchCurriculumPageBlogs(
  CMSClient: Client,
): Promise<SerializedBlogPostPreview[]> {
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
    subjectCurriculumBlog !== null &&
    refreshCurriculumBlog !== null &&
    designUnitBlog !== null
  ) {
    blogs.push(
      [subjectCurriculumBlog, refreshCurriculumBlog, designUnitBlog].map(
        serializeDate,
      ),
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
