import { FC } from "react";

import { TeachersKeyStageSubjectsData } from "../../../node-lib/curriculum-api";
import SubjectCardLink from "../../Card/SubjectCardLink";
import Flex from "../../Flex";
import Grid, { GridArea } from "../../Grid";
import MaxWidth from "../../MaxWidth/MaxWidth";
import Typography, { Heading } from "../../Typography";

type SubjectListingProps = {
  subjects: TeachersKeyStageSubjectsData["subjects"];
};

export type SubjectListGridProps = {
  subjects: TeachersKeyStageSubjectsData["subjects"];
};

const SubjectListGrid: FC<SubjectListGridProps> = ({ subjects }) => {
  return (
    <Grid $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
      {subjects.map((subject) => {
        return (
          <GridArea
            key={`subject-list-item-${subject.slug}`}
            $colSpan={[6, 3, 2]}
          >
            <SubjectCardLink {...subject} />{" "}
          </GridArea>
        );
      })}
    </Grid>
  );
};

const SubjectListingPage: FC<SubjectListingProps> = (props) => {
  const { subjects } = props;

  // const { subjectListData, unavailableSubjectListData } = props.subjects;
  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Flex $pv={20}>
          <Typography $font={"body-2"}>{subjects.length} subjects</Typography>
        </Flex>
        <Heading $font={"heading-5"} tag={"h5"} $mb={30}>
          All subjects
        </Heading>
        <SubjectListGrid subjects={subjects} />
        {/* <Heading $font={"heading-7"} tag={"h6"} $mv={16}>
          Coming soon
        </Heading>
        <SubjectListGrid subjects={subjects} /> */}
      </MaxWidth>
    </Flex>
  );
};

export default SubjectListingPage;
