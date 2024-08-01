/* istanbul ignore file */
// This page should be deleted once the `use-auth` feature flag is removed
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import LessonDownloadsPage from "./downloads";

export { getStaticPaths, getStaticProps } from "./downloads";

export default withPageAuthRequired(LessonDownloadsPage);
