// import { getFallbackBlockingConfig, shouldSkipInitialBuild } from "@/node-lib/isr";
// import { GetStaticPathsResult, GetStaticProps } from "next";

// export type LessonListingPageProps = {
//     curriculumData: LessonListingPageData;
//   };

// export type URLParams = {
//     programmeSlug: string;
//     unitSlug: string;
//   };

//   export const getStaticPaths = async () => {
//     if (shouldSkipInitialBuild) {
//       return getFallbackBlockingConfig();
//     }

//     const config: GetStaticPathsResult<URLParams> = {
//       fallback: "blocking",
//       paths: [],
//     };
//     return config;
//   };

//   export const getStaticProps: GetStaticProps<
//     LessonListingPageProps,
//     URLParams
//   > = async (context) => {
//     return getPageProps({
//       page: "lesson-listing::getStaticProps",
//       context,
//       getProps: async () => {
//         if (!context.params) {
//           throw new Error("no context.params");
//         }
//         const { programmeSlug, unitSlug } = context.params;
//         if (!programmeSlug || !unitSlug) {
//           throw new Error("unexpected context.params");
//         }

//         const curriculumData = await curriculumApi2023.lessonListing({
//           programmeSlug,
//           unitSlug,
//         });

//         if (!curriculumData) {
//           return {
//             notFound: true,
//           };
//         }

//         const results: GetStaticPropsResult<LessonListingPageProps> = {
//           props: {
//             curriculumData,
//           },
//         };
//         return results;
//       },
//     });
//   };

//   export default LessonListPage;
