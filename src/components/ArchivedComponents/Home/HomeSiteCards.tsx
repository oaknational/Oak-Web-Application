import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

import useAnalytics from "@/context/Analytics/useAnalytics";
import CardLinkIcon from "@/components/SharedComponents/Card/CardLinkIcon";

const HomeSiteCards = () => {
  const { track } = useAnalytics();

  return (
    <OakGrid
      $cg={["space-between-ssx", "space-between-s"]}
      $ph={["inner-padding-s", "inner-padding-none"]}
    >
      <OakGridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="lesson-planning"
          title={"Plan a lesson"}
          titleTag={"h4"}
          background="mint"
          htmlAnchorProps={{ onClick: track.planALessonSelected }}
        />
      </OakGridArea>
      <OakGridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="develop-your-curriculum"
          title={"Develop your curriculum"}
          titleTag={"h4"}
          background={"lemon"}
          htmlAnchorProps={{
            onClick: track.developYourCurriculumSelected,
          }}
        />
      </OakGridArea>
      <OakGridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="support-your-team"
          title={"Support your team"}
          titleTag={"h4"}
          background={"pink"}
          htmlAnchorProps={{
            onClick: track.supportYourTeamSelected,
          }}
        />
      </OakGridArea>
    </OakGrid>
  );
};

export default HomeSiteCards;
