import useAnalytics from "../../../context/Analytics/useAnalytics";
import CardLinkIcon from "../../Card/CardLinkIcon";
import Grid, { GridArea } from "../../Grid";

const HomeSiteCards = () => {
  const { track } = useAnalytics();

  return (
    <Grid $cg={[8, 16]} $ph={[12, 0]}>
      <GridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="lesson-planning"
          title={"Plan a lesson"}
          titleTag={"h4"}
          background="pupilsLimeGreen"
          htmlAnchorProps={{ onClick: track.planALessonSelected }}
        />
      </GridArea>
      <GridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="develop-your-curriculum"
          title={"Develop your curriculum"}
          titleTag={"h4"}
          background={"teachersYellow"}
          htmlAnchorProps={{
            onClick: track.developYourCurriculumSelected,
          }}
        />
      </GridArea>
      <GridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="support-your-team"
          title={"Support your team"}
          titleTag={"h4"}
          background={"pupilsPink"}
          htmlAnchorProps={{
            onClick: track.supportYourTeamSelected,
          }}
        />
      </GridArea>
    </Grid>
  );
};

export default HomeSiteCards;
