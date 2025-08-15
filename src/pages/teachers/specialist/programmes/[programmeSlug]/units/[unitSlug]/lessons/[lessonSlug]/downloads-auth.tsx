/* istanbul ignore file */
// This page should be deleted once the `use-auth` feature flag is removed
import SpecialistLessonDownloadsPage from "./downloads";

import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

export { getStaticPaths, getStaticProps } from "./downloads";

export default withPageAuthRequired(
  withOnboardingRequired(SpecialistLessonDownloadsPage),
  Wall,
);
