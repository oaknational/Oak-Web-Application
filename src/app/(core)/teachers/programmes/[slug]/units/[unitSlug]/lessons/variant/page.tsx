import { UnitView } from "../Components/UnitView";
import {
  getCachedUnitData,
  redirectUnitPageIfNeeded,
} from "../getCachedUnitData";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";

type LessonsPageParams = { slug: string; unitSlug: string };

export const dynamic = "force-static";

export { generateMetadata } from "../generateMetadata";

const InnerUnitPage = async (props: AppPageProps<LessonsPageParams>) => {
  const { slug: programmeSlug, unitSlug } = await props.params;

  await redirectUnitPageIfNeeded({ programmeSlug, unitSlug });

  const data = await getCachedUnitData(programmeSlug, unitSlug);

  return <UnitView {...data} isEnabled={true} />;
};

const UnitPage = withPageErrorHandling(InnerUnitPage, "unit-page::app");

export default UnitPage;
