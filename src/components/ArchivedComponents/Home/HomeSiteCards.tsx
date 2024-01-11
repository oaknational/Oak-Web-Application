import useAnalytics from "@/context/Analytics/useAnalytics";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import CardLinkIcon from "@/components/SharedComponents/Card/CardLinkIcon";

const HomeSiteCards = () => {
  const { track } = useAnalytics();

  return (
    <Grid $cg={[8, 16]} $ph={[12, 0]}>
      <GridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="lesson-planning"
          title={"Plan a lesson"}
          titleTag={"h4"}
          background="mint"
          htmlAnchorProps={{ onClick: track.planALessonSelected }}
        />
      </GridArea>
      <GridArea $transform={["translateY(50%)"]} $colSpan={[12, 4]}>
        <CardLinkIcon
          page="develop-your-curriculum"
          title={"Develop your curriculum"}
          titleTag={"h4"}
          background={"lemon"}
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
          background={"pink"}
          htmlAnchorProps={{
            onClick: track.supportYourTeamSelected,
          }}
        />
      </GridArea>
    </Grid>
  );
};

export default HomeSiteCards;
