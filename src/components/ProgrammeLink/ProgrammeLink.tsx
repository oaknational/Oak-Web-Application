import { KeyStageTitleValueType } from "../../browser-lib/avo/Avo";
import useAnalytics from "../../context/Analytics/useAnalytics";
import useAnalyticsUseCase from "../../hooks/useAnalyticsUseCase";
import { ProgrammesData } from "../../node-lib/curriculum-api";
import OakLink from "../OakLink";

function ProgrammeLink({ programme }: { programme: ProgrammesData }) {
  const { programmeSlug, title } = programme;
  const { track } = useAnalytics();
  const analyticsUseCase = useAnalyticsUseCase();
  return (
    <OakLink
      page="programme"
      programme={programmeSlug}
      onClick={() => {
        track.subjectSelected({
          keyStageTitle: "Key stage 4" as KeyStageTitleValueType, // TODO when keystage is added to programmes mv pass it in here
          keyStageSlug: "ks4",
          subjectTitle: title,
          subjectSlug: programmeSlug,
          analyticsUseCase,
        });
      }}
    >
      {title}
    </OakLink>
  );
}

export default ProgrammeLink;
