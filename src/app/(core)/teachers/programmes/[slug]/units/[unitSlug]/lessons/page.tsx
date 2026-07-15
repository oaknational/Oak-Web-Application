import { UnitView } from "./Components/UnitView";
import {
  getCachedUnitData,
  redirectUnitPageIfNeeded,
} from "./getCachedUnitData";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForUnit } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

type LessonsPageParams = { slug: string; unitSlug: string };

export const dynamic = "force-static";

export { generateMetadata } from "./generateMetadata";

const InnerUnitPage = async (props: AppPageProps<LessonsPageParams>) => {
  const { slug: programmeSlug, unitSlug } = await props.params;

  await redirectUnitPageIfNeeded({ programmeSlug, unitSlug });

  const data = await getCachedUnitData(programmeSlug, unitSlug);

  const programmeState = getProgrammeStateForUnit(data);

  return (
    <TeacherBrowseAnalyticsStoreProvider programmeState={{ programmeState }}>
      <UnitView {...data} isEnabled={false} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
