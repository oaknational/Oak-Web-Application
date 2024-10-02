import { OakPupilJourneyYearButton } from "@oaknational/oak-components";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

export const BrowsePathwaySelector = ({
  pathways,
  phaseSlug,
  onClick,
}: {
  pathways: PathwayData[];
  phaseSlug: PupilProgrammeListingData["programmeFields"]["phaseSlug"];
  onClick: (pathway: PathwayData) => void;
}) => {
  const orderedPathways = pathways.sort(
    (a, b) => (a.pathwayDisplayOrder ?? 0) - (b.pathwayDisplayOrder ?? 0),
  );

  if (phaseSlug === "foundation" || !phaseSlug) {
    throw new Error("Foundation phase is not supported");
  }

  return (
    <>
      {" "}
      {orderedPathways.map((pathway, i) => (
        <OakPupilJourneyYearButton
          phase={phaseSlug}
          key={pathway.pathwaySlug}
          onClick={() => onClick(pathway)}
          role="button"
        >
          {pathway.pathway}
        </OakPupilJourneyYearButton>
      ))}
    </>
  );
};
