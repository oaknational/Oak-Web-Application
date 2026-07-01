import { cookies } from "next/headers";

import { UnitView } from "../Components/UnitView";
import {
  getCachedUnitData,
  redirectUnitPageIfNeeded,
} from "../getCachedUnitData";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { EXPERIMENT_COOKIE } from "@/middleware";

type LessonsPageParams = { slug: string; unitSlug: string };

export const dynamic = "force-dynamic";

export { generateMetadata } from "../generateMetadata";

const InnerUnitPage = async (props: AppPageProps<LessonsPageParams>) => {
  const { slug: programmeSlug, unitSlug } = await props.params;

  await redirectUnitPageIfNeeded({ programmeSlug, unitSlug });

  const cookieStore = await cookies();
  const experimentCookie = cookieStore.get(EXPERIMENT_COOKIE);
  let isEnabled = experimentCookie?.value === "test";

  if (!experimentCookie) {
    const featureFlag = await getFeatureFlagValue("test-flag", "string");
    if (featureFlag) {
      cookieStore.set(EXPERIMENT_COOKIE, featureFlag);
      isEnabled = featureFlag === "test";
    }
  }

  const data = await getCachedUnitData(programmeSlug, unitSlug);

  return <UnitView {...data} isEnabled={isEnabled} />;
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
