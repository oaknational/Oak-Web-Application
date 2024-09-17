/* istanbul ignore file */
// This page should be deleted once the `use-auth` feature flag is removed
import LessonDownloadsPage from "./downloads";

import { Wall } from "@/components/AppComponents/Wall";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";

export { getStaticPaths, getStaticProps } from "./downloads";

export default withPageAuthRequired(
  withOnboardingRequired(LessonDownloadsPage, Wall),
  Wall,
);
