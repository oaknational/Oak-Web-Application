"use client";

import { OakBreadcrumbs } from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

export const UnitBreadCrumbs = ({
  data,
}: {
  data: TeachersUnitOverviewData;
}) => {
  let optionalPfs = "";
  if (data.tierTitle) {
    optionalPfs += `, ${data.tierTitle}`;
  }
  if (data.examBoardTitle) {
    optionalPfs += `, ${data.examBoardTitle}`;
  }

  return (
    <OakBreadcrumbs
      breadcrumbs={[
        {
          text: `${data.subjectTitle}, ${data.phaseTitle}, ${data.keyStageTitle}, ${data.yearTitle}${optionalPfs}`,
          href: resolveOakHref({
            page: "teacher-programme",
            subjectPhaseSlug: `${data.subjectSlug}-${data.phaseSlug}`,
            tab: "units",
          }),
        },
        {
          text: data.unitTitle,
        },
      ]}
    />
  );
};
