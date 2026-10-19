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

// We are using dynamic route segments so we can't enable instant navigation without
// prefetching all possible routes with generateStaticParams. Longer term we'd want to
// use Suspense boundaries to enable instant loading with data streaming
export const instant = false;

type LessonsPageParams = { slug: string; unitSlug: string };

export { generateMetadata } from "./generateMetadata";

const InnerUnitPage = async (props: AppPageProps<LessonsPageParams>) => {
  const { slug: programmeSlug, unitSlug } = await props.params;

  await redirectUnitPageIfNeeded({ programmeSlug, unitSlug });

  const data = await getCachedUnitData(programmeSlug, unitSlug);

  const programmeState = getProgrammeStateForUnit(data);
  const unitDownloadExistence = await getUnitDownloadExistence(
    getUnitDownloadFileId(data.unitTitle, data.unitvariantId),
  );

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={programmeState}
      accessLevel="unit"
    >
      <UnitView {...data} unitDownloadExistence={unitDownloadExistence} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
