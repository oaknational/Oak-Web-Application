import { FC } from "react";

import { TeachersKeyStageSubjectsData } from "../../node-lib/curriculum-api";
import Grid, { GridArea } from "../Grid";

import SubjectCardListItem from "./SubjectCardListItem";

export type SubjectCardListProps = {
  subjects: TeachersKeyStageSubjectsData["subjects"];
};

const SubjectCardList: FC<SubjectCardListProps> = ({ subjects }) => {
  return (
    <Grid $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
      {subjects.map((subject) => {
        return (
          <GridArea
            key={`subject-list-item-${subject.slug}`}
            $colSpan={[6, 3, 2]}
          >
            <SubjectCardListItem {...subject} />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default SubjectCardList;
