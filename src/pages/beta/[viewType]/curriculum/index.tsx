import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppLayout";
import Box from "@/components/Box";
import Flex from "@/components/Flex";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { Heading, UL, LI, P } from "@/components/Typography";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { ViewType } from "@/common-lib/urls";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Illustration from "@/components/Illustration/Illustration";
import Cover from "@/components/Cover/Cover";
import { getSizes } from "@/components/CMSImage/getSizes";
import OakLink from "@/components/OakLink/OakLink";
import Typography from "@/components/Typography/Typography";
import Icon from "@/components/Icon/Icon";
import CMSClient from "@/node-lib/cms";
import { BlogPostPreview } from "@/common-lib/cms-types";
import { serializeDate } from "@/utils/serializeDate";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
// import PostList from "@/components/Posts/PostList/PostList";
// import usePostList from "@/components/Posts/PostList/usePostList";
// import PostListItem from "@/components/Posts/PostList/PostListItem/PostListItem";

export type CurriculumHomePageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumBlogs: BlogPostPreview[];
};

const CurriculumHomePage: NextPage<CurriculumHomePageProps> = (props) => {
  const { subjectPhaseOptions, curriculumBlogs } = props;
  console.log(curriculumBlogs, "< curriculumBlogs");

  // const curriculumBlogProps = usePostList({
  //   items: curriculumBlogs,
  //   withImage: true,
  // });

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
              A collection of high quality resources to support you, whether
              you're looking for exemplars or help with starting from scratch.
            </Heading>
          </Box>
        </MaxWidth>
      </Flex>
      <Flex $background={"white"} $pv={[48]}>
        <MaxWidth>
          <Box $ph={[16, 0]} $pb={[24]}>
            <Heading tag={"h2"} $font={"heading-light-6"} $mb={16}>
              Oak's Curricula
            </Heading>
            <SubjectPhasePicker {...subjectPhaseOptions} />
          </Box>
        </MaxWidth>
      </Flex>
      <Flex $background={"white"} $justifyContent={"center"}>
        <MaxWidth>
          <Flex
            $flexDirection={["column", "row"]}
            $justifyContent={"space-between"}
            $alignItems={"center"}
            $gap={[24, 120]}
            $mb={80}
          >
            <Box>
              <Cover $width={480} $height={450} $position={"relative"}>
                <Illustration
                  noCrop
                  sizes={getSizes([500, 800])}
                  slug="curriculum-approach"
                  $objectFit="contain"
                  $objectPosition={"center"}
                  fill
                />
              </Cover>
            </Box>
            <Box $height={"100%"}>
              <Heading tag="h2" $font={["heading-5", "heading-4"]} $mt={12}>
                Our approach to curriculum
              </Heading>
              <P $mv={24} $font={"body-1"}>
                Every school’s approach to curriculum design is different.
                Whether you are starting from scratch or refreshing your
                existing curricula, it can be helpful to see examples to inspire
                your own. Explore our curriculum sequences and learn about the
                six curriculum principles that guide our lesson and curriculum
                design. See how we have:
              </P>
              <UL $mb={24} $font={"list-item-1"}>
                <LI>
                  Sequenced subject units across year groups, including
                  alternative sequences
                </LI>
                <LI>Built coherence through the curricula, using threads</LI>
                <LI>
                  Summarised the core content pupils will learn, in our
                  curriculum statements
                </LI>
              </UL>
              <Typography $font={"heading-7"} $mb={12}>
                <OakLink
                  page={"webinar-index"}
                  $display={"flex"}
                  $alignItems={"center"}
                >
                  Read more about our approach to curriculum
                  <Icon name={"chevron-right"} />
                </OakLink>
              </Typography>
            </Box>
          </Flex>
          <Flex $background={"grey1"} $position={"relative"} $height={812}>
            <Box $pa={48}>
              <Heading tag="h3" $font={"heading-4"}>
                Our blogs on curriculum design
              </Heading>
              {/* {curriculumBlogs.length ? (
                <>
                  <UL $reset>
                    {curriculumBlogs.map((item, i) => (
                      <LI key={`PostList-PostListItem-${i}`}>
                        {i !== 0 && <Hr thickness={4} $mv={32} />}
                        <PostListItem
                          {...item}
                          withImage={true}
                          firstItemRef={null}
                        />
                      </LI>
                    ))}
                  </UL>
                  {<Hr thickness={4} $mt={32} $mb={0} />}
                </>
              ) : null} */}
            </Box>
            <BrushBorders color="grey1" />
          </Flex>
        </MaxWidth>
      </Flex>
    </AppLayout>
  );
};

export type URLParams = {
  viewType: ViewType;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const newSubjects = await curriculumApi2023.subjectPhaseOptions();
    // Legacy data is hardcoded
    const legacySubjects: [string, string, boolean][] = [
      ["Art & Design", "art", true],
      ["Citizenship", "citizenship", false],
      ["Computing", "computing", true],
      ["Design & Technology", "design-technology", true],
      ["Drama", "drama", true],
      ["English", "english", true],
      ["French", "french", true],
      ["Geography", "geography", true],
      ["German", "german", false],
      ["History", "history", true],
      ["Latin", "latin", false],
      ["Maths", "maths", true],
      ["Music", "music", true],
      ["Physical Education", "physical-education", true],
      ["Physics", "physics", false],
      ["Religious Education", "religious-education", true],
      ["RSHE (PSHE)", "rshe-pshe", true],
      ["Science", "science", true],
      ["Spanish", "spanish", true],
    ];

    const phases = [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ];

    return {
      newSubjects: newSubjects,
      legacySubjects: legacySubjects.map((subject) => {
        return {
          title: subject[0],
          slug: subject[1],
          phases: subject[2] ? phases : phases.slice(1),
        };
      }),
    };
  };

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const data = await fetchSubjectPhasePickerData();

  const blogs = await CMSClient.blogPosts({
    previewMode: true,
  });

  const curriculumBlogs = blogs
    .filter((blog) => {
      if (
        blog.slug === "how-to-design-a-subject-curriculum" ||
        blog.slug === "how-to-refresh-your-curriculum-using-oak-units" ||
        blog.slug === "how-to-design-a-unit-of-study"
      ) {
        return blog;
      }
    })
    .map(serializeDate);

  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      subjectPhaseOptions: data,
      curriculumBlogs: curriculumBlogs,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default CurriculumHomePage;
