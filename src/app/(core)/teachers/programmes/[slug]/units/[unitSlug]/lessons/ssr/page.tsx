import { UnitView } from "../Components/UnitView";
import {
  getCachedUnitData,
  redirectUnitPageIfNeeded,
} from "../getCachedUnitData";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";

type LessonsPageParams = { slug: string; unitSlug: string };

export const dynamic = "force-dynamic";

export { generateMetadata } from "../generateMetadata";

const InnerUnitPage = async (props: AppPageProps<LessonsPageParams>) => {
  const { slug: programmeSlug, unitSlug } = await props.params;

  await redirectUnitPageIfNeeded({ programmeSlug, unitSlug });

  const featureFlag = await getFeatureFlagValue("test-flag", "string");

  const data = await getCachedUnitData(programmeSlug, unitSlug);

  return <UnitView {...data} isEnabled={featureFlag === "test"} />;
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
