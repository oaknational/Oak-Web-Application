import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";

const ProgrammePage = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const { subjectPhaseSlug } = await params;
  const isEnabled = await useFeatureFlag(
    "teachers-integrated-journey",
    "boolean",
  );

  return isEnabled ? (
    <div>
      <h1>{subjectPhaseSlug}</h1>
    </div>
  ) : (
    notFound()
  );
};

export default ProgrammePage;
