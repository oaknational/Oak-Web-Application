import { UnitView } from "./Components/UnitView";
import {
  getCachedUnitData,
  getUnitDownloadExistence,
  redirectUnitPageIfNeeded,
} from "./getCachedUnitData";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForUnit } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import { getUnitDownloadFileId } from "@/utils/getUnitDownloadFileId";

type LessonsPageParams = { slug: string; unitSlug: string };

// Rendered per request so the download button isn't frozen in the page cache; the
// upstream calls are both cached in cacheData, so this costs renders, not API load.
export const dynamic = "force-dynamic";

export { generateMetadata } from "./generateMetadata";

const InnerUnitPage = async (props: AppPageProps<LessonsPageParams>) => {
  const { slug: programmeSlug, unitSlug } = await props.params;

  await redirectUnitPageIfNeeded({ programmeSlug, unitSlug });

  const data = await getCachedUnitData(programmeSlug, unitSlug);

  const programmeState = getProgrammeStateForUnit(data);
  const { exists, fileSize } = await getUnitDownloadExistence(
    getUnitDownloadFileId(data.unitTitle, data.unitvariantId),
  );

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={programmeState}
      accessLevel="unit"
    >
      <UnitView {...data} downloadExists={exists} fileSize={fileSize} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
